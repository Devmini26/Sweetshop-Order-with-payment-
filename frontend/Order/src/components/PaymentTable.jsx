import React, { useState, useEffect } from "react";
import './PaymentTable.css'; // Adjust the path as needed

const PaymentTable = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch('/api/payments'); // Adjust API endpoint as needed
        const data = await response.json();
        setPayments(data); // Assuming data is an array of payment objects
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };

    fetchPayments();
  }, []);

  return (
    <div className="payment-table-container">
      <h2>Payment Details</h2>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>NIC</th>
            <th>Bank</th>
            <th>Branch</th>
            <th>Total Amount</th>
          </tr>
        </thead>
        <tbody>
          {payments.length > 0 ? (
            payments.map((payment) => (
              <tr key={payment.orderId}>
                <td>{payment.orderId}</td>
                <td>{payment.nic}</td>
                <td>{payment.bank}</td>
                <td>{payment.branch}</td>
                <td>{payment.totalAmount}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No payment details available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentTable;
