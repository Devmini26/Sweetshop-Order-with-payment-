import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import { jsPDF } from "jspdf"; // Import jsPDF
import 'jspdf-autotable'; // Import autoTable plugin
import './Table.css';

function Table() {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState({}); // State for selected payment status
  const [selectedOrderStatus, setSelectedOrderStatus] = useState({}); // State for selected order status
  const navigate = useNavigate(); // Use navigate for routing

  // Function to format date to 'YYYY-MM-DD'
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleRemove = async (index) => {
    const confirmed = window.confirm("Are you sure you want to delete this order?");
    if (confirmed) {
      const orderId = orders[index].OrderId; // Get the OrderId to delete from the backend
  
      try {
        const response = await fetch(`http://localhost:3028/api/orders/${orderId}`, {
          method: 'DELETE',
        });
  
        if (response.ok) {
          const updatedOrders = [...orders];
          updatedOrders.splice(index, 1); // Remove the order from the local state
          setOrders(updatedOrders);
          alert("Order deleted successfully!");
        } else {
          alert("Failed to delete order from the backend.");
        }
      } catch (error) {
        console.error("Error deleting order:", error);
        alert("Error deleting order from the backend.");
      }
    }
  };

  const handleUpdate = async (index) => {
    const updatedOrders = [...orders];
    updatedOrders[index] = {
      ...updatedOrders[index],
      OrderStatus: selectedOrderStatus[index] || updatedOrders[index].OrderStatus, // Use selected status or keep current
      PaymentStatus: selectedPaymentStatus[index] || updatedOrders[index].PaymentStatus, // Use selected status or keep current
    };
    setOrders(updatedOrders);

    const orderId = updatedOrders[index].OrderId;
    try {
      const response = await fetch(`http://localhost:3028/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          OrderStatus: updatedOrders[index].OrderStatus,
          PaymentStatus: updatedOrders[index].PaymentStatus
        })
      });

      if (response.ok) {
        alert("Order updated successfully!");
        console.log("Order updated in the backend");
      } else {
        alert("Failed to update order in the backend.");
        console.error("Failed to update order in the backend");
      }
    } catch (error) {
      alert("Error updating order.");
      console.error("Error updating order:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:3028/api/orders');
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Function to generate PDF data from the orders
  const generatePDF = () => {
    if (orders.length === 0) {
      alert("No orders to generate a report");
      return;
    }

    const doc = new jsPDF({
      orientation: "landscape", // Set to landscape for wider format
      unit: "mm",
      format: [350, 210], // Custom width of 300mm and height of 210mm
      putOnlyUsedFonts: true,
      floatPrecision: 16 // Optional, controls precision for float values
    });
    
    doc.setFontSize(16);
    doc.text("Order Report", 14, 22);

    const headers = ["Order ID", "Username", "Email", "Address", "Phone Number", "Date", "Time", "Item", "Qty", "Total Amount", "Payment Type", "Payment Status", "Order Status"];
    const rows = orders.map(order => [
      order.OrderId,
      order.Username,
      order.Email,
      order.Address,
      order.PhoneNum,
      formatDate(order.Date),
      order.Time,
      order.Item,
      order.Qty,
      order.TotalAmount,
      order.paymentType,
      order.PaymentStatus || 'Pending',
      order.OrderStatus || 'Pending'
    ]);

    // Create a table in the PDF
    doc.autoTable({
      head: [headers],
      body: rows,
      startY: 30,
      theme: 'grid',
      margin: { right: 10 } // Adjust margins if needed
    });

    doc.save('order_report.pdf'); // Save the generated PDF
  };

  // Handle Generate Report button click for navigation
  const handleGenerateReport = () => {
    if (orders.length === 0) {
      alert("No orders to generate a report");
      return;
    }

    // Navigate to the Report page with orders as state
    navigate("/report", { state: { orders } });
  };

  // Filter orders based on the search query 
  const filteredOrders = orders.filter(order =>
    (order.Username && order.Username.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (order.Email && order.Email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (order.OrderId && order.OrderId.toString().includes(searchQuery)) || // Also include OrderId in search
    (order.Item && order.Item.toLowerCase().includes(searchQuery.toLowerCase())) || // Include Item in search
    (order.paymentType && order.paymentType.toLowerCase().includes(searchQuery.toLowerCase())) // Include paymentType in search
  );

  return (
    <div className="table-container">
      <h1>Hello Devmini!</h1> {/* Welcome message */}
      <div className="header">
        <h2>Order List</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="generate-report-button" onClick={handleGenerateReport}>
          Generate Report
        </button> {/* Updated button for navigation */}
      </div>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Address</th>
            <th>Phone Number</th>
            <th>Date</th>
            <th>Time</th>
            <th>Item</th>
            <th>Qty</th>
            <th>Total Amount</th>
            <th>Payment Type</th>
            <th>Payment Status</th>
            <th>Order Status</th>
            <th>Update</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order, index) => (
              <tr key={index}>
                <td>{order.OrderId}</td>
                <td>{order.Username}</td>
                <td>{order.Email}</td>
                <td>{order.Address}</td>
                <td>{order.PhoneNum}</td>
                <td>{formatDate(order.Date)}</td>
                <td>{order.Time}</td>
                <td>{order.Item}</td>
                <td>{order.Qty}</td>
                <td>{order.TotalAmount}</td>
                <td>{order.paymentType}</td>
                <td>
                  <select
                    value={selectedPaymentStatus[index] || order.PaymentStatus}
                    onChange={(e) => setSelectedPaymentStatus({ ...selectedPaymentStatus, [index]: e.target.value })}
                  >
                    <option value="">Select Payment Status</option>
                    <option value="Paid">Success</option>
                    <option value="Pending">Pending</option>
                    <option value="Failed">Cancelled</option>
                  </select>
                </td>
                <td>
                  <select
                    value={selectedOrderStatus[index] || order.OrderStatus}
                    onChange={(e) => setSelectedOrderStatus({ ...selectedOrderStatus, [index]: e.target.value })}
                  >
                    <option value="">Select Order Status</option>
                    <option value="Completed">Delivered</option>
                    <option value="Pending">Pending</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td>
                  <button className="update-button" onClick={() => handleUpdate(index)}>Update</button>
                </td>
                <td>
                  <button className="delete-button" onClick={() => handleRemove(index)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="15">No orders found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
