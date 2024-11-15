// server.js
const express = require('express');
const cors = require('cors');
const connection = require('./db'); // Import the database connection module

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connection();

// Define the order schema and model
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    OrderId: String,
    Username: String,
    Email: String,
    Address: String,
    PhoneNum: String,
    Date: String,
    Time: String,
    Item: String,
    Qty: Number,
    TotalAmount: Number,
    paymentType: String,
    PaymentStatus: String,
    OrderStatus: String,
});

const Order = mongoose.model('Order', orderSchema);

// Fetch all orders
app.get('/orders', async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Add a new order
app.post('/orders', async (req, res) => {
    const newOrder = new Order(req.body);
    try {
        await newOrder.save();
        res.status(201).send(newOrder);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Update an order
app.put('/orders/:id', async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedOrder);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Delete an order
app.delete('/orders/:id', async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(400).send(err);
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
