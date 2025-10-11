import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import HeaderNavbar from './HeaderNavbar';
import Footer from './Footer';
import './Landing.css';

// Directly defined API URL (replace with your actual backend URL)
const API_URL = 'http://localhost:3000/api';

const MainComponent = () => {
  const [products, setProducts] = useState({});
  const [cart, setCart] = useState([]);
  const [currency, setCurrency] = useState('INR');
  const [language, setLanguage] = useState('English');
  const [conversionRates, setConversionRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantities, setQuantities] = useState({});

  // Define valid product categories
  const CATEGORIES = ['men', 'women', 'tshirts', 'trousers', 'shirts'];
  const SHOP_ALL_ROUTES = {
    tshirts: '/tshirt',
    shirts: '/shirt',
    trousers: '/trousers'
  };

  const addToCart = async (productId, category, quantity) => {
    try {
      const response = await axios.post(`${API_URL}/cart`, {
        productId,
        category,
        quantity,
      });

      if (response.data) {
        const cartResponse = await axios.get(`${API_URL}/cart`);
        setCart(cartResponse.data.items || []);
        alert('Item added to cart successfully!');
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert(err.response?.data?.error || 'Failed to add item to cart');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponses, cartResponse, ratesResponse] = await Promise.all([
          Promise.all(CATEGORIES.map(category => 
            axios.get(`${API_URL}/${category}`)
              .then(res => ({ category, data: res.data }))
              .catch(error => {
                console.error(`Error fetching ${category}:`, error);
                return { category, data: [] };
              })
          )),
          axios.get(`${API_URL}/cart`),
          axios.get(`${API_URL}/conversion-rates`),
        ]);

        // Transform products data
        const productsData = productsResponses.reduce((acc, { category, data }) => {
          acc[category] = data;
          return acc;
        }, {});

        setProducts(productsData);
        setCart(cartResponse.data.items || []);
        setConversionRates(ratesResponse.data);
        setError(null);
      } catch (err) {
        console.error('Error   data:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const convertPrice = (price, currency) => {
    if (currency === 'INR' || !conversionRates[currency]) return price;
    return (price * conversionRates[currency]).toFixed(2);
  };

  const handleQuantityChange = (productId, value) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, Math.min(10, Number(value)))
    }));
  };

  const getShopAllLink = (category) => {
    const route = SHOP_ALL_ROUTES[category];
    return route ? (
      <Link to={route} className="show-all-btn">Shop All</Link>
    ) : (
      <button className="show-all-btn">Shop All</button>
    );
  };

  return (
    <div className="main">
      <HeaderNavbar
        currency={currency}
        setCurrency={setCurrency}
        language={language}
        setLanguage={setLanguage}
        cart={cart}
      />

      {error && (
        <div className="error-message bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      <section className="hero-section">
        <video autoPlay loop muted playsInline className="hero-video">
          <source
            src="https://old-money.com/cdn/shop/videos/c/vp/fd726fc6578a4ba48c24cdd4d2c94cb3/fd726fc6578a4ba48c24cdd4d2c94cb3.HD-720p-4.5Mbps-35961835.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
        <div className="hero-overlay">
          <h2>Luxury Starts and Ends With Us</h2> 
          <button className="shop-btn">Shop Exclusive Products</button>
        </div>
      </section>

      {loading ? (
        <div className="loading-spinner">Loading products...</div>
      ) : (
        CATEGORIES.map(category => (
          products[category]?.length > 0 && (
            <section key={category} id={category} className="product-section">
              <h2 className="collection-title">
                {category.charAt(0).toUpperCase() + category.slice(1)} Collection
              </h2>
              
              <div className="product-grid">
                {products[category].map(product => (
                  <div key={product._id} className="luxury-product-card">
                    <div className="luxury-product-image">
                      <img
                        src={product.image || 'https://via.placeholder.com/150'}
                        alt={product.name}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/150';
                        }}
                      />
                      {product.sale && <span className="sale-tag">Sale</span>}
                    </div>
                    
                    <div className="luxury-product-info">
                      <h3 className="product-name">{product.name}</h3>
                      <p className="luxury-rating">
                        {Array.from(
                          { length: Math.floor(product.rating || 0) },
                          (_, i) => (
                            <span key={i}>⭐</span>
                          )
                        )}
                      </p>
                      <p className="luxury-price">
                        {currency} {convertPrice(product.price, currency)}
                      </p>
                      
                      <div className="quantity-selector">
                        <label htmlFor={`quantity-${product._id}`}>Quantity:</label>
                        <select
                          id={`quantity-${product._id}`}
                          value={quantities[product._id] || 1}
                          onChange={(e) => handleQuantityChange(product._id, e.target.value)}
                          className="quantity-select"
                        >
                          {[...Array(10)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}
                            </option>
                          ))}
                        </select>
                        
                        <button
                          className="luxury-add-to-cart"
                          onClick={() => addToCart(
                            product._id, 
                            category, 
                            quantities[product._id] || 1
                          )}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {getShopAllLink(category)}
            </section>
          )
        ))
      )}
      
      <Footer />
    </div>
  );
};

export default MainComponent;