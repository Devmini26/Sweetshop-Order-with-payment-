import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img
            src="https://cdn.vectorstock.com/i/500p/78/06/sweets-shop-logo-with-cupcake-image-vector-36027806.jpg"
            alt="System Logo"
            width="100"
            height="80"
            className="me-2"
          />
          <span>Melody of Treatz</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/sweetmenu">
                Menu
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/table">Orders</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/Footer">Support & Help</Link>
            </li>
          </ul>
          <img
            src="https://t3.ftcdn.net/jpg/06/19/26/46/360_F_619264680_x2PBdGLF54sFe7kTBtAvZnPyXgvaRw0Y.jpg"
            alt="profile"
            width="80"
            height="80"
            className="profile-image"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
