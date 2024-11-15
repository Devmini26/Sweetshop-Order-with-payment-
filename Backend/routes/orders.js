const express = require("express");
const router = express.Router();
const Orders = require("../models/order");
const Counter = require("../models/counter");

// Test route
router.get("/test", (req, res) => res.send("Order routes working"));

// Create new order
router.post("/", async (req, res) => {
  try {
    // Increment the counter for the new OrderId
    const counter = await Counter.findByIdAndUpdate(
      "orderId", // Counter document ID
      { $inc: { sequence_value: 1 } }, // Increment sequence_value
      { new: true } // Return the updated document
    );

    if (!counter) {
      return res.status(500).json({ msg: "Counter not found" });
    }

    // Format the OrderId with leading zeros
    const orderId = String(counter.sequence_value).padStart(2, "0");

    // Create the order with the new OrderId
    const order = new Orders({ ...req.body, OrderId: orderId });
    await order.save();

    res.status(201).json({ msg: "Order added successfully", order });
  } catch (err) {
    res.status(400).json({ msg: "Order adding failed", error: err.message });
  }
});

// Get all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Orders.find();
    res.json(orders);
  } catch (error) {
    res.status(400).json({ msg: "No orders found" });
  }
});

// Get order by ID
router.get("/:OrderId", async (req, res) => {
  try {
    const order = await Orders.findOne({ OrderId: req.params.OrderId });
    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(400).json({ msg: "Cannot find this order" });
  }
});

// Update order by ID
router.put("/:OrderId", async (req, res) => {
  try {
    const updatedOrder = await Orders.findOneAndUpdate(
      { OrderId: req.params.OrderId },
      req.body,
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ msg: "Order not found" });
    }

    res.json({ msg: "Order updated successfully", order: updatedOrder });
  } catch (error) {
    res.status(400).json({ msg: "Update failed", error: error.message });
  }
});

// Delete order by ID
router.delete("/:OrderId", async (req, res) => {
  try {
    const deletedOrder = await Orders.findOneAndDelete({
      OrderId: req.params.OrderId,
    });

    if (!deletedOrder) {
      return res.status(404).json({ msg: "Order not found" });
    }

    res.json({ msg: "Order deleted successfully" });
  } catch (error) {
    res.status(400).json({ msg: "Delete failed", error: error.message });
  }
});

module.exports = router;
