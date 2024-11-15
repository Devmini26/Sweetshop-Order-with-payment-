const mongoose = require("mongoose");

const dburl = "mongodb+srv://chathu:1234@cluster0.2qyvl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.set("strictQuery", true); // Only need this

const connection = async () => {
    try {
        await mongoose.connect(dburl); // No need to pass deprecated options
        console.log("MongoDB Connected~");
    } catch (e) {
        console.error(e.message);
        process.exit();
    }
};

module.exports = connection;
