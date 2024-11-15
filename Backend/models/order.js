const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid'); // Import uuid for unique ID generation

const OrderSchema = new mongoose.Schema({
    OrderId: {
        type: String,
        unique: true,
        default: uuidv4 // Auto-generate unique OrderId using UUID
    },
    Username: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    Address: {
        type: String,
        required: true
    },
    PhoneNum: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /\d{10}/.test(v); // Ensure it's a 10-digit phone number
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    Date: {
        type: Date,
        required: true
    },
    Time: {
        type: String,
        required: true
    },
    Item: {
        type: String,
        required: true
    },
    Qty: {
        type: Number,
        required: true
    },
    TotalAmount: {
        type: Number,
        required: true
    },
    paymentType: {
        type: String,
        required: true
    },
    PaymentStatus: {
        type: String,
        enum: ['Pending', 'Success'],
        default: 'Pending'
    },
    OrderStatus: {
        type: String,
        enum: ['Pending', 'Completed'],
        default: 'Pending'
    }
});

module.exports = mongoose.model("Order", OrderSchema);
