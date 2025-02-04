import { useState, useEffect } from "react";
import axios from "axios";
import "./Landing.css";
import { useGlobalContext } from "./Context/GlobalCOntext";

const API_URL = "http://localhost:3000/api";

const LuxeEstate = () => {
  const { currency, setCurrency, language, setLanguage } = useGlobalContext();
  const [email, setEmail] = useState("");
  const [products, setProducts] = useState({});
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const currencies = ["INR", "USD", "EUR", "GBP", "JPY"];
  const languages = ["English", "Hindi", "Spanish", "French", "German"];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const categories = ["men", "women", "tshirt", "shirt", "trousers"];
        const responses = await Promise.all(
          categories.map((category) => axios.get(`${API_URL}/${category}`))
        );
        const data = responses.reduce((acc, res, index) => {
          acc[categories[index]] = res.data;
          return acc;
        }, {});
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/newsletter`, { email });
      alert("Subscribed successfully!");
      setEmail("");
    } catch (err) {
      alert("Failed to subscribe");
    }
  };

  const addToCart = async (productId) => {
    try {
      await axios.post(`${API_URL}/cart`, { productId, quantity: 1 });
      alert("Item added to cart");
    } catch (err) {
      alert("Failed to add item to cart");
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>The Luxe Estate</h1>
      </header>

      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-links">
          <button className="nav-btn">Shop Men</button>
          <button className="nav-btn">Shop Women</button>
          <button className="nav-btn">Contact Us</button>
        </div>

        <div className="nav-controls">
          {/* Currency Dropdown */}
          <div className="dropdown">
            <button onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}>
              {currency} ▼
            </button>
            {showCurrencyDropdown && (
              <ul className="dropdown-menu">
                {currencies.map((cur) => (
                  <li key={cur} onClick={() => setCurrency(cur)}>
                    {cur}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Language Dropdown */}
          <div className="dropdown">
            <button onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}>
              {language} ▼
            </button>
            {showLanguageDropdown && (
              <ul className="dropdown-menu">
                {languages.map((lang) => (
                  <li key={lang} onClick={() => setLanguage(lang)}>
                    {lang}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button className="cart-btn">🛒</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <video autoPlay loop muted playsInline className="hero-video">
          <source
            src="https://old-money.com/cdn/shop/videos/c/vp/fd726fc6578a4ba48c24cdd4d2c94cb3/fd726fc6578a4ba48c24cdd4d2c94cb3.HD-720p-4.5Mbps-35961835.mp4?v=0"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
        <div className="hero-overlay">
          <h2>{language === "Hindi" ? "लक्ज़री हमसे शुरू होती है" : "Luxury Starts and Ends With Us"}</h2>
          <button className="shop-btn">
            {language === "Hindi" ? "विशेष उत्पाद खरीदें" : "Shop Exclusive Products"}
          </button>
        </div>
      </section>

      {/* Product Sections */}
      {Object.keys(products).map((category) => (
        <section key={category} className="product-section">
          <h2>{category.charAt(0).toUpperCase() + category.slice(1)} Collection</h2>
          <div className="product-grid">
            {products[category]?.map((product) => (
              <div key={product._id} className="product-card">
                <div className="product-image">
                  <img src={product.image || "https://via.placeholder.com/150"} alt={product.name} />
                  <span className="sale-tag">Sale</span>
                </div>
                <h3>{product.name}</h3>
                <p>⭐⭐⭐⭐⭐</p>
                <p className="price">
                  {currency} {product.price}
                </p>
                <button onClick={() => addToCart(product._id)}>Add to Cart</button>
              </div>
            ))}
          </div>
          <button className="show-all-btn">Show All</button>
        </section>
      ))}

      {/* Footer */}
      <footer className="footer">
        <div className="footer-columns">
          <div>
            <h3>The Luxe Estate</h3>
            <p>Kedar Business Hub, Katargam, Surat, Gujarat</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LuxeEstate;
