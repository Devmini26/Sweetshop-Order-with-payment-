import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import './Payment.css'; // CSS file for styling

const PaymentForm = () => {
  const location = useLocation();
  const { totalAmount } = location.state || {}; // Get total amount passed from the order form

  const [paymentMethod, setPaymentMethod] = useState("creditCard");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    securityCode: "",
    cardName: "", 
    useShippingAddress: true
  });
  const [paymentSuccess, setPaymentSuccess] = useState(false); // Track payment success

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "cardNumber" && value.length > 16) {
      return;
    }
    if (name === "securityCode" && value.length > 3) {
      return;
    }

    setCardDetails({ ...cardDetails, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate a payment processing delay
    setTimeout(() => {
      setPaymentSuccess(true); // Mark payment as successful after form submission
      alert("Payment submitted successfully");
    }, 1000);
  };

  const handleCardTypeSelect = (cardType) => {
    setCardDetails({ ...cardDetails, cardName: cardType });
  };

  return (
    <div className="payment-container">
      <h2>Payment</h2>
      <p>All transactions are secure and encrypted.</p>

      {paymentSuccess ? (
        <div className="payment-success">
          <h3>Payment Successful!</h3>
          <p>Thank you for your payment. Your order is being processed.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="payment-method">
            <input
              type="radio"
              id="creditCard"
              name="paymentMethod"
              value="creditCard"
              checked={paymentMethod === "creditCard"}
              onChange={() => setPaymentMethod("creditCard")}
            />
            <label htmlFor="creditCard">
              Credit card
              <img 
                src="/images/visa.png" 
                alt="Visa" 
                className="card-icon" 
                onClick={() => handleCardTypeSelect("Visa")}
              />
              <img 
                src="/images/mastercard.png" 
                alt="MasterCard" 
                className="card-icon" 
                onClick={() => handleCardTypeSelect("MasterCard")}
              />
              <img 
                src="/images/discover.png" 
                alt="Discover" 
                className="card-icon" 
                onClick={() => handleCardTypeSelect("Discover")}
              />
              <img 
                src="/images/jcb.jpg" 
                alt="JCB" 
                className="card-icon" 
                onClick={() => handleCardTypeSelect("JCB")}
              />
            </label>
          </div>

          {paymentMethod === "creditCard" && (
            <div className="credit-card-details">
              <div>
                <label htmlFor="cardNumber">Card number</label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  placeholder="Card number"
                  value={cardDetails.cardNumber}
                  onChange={handleChange}
                  required
                  maxLength="16"
                />
              </div>

              <div className="card-expiry-security">
                <div>
                  <label htmlFor="expiryDate">Expiration date (MM / YY)</label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    placeholder="MM / YY"
                    value={cardDetails.expiryDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="securityCode">Security code</label>
                  <input
                    type="text"
                    id="securityCode"
                    name="securityCode"
                    placeholder="CVV"
                    value={cardDetails.securityCode}
                    onChange={handleChange}
                    required
                    maxLength="3"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="cardName">Name on card</label>
                <input
                  type="text"
                  id="cardName"
                  name="cardName"
                  placeholder="Name on card"
                  value={cardDetails.cardName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="shipping-address-checkbox">
                <input
                  type="checkbox"
                  id="useShippingAddress"
                  name="useShippingAddress"
                  checked={cardDetails.useShippingAddress}
                  onChange={() =>
                    setCardDetails({
                      ...cardDetails,
                      useShippingAddress: !cardDetails.useShippingAddress
                    })
                  }
                />
                <label htmlFor="useShippingAddress">
                  Use shipping address as billing address
                </label>
              </div>

              {/* Total Amount Input */}
              <div>
                <label>Total amount</label>
                <input
                  type="text"
                  id="totalAmount"
                  value={totalAmount}
                  readOnly
                />
              </div>
            </div>
          )}

          <button type="submit" className="pay-now-button">Pay now</button>
        </form>
      )}
    </div>
  );
};

export default PaymentForm;
