import  { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Landing.css'; // Ensure the path is correct based on your project structure

const API_URL = 'http://localhost:3000/api';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscriptionError, setSubscriptionError] = useState(null);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setSubscriptionError('Please enter a valid email address.');
      return;
    }
    try {
      localStorage.setItem('subscriberEmail', email);
      await axios.post(`${API_URL}/subscribers`, { email });
      alert('Subscribed successfully!');
      setEmail('');
    } catch (err) {
      setSubscriptionError('Failed to subscribe. Please try again later.');
      console.error('Error subscribing:', err);
    }
  };

  useEffect(() => {
    const savedEmail = localStorage.getItem('subscriberEmail');
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  return (
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
        <h4>Help</h4>
        {/* Add your help links here */}
      </div>
      <div className="footer-columns">
        <h4>Newsletter</h4>
        <form onSubmit={handleNewsletterSubmit}>
          <input
            type="email"
            placeholder="Enter Your Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">SUBSCRIBE</button>
        </form>
        {subscriptionError && <p style={{ color: 'red' }}>{subscriptionError}</p>}
      </div>
      <div className="copyright">
        <p>2023 The Luxe Estate. All rights reserved</p>
      </div>
    </footer>
  );
};

export default Footer;