import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import OrderForm from "./components/OrderForm";
import Table from "./components/table"; // Ensure the component name is correct (Table)
import Sweetmenu from "./components/Sweetmenu"; // Import Sweetmenu component
import PaymentForm from "./components/PaymentForm"; // Import PaymentForm component
import PaymentTable from "./components/PaymentTable"; // Import PaymentTable component
import AddToCart from "./components/AddtoCart"; // Import AddToCart component
import ReportPage from "./components/ReportPage";

function App() {
  const [orders, setOrders] = useState([]);
  const [selectedItem, setSelectedItem] = useState(""); // State to track selected sweet
  const [cartItems, setCartItems] = useState([]); // State to hold selected sweet items

  // Function to add order to the state
  const addOrder = (newOrder) => {
    setOrders([...orders, newOrder]);
  };

  // Function to add selected items to the cart
  const addCartItem = (item) => {
    const existingItem = cartItems.find(cartItem => cartItem.name === item.name);
    if (existingItem) {
      existingItem.quantity += 1; // Increase quantity if item already in cart
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]); // Add new item to the cart
    }
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Route for Sweetmenu */}
        <Route path="/sweetmenu" element={<Sweetmenu addCartItem={addCartItem} />} />

        {/* Route for AddToCart after an item is selected */}
        <Route path="/addtocart" element={<AddToCart cartItems={cartItems} />} />

        {/* Route for OrderForm after an item is selected */}
        <Route
          path="/orderform"
          element={<OrderForm selectedItem={selectedItem} addOrder={addOrder} />}
        />

        {/* Route for displaying the table of orders */}
        <Route path="/table" element={<Table orders={orders} setOrders={setOrders} />} />

        {/* Route for PaymentForm */}
        <Route path="/payment" element={<PaymentForm />} />

        {/* Route for PaymentTable */}
        <Route path="/payment-table" element={<PaymentTable />} />

        {/* Add a default route to handle unmatched paths */}
        <Route path="/" element={<Sweetmenu addCartItem={addCartItem} />} /> {/* Default route */}
        
        <Route path="/" element={<Table />} /> {/* Default path */}
        <Route path="/report" element={<ReportPage />} /> {/* Report page */}

      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
