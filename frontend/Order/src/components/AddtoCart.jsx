import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './AddtoCart.css';

const AddToCart = () => {
  const location = useLocation();
  const selectedItems = location.state?.selectedItems || [];
  const [cartItems, setCartItems] = useState(selectedItems);
  const navigate = useNavigate();

  // Handle quantity change
  const handleQuantityChange = (index, value) => {
    // Allow an empty value but make sure it is a number when typing
    const quantity = value === '' ? '' : Math.max(1, Number(value));
    const updatedItems = [...cartItems];
    updatedItems[index].quantity = quantity; // Set quantity to the typed value or empty string
    setCartItems(updatedItems);
  };

  // Calculate total amount
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      // Calculate only if quantity is valid (non-empty and numeric)
      const qty = item.quantity || 0;
      return total + item.price * qty;
    }, 0);
  };

  // Handle checkout (place order)
  const handleCheckout = () => {
    const orderItems = cartItems.map(item => ({
      name: item.name,
      quantity: item.quantity || 1,
      totalAmount: item.price * (item.quantity || 1),
    }));

    // Navigate to the OrderForm with orderItems and totalAmount
    navigate('/OrderForm', { state: { orderItems, totalAmount: calculateTotal() } });
  };

  return (
    <div className="add-to-cart-container">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>No items in the cart.</p>
      ) : (
        <div className="cart-items">
          {cartItems.map((item, index) => (
            <div key={index} className="cart-item">
              <div className="cart-item-details">
                <h3>{item.name}</h3>
                <p>Price: Rs. {item.price}</p>
                <input
                  type="number"
                  value={item.quantity === '' ? '' : item.quantity} // Allow empty input
                  min="1"
                  onChange={(e) => handleQuantityChange(index, e.target.value)}
                  placeholder="Qty" // Provide a placeholder when empty
                />
                <p>Total: Rs. {item.price * (item.quantity || 0)}</p>
              </div>
            </div>
          ))}
          <h3>Total Amount: Rs. {calculateTotal()}</h3>
          <button onClick={handleCheckout}>Place an Order</button>
        </div>
      )}
      <button onClick={() => navigate('/Sweetmenu', { state: { selectedItems: cartItems } })}>
        Back to Sweetmenu
      </button>
    </div>
  );
};

export default AddToCart;
