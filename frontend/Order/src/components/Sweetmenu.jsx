import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sweetmenu.css';

const sweets = [
  { name: 'Chocolate Cake (2kg)', price: 3000, image: '/images/chocolate-cake.jpg' },
  { name: 'Butter Cake (2kg)', price: 2500, image: '/images/butter.jpg' },
  { name: 'Cookies (1pcs)', price: 75, image: '/images/cookies.jpg' },
  { name: 'Cupcakes (1pcs)', price: 150, image: '/images/Cupcakes.jpg' },
  { name: 'Mun Kawum (1pcs)', price: 40, image: '/images/Mung-Kavum.jpg' },
  { name: 'Milk Toffee (1pcs)', price: 10, image: '/images/milkToffee.jpeg' },
  { name: 'Pani Walalu (1pcs)', price: 30, image: '/images/paniwalalu.jpg' },
  { name: 'Narang Kawum (1pcs)', price: 30, image: '/images/naran.jpg' },
];

const Sweetmenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showPopup, setShowPopup] = useState(true);
  const [cartItems, setCartItems] = useState([]); // State to hold selected sweet items

  // Check for selected items from navigation state
  useEffect(() => {
    const selectedItems = location.state?.selectedItems || [];
    if (selectedItems.length > 0) {
      setCartItems(selectedItems);
      setShowPopup(false); // Prevent showing the popup if navigating from AddToCart
    } else {
      setShowPopup(true); // Show popup when page is rendered without items
    }
  }, [location.state]);

  // Handle item selection
  const handleSelect = (sweet) => {
    const existingItem = cartItems.find(item => item.name === sweet.name);
    if (existingItem) {
      // If item already exists in the cart, increase its quantity
      existingItem.quantity += 1;
      setCartItems([...cartItems]);
    } else {
      // Add new item to the cart with quantity 1
      setCartItems([...cartItems, { ...sweet, quantity: 1 }]);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false); // Close the popup
  };

  // Filter sweets based on search query
  const filteredSweets = sweets.filter((sweet) =>
    sweet.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="sweet-menu-container">
      {/* Pop-up */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>Welcome to Sweetmenu!</h2>
            <img src="/images/welcomepic.jpg" alt="Welcome" className="popup-image" />
            <p>Check out our delicious sweets and place your order!</p>
            <p>Step into a world of sweetness and joy, where every bite tells a story!</p>
            <button onClick={handleClosePopup}>Ok</button>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search sweets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Sweets Grid */}
      <div className="sweets-grid">
        {filteredSweets.map((sweet, index) => {
          // Check if the sweet is selected (in the cart)
          const isSelected = cartItems.some(item => item.name === sweet.name);
          return (
            <div 
              key={index} 
              className={`sweet-card ${isSelected ? 'selected' : ''}`} 
              onClick={() => handleSelect(sweet)}
            >
              <img src={sweet.image} alt={sweet.name} className="sweet-image" />
              <h3 className="sweet-name">{sweet.name}</h3>
              <p className="sweet-price">Rs. {sweet.price}</p>
            </div>
          );
        })}
      </div>

      {/* Navigate to AddToCart Page */}
      <button className="add-to-cart-button" onClick={() => navigate('/addtocart', { state: { selectedItems: cartItems } })}>
        Add to Cart
      </button>
    </div>
  );
};

export default Sweetmenu;
