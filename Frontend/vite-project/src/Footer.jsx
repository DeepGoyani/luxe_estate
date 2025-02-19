import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState('');

  useEffect(() => {
    const savedEmail = localStorage.getItem('subscriberEmail');
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      alert('Please enter a valid email address.');
      return;
    }
    try {
      localStorage.setItem('subscriberEmail', email);
      alert('Subscribed successfully!');
      setEmail('');
    } catch (err) {
      alert('Failed to subscribe');
    }
  };

  return (
    <footer className="footer">
      <h3>The Luxe Estate</h3>
      <p>Kedar Business Hub Katargam Ved Road Surat Gujarat</p>

      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/shop">Shop</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>

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

      <p>2023 The Luxe Estate. All rights reserved</p>
    </footer>
  );
};

export default Footer;
