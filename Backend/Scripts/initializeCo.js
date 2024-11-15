const mongoose = require('mongoose');
const Counter = require('../models/counter'); // Correct path to the Counter model
const dburl = "mongodb+srv://chathu:1234@cluster0.2qyvl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB Atlas
mongoose.set("strictQuery", true);
mongoose.connect(dburl)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {
        console.error('Could not connect to MongoDB', err);
        process.exit(1); // Exit if unable to connect
    });

const initializeCounter = async () => {
    try {
        const existingCounter = await Counter.findById('orderId');
        if (!existingCounter) {
            await Counter.create({ _id: 'orderId', sequence_value: 0 });
            console.log('Counter initialized.');
        } else {
            console.log('Counter already exists.');
        }
    } catch (err) {
        console.error('Error initializing counter:', err);
    } finally {
        mongoose.connection.close();
    }
};

initializeCounter();
