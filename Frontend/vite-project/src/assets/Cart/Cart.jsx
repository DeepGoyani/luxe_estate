import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Cart.css';

const API_URL = 'http://localhost:3000/api';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get(`${API_URL}/cart`);
        setCartItems(response.data.items || []);
      } catch (err) {
        setError('Failed to load cart');
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div>
      <header className="header">
        <h1 className="le">The Luxe Estate</h1>
      </header>

      <div className="cart-container">
        <h2>Your Shopping Cart</h2>

        {loading && <p>Loading cart...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {cartItems.length === 0 && !loading && <p>Your cart is empty.</p>}

        {cartItems.map((item) => (
          <div key={item._id} className="cart-item">
            <img src={item.image || 'https://via.placeholder.com/100'} alt={item.name} />
            <div className="cart-info">
              <h3>{item.name}</h3>
              <p>Price: ${item.price}</p>
              <p>Quantity: {item.quantity}</p>
            </div>
          </div>
        ))}

        {cartItems.length > 0 && (
          <div className="cart-summary">
            <h3>Total: ${calculateTotal().toFixed(2)}</h3>
            <button className="checkout-btn">Proceed to Checkout</button>
          </div>
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
