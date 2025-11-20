import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCurrency } from './context/CurrencyContext';
import LuxeLoader from './components/LuxeLoader';
import './Landing.css';

// Directly defined API URL (replace with your actual backend URL)
const API_URL = 'http://localhost:3000/api';
const ENABLE_CONVERSION_RATES = import.meta.env.VITE_ENABLE_CONVERSION_RATES === 'true';
const INLINE_PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="420" viewBox="0 0 300 420">' +
      '<rect width="100%" height="100%" fill="#f4efe6" />' +
      '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#b1976b" font-family="serif" font-size="18">Luxe Estate</text>' +
    '</svg>'
  );

const MainComponent = () => {
  const [products, setProducts] = useState({});
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({});

  const { formatPriceINR } = useCurrency();

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
        const conversionRatesPromise = ENABLE_CONVERSION_RATES
          ? axios
              .get(`${API_URL}/conversion-rates`)
              .catch((conversionErr) => {
                console.warn('Conversion rates unavailable:', conversionErr?.response?.status || conversionErr?.message);
                return { data: null };
              })
          : Promise.resolve({ data: null });

        const [productsResponses, cartResponse] = await Promise.all([
          Promise.all(CATEGORIES.map(category => 
            axios.get(`${API_URL}/${category}`)
              .then(res => ({ category, data: res.data }))
              .catch(error => {
                console.error(`Error fetching ${category}:`, error);
                return { category, data: [] };
              })
          )),
          axios.get(`${API_URL}/cart`),
        ]);

        // Fire and forget conversion rates; failure is non-blocking
        conversionRatesPromise.then(() => {}).catch(() => {});

        // Transform products data
        const productsData = productsResponses.reduce((acc, { category, data }) => {
          acc[category] = data;
          return acc;
        }, {});

        setProducts(productsData);
        setCart(cartResponse.data.items || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // formatPriceINR is already imported from useCurrency

  const handleQuantityChange = (productId, value) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, Math.min(10, Number(value)))
    }));
  };

  const getDisplayCategory = (category) =>
    category.charAt(0).toUpperCase() + category.slice(1);

  const formatListPreview = (value, fallback) => {
    if (Array.isArray(value) && value.length > 0) {
      const preview = value.slice(0, 3).join(' • ');
      return value.length > 3 ? `${preview} +` : preview;
    }
    return value || fallback;
  };

  const toggleCategoryView = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  return (
    <div className="main">
      {/* Header is now managed in App.jsx */}

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
          <Link to="/exclusive" className="shop-btn">
            Shop Exclusive Products
          </Link>
        </div>
      </section>

      {loading ? (
        <LuxeLoader message="Curating the Luxe wardrobe..." />
      ) : (
        CATEGORIES.map(category => (
          products[category]?.length > 0 && (
            <section key={category} id={category} className="product-section">
              <h2 className="collection-title">
                {getDisplayCategory(category)} Collection
              </h2>

              <div className="product-grid">
                {(expandedCategories[category] ? products[category] : products[category].slice(0, 4)).map(product => (
                  <div key={product._id} className="luxury-product-card">
                    <div className="luxury-product-image">
                      <img
                        src={product.image || INLINE_PLACEHOLDER}
                        alt={product.name}
                        onError={(e) => {
                          e.target.src = INLINE_PLACEHOLDER;
                        }}
                      />
                      <div className="product-badges">
                        {product.newArrival && <span className="badge new-arrival">New</span>}
                        {product.sale && <span className="badge sale-badge">Sale</span>}
                        {!product.inStock && <span className="badge out-of-stock">Out</span>}
                      </div>
                    </div>
                    
                    <div className="luxury-product-info">
                      <div className="product-heading">
                        <span className="category-pill">{getDisplayCategory(product.category || category)}</span>
                        {product.material && <span className="material-pill">{product.material}</span>}
                      </div>

                      <h3 className="product-name">{product.name}</h3>
                      {product.description && (
                        <p className="product-description">
                          {product.description.length > 110 
                            ? `${product.description.slice(0, 110)}…`
                            : product.description}
                        </p>
                      )}

                      <ul className="product-spec-list">
                        <li>
                          <span>Material</span>
                          <strong>{product.material || 'Premium Blend'}</strong>
                        </li>
                        <li>
                          <span>Sizes</span>
                          <strong>{formatListPreview(product.size, 'XS-XXL')}</strong>
                        </li>
                        <li>
                          <span>Colors</span>
                          <strong>{formatListPreview(product.color, 'Curated Palette')}</strong>
                        </li>
                      </ul>

                      {Array.isArray(product.features) && product.features.length > 0 && (
                        <ul className="feature-list">
                          {product.features.slice(0, 2).map((feature, index) => (
                            <li key={`${product._id}-feature-${index}`}>{feature}</li>
                          ))}
                        </ul>
                      )}

                      <div className="price-stack">
                        <div>
                          <p className="luxury-price">{formatPriceINR(product.price)}</p>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <p className="original-price">{formatPriceINR(product.originalPrice)}</p>
                          )}
                        </div>
                        <div className="rating-chip">
                          <span>★ {product.rating || 4.8}</span>
                          {product.sale && product.originalPrice > product.price && (
                            <small>
                              -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                            </small>
                          )}
                        </div>
                      </div>

                      <div className="quantity-selector">
                        <label htmlFor={`quantity-${product._id}`}>Qty</label>
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

              <div className="section-actions">
                <button
                  type="button"
                  className="show-all-btn"
                  onClick={() => toggleCategoryView(category)}
                >
                  {expandedCategories[category] ? 'Show Less' : 'Show All'}
                </button>
                {SHOP_ALL_ROUTES[category] && (
                  <Link to={SHOP_ALL_ROUTES[category]} className="secondary-link">
                    Visit full collection
                  </Link>
                )}
              </div>
            </section>
          )
        ))
      )}
      
    </div>
  );
};

export default MainComponent;