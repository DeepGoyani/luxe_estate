import { useState } from "react";
import "./App.css";

const LuxeEstate = () => {
  const [email, setEmail] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [language, setLanguage] = useState("English");

  const handleEmailSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="container">
      <header className="header">
        <h1>The Luxe Estate</h1>
      </header>

      <nav className="navbar">
        <div className="nav-links">
          <button>Shop Men</button>
          <button>Shop Women</button>
          <button>Support</button>
        </div>
        <div className="nav-controls">
          <button onClick={() => setCurrency("INR")}>{currency} ▼</button>
          <button onClick={() => setLanguage("English")}>{language} ▼</button>
          <button>🛒</button>
        </div>
      </nav>

      {/* Hero Section with Video Background */}
      <section className="hero-section">
        <video autoPlay loop muted playsInline className="hero-video">
          <source
            src="https://old-money.com/cdn/shop/videos/c/vp/fd726fc6578a4ba48c24cdd4d2c94cb3/fd726fc6578a4ba48c24cdd4d2c94cb3.HD-720p-4.5Mbps-35961835.mp4?v=0"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
        <div className="hero-overlay">
          <h2>Luxury Starts and Ends From Us</h2>
          <button className="shop-btn">Shop Exclusive Products</button>
        </div>
      </section>

      <section className="about-section">
        <h2>Our Aim</h2>
        <p>
          At Old Money Clothing, our aim is to provide timeless, high-quality
          attire that embodies elegance and sophistication.
        </p>
      </section>

      {["T-shirt", "Shirt", "Trousers", "Women"].map((category) => (
        <section key={category} className="product-section">
          <h2>{category} Collection</h2>
          <div className="product-grid">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="product-card">
                <div className="product-image">
                  <img src={`https://via.placeholder.com/150`} alt="Product" />
                  <span className="sale-tag">Sale</span>
                </div>
                <h3>Carlton Cable-Knit Vest</h3>
                <p>⭐⭐⭐⭐⭐</p>
                <p className="price">Rs1899.00 Rs 1,299.00</p>
              </div>
            ))}
          </div>
          <button className="view-all-btn">View all...</button>
        </section>
      ))}

      <footer className="footer">
        <div className="footer-columns">
          <div>
            <h3>The Luxe Estate</h3>
            <p>Kedar Business Hub, Katargam, Surat, Gujarat</p>
          </div>
          <div>
            <h4>Links</h4>
            <nav>
              <a href="#">Home</a>
              <a href="#">Shop</a>
              <a href="#">About</a>
              <a href="#">Contact</a>
            </nav>
          </div>
          <div>
            <h4>Help</h4>
            <nav>
              <a href="#">Payment Options</a>
              <a href="#">Returns</a>
              <a href="#">Privacy Policies</a>
            </nav>
          </div>
          <div>
            <h4>Newsletter</h4>
            <form onSubmit={handleEmailSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Your Email"
                required
              />
              <button type="submit">SUBSCRIBE</button>
            </form>
          </div>
        </div>
        <p className="copyright">© 2023 The Luxe Estate. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LuxeEstate;
