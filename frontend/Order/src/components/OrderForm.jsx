import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import "./OrderForm.css";

function OrderForm({ addOrder }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderItems, totalAmount } = location.state || { orderItems: [], totalAmount: 0 };

  const itemNames = orderItems.map(item => item.name).join(", ");
  const quantities = orderItems.map(item => item.quantity).join(", ");

  const [formData, setFormData] = useState({
    Username: "",
    Email: "",
    Address: "",
    PhoneNum: "",
    Date: "",
    Time: "",
    Item: itemNames,
    Qty: quantities,
    TotalAmount: totalAmount || "",
    paymentType: "",
  });

  const [errors, setErrors] = useState({ Email: "", PhoneNum: "", Date: "", Time: "" });

  const DELIVERY_FEE = 100;

  useEffect(() => {
    if (orderItems.length > 0) {
      const total = totalAmount || orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
      setFormData((prevData) => ({
        ...prevData,
        TotalAmount: (total + DELIVERY_FEE).toFixed(2),
      }));
    }
  }, [orderItems, totalAmount]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrors({ ...errors, [name]: "" });

    if (name === "PhoneNum") {
      const regex = /^\d{0,10}$/;
      if (regex.test(value)) {
        setFormData({ ...formData, [name]: value });
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          PhoneNum: "Please enter only 10 numeric digits for the phone number.",
        }));
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (name === "Email") {
      validateEmail(value);
    }

    if (name === "Date") {
      validateDate(value);
    }

    if (name === "Time" && formData.Date) {
      validateTime(value, formData.Date);
    }
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        Email: "Please enter a valid email address including '@'.",
      }));
      return false;
    }
    setErrors((prevErrors) => ({ ...prevErrors, Email: "" }));
    return true;
  };

  const validateDate = (selectedDate) => {
    const today = new Date().toISOString().split("T")[0]; // Get today's date in 'yyyy-mm-dd' format
    if (selectedDate < today) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        Date: "You cannot select a past date.",
      }));
      return false;
    }
    setErrors((prevErrors) => ({ ...prevErrors, Date: "" }));
    return true;
  };

  const validateTime = (selectedTime, selectedDate) => {
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const selectedHours = parseInt(selectedTime.split(":")[0], 10);
    const selectedMinutes = parseInt(selectedTime.split(":")[1], 10);

    const today = new Date().toISOString().split("T")[0]; // Get today's date in 'yyyy-mm-dd' format

    if (selectedDate === today) {
      const minTime = new Date();
      minTime.setHours(currentHours + 3, currentMinutes); // Set minimum time to 3 hours from now

      const selectedDateTime = new Date();
      selectedDateTime.setHours(selectedHours, selectedMinutes);

      if (selectedDateTime < minTime) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          Time: "Please select a time at least 3 hours from now.",
        }));
        return false;
      }
    }
    setErrors((prevErrors) => ({ ...prevErrors, Time: "" }));
    return true;
  };

  const validateForm = () => {
    if (!validateEmail(formData.Email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }
    if (!formData.paymentType) {
      toast.error("Please select a payment type.");
      return false;
    }
    if (formData.PhoneNum.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number.");
      return false;
    }
    if (errors.PhoneNum) {
      toast.error(errors.PhoneNum);
      return false;
    }
    if (errors.Date) {
      toast.error(errors.Date);
      return false;
    }
    if (errors.Time) {
      toast.error(errors.Time);
      return false;
    }
    return true;
  };

  const formatTime = (time) => {
    const [hour, minute] = time.split(":");
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minute} ${ampm}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const formattedTime = formatTime(formData.Time);

      const orderData = {
        ...formData,
        Time: formattedTime,
        PaymentStatus: "Pending",
        OrderStatus: "Pending",
      };

      const response = await axios.post("http://localhost:3028/api/orders", orderData);
      if (response.status === 200 || response.status === 201) {
        const newOrder = response.data.order;
        const { OrderId, TotalAmount } = newOrder;
        addOrder(newOrder);

        toast.success("Order submitted successfully!");
        if (formData.paymentType === "Online payment") {
          navigate('/payment', { state: { orderId: OrderId, totalAmount: formData.TotalAmount } });
        } else {
          toast.info("Cash on Delivery selected. No payment form required.");
        }
      }
    } catch (error) {
      console.error("Error submitting the order:", error.message);
      toast.error(`There was an error submitting your order: ${error.message}`);
    }
  };

  const handleBackToCart = () => {
    navigate('/AddtoCart', { state: { selectedItems: orderItems } }); // Pass the selected items back to AddToCart
  };

  return (
    <>
      <form className="order-form" onSubmit={handleSubmit}>
        <h2>Place Your Order</h2>
        <div>
          <label htmlFor="Username">Username:</label>
          <input
            type="text"
            name="Username"
            value={formData.Username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="Email">Email:</label>
          <input
            type="email"
            name="Email"
            value={formData.Email}
            onChange={handleChange}
            required
          />
          {errors.Email && <span className="error">{errors.Email}</span>}
        </div>
        <div>
          <label htmlFor="Address">Address:</label>
          <input
            type="text"
            name="Address"
            value={formData.Address}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="PhoneNum">Phone Number:</label>
          <input
            type="text"
            name="PhoneNum"
            value={formData.PhoneNum}
            onChange={handleChange}
            required
          />
          {errors.PhoneNum && <span className="error">{errors.PhoneNum}</span>}
        </div>
        <div>
          <label htmlFor="Date">Date:</label>
          <input
            type="date"
            name="Date"
            value={formData.Date}
            onChange={handleChange}
            required
          />
          {errors.Date && <span className="error">{errors.Date}</span>}
        </div>
        <div>
          <label htmlFor="Time">Time:</label>
          <input
            type="time"
            name="Time"
            value={formData.Time}
            onChange={handleChange}
            required
          />
          {errors.Time && <span className="error">{errors.Time}</span>}
        </div>
        <div>
          <label htmlFor="Item">Item:</label>
          <input
            type="text"
            name="Item"
            value={formData.Item}
            readOnly
          />
        </div>
        <div>
          <label htmlFor="Qty">Quantity:</label>
          <input
            type="text"
            name="Qty"
            value={formData.Qty}
            readOnly
          />
        </div>
        <div>
          <label htmlFor="TotalAmount">Total Amount (with delivery):</label>
          <input
            type="text"
            name="TotalAmount"
            value={formData.TotalAmount}
            readOnly
          />
        </div>
        <div>
          <label>Payment Type:</label>
          <input
            type="radio"
            name="paymentType"
            value="Online payment"
            checked={formData.paymentType === "Online payment"}
            onChange={handleChange}
          /> Online payment
          <input
            type="radio"
            name="paymentType"
            value="Cash on Delivery"
            checked={formData.paymentType === "Cash on Delivery"}
            onChange={handleChange}
          /> Cash on Delivery
        </div>
        <button type="submit">Submit</button>
        <button type="button" onClick={handleBackToCart}>Back to Add to Cart</button>
      </form>
      <ToastContainer />
    </>
  );
}

export default OrderForm;
