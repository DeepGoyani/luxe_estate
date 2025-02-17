import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Cart.css'; // Make sure you have a Cart.css file for styling

const API_URL = 'http://localhost:3000/api';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingItemId, setEditingItemId] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await axios.get(`${API_URL}/cart`);
      setCartItems(response.data.items || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError("Failed to load cart. Please try again.");
      setCartItems([]);
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await axios.delete(`${API_URL}/cart/${itemId}`);
      await fetchCart();
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      await axios.patch(`${API_URL}/cart/${itemId}`, { quantity });
      await fetchCart();
      setEditingItemId(null); // Close the edit form
    } catch (err) {
      console.error("Error updating quantity:", err);
      alert("Failed to update quantity");
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.productDetails.price * item.quantity, 0);
  };

  return (
    <div className="cart-container">
      <header className="header">
        <h1 className="le">The Luxe Estate</h1>
      </header>

      <div className="cart-items">
        <h2>Your Shopping Cart</h2>
        {loading ? (
          <p>Loading cart...</p>
        ) : (
          <>
            {error && <p className="error-message">{error}</p>}
            {cartItems.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <>
                {cartItems.map((item) => (
                  <div key={item.productId} className="cart-item">
                    <img src={item.productDetails.image || 'https://via.placeholder.com/150'} alt={item.productDetails.name} />
                    <div className="cart-info">
                      <h3>Name: {item.productDetails.name}</h3>
                      <p>Price: ${item.productDetails.price}</p>
                      <div className="quantity-control">
                        <span>{item.quantity}</span>
                        <button onClick={() => setEditingItemId(item.productId)}>Edit</button>
                        {editingItemId === item.productId && (
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.productId, e.target.value)}
                          />
                        )}
                      </div>
                      <button className="remove-btn" onClick={() => removeFromCart(item.productId)}>
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                <div className="cart-summary">
                  <h3>Total: ${calculateTotal().toFixed(2)}</h3>
                  <button className="checkout-btn">Proceed to Checkout</button>
                </div>
              </>
            )}
          </>
        )}
      </div>

      <footer className="footer">
        <div className="footer-columns">
          <h3>The Luxe Estate</h3>
          <p>Kedar Business Hub Katargam Ved Road Surat Gujarat</p>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div className="footer-columns">
          <h4>Links</h4>
          <ul>
            <li><Link to="/payment-options">Payment Options</Link></li>
            <li><Link to="/returns">Returns</Link></li>
            <li><Link to="/privacy-policies">Privacy Policies</Link></li>
          </ul>
        </div>
        <div className="footer-columns">
          <h4>Newsletter</h4>
          <form>
            <input type="email" placeholder="Enter Your Email Address" required />
            <button type="submit">SUBSCRIBE</button>
          </form>
        </div>
        <div className="copyright">
          <p>2023 The Luxe Estate. All rights reserved</p>
        </div>
      </footer>
    </div>
  );
};

export default Cart;