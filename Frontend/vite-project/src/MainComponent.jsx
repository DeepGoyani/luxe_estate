import { useState, useEffect } from 'react';
import axios from 'axios';
import HeaderNavbar from './HeaderNavbar';
import Footer from './Footer';
import './Landing.css';

const API_URL = 'http://localhost:3000/api';

const MainComponent = () => {
  const [products, setProducts] = useState({});
  const [cart, setCart] = useState([]);
  const [currency, setCurrency] = useState('USD');
  const [conversionRates, setConversionRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const addToCart = async (productId, category, quantity) => {
    console.log('Adding to cart:', { productId, category, quantity }); // Debugging
  
    try {
      const response = await axios.post(`${API_URL}/cart`, {
        productId,
        category, // Make sure category is being sent
        quantity,
      });
  
      console.log('Response from server:', response.data); // Debug log
      const cartResponse = await axios.get(`${API_URL}/cart`);
      setCart(cartResponse.data.items || []);
      alert('Item added to cart');
    } catch (err) {
      console.error('Error adding to cart:', err);
      if (err.response && err.response.data) {
        alert(`Failed to add item to cart: ${err.response.data.error}`);
      } else {
        alert('Failed to add item to cart');
      }
    }
  };
  
  const handleAddToCart = async (product) => {
    try {
      console.log("Adding product:", product); // Debug log
  
      const response = await fetch("http://localhost:5000/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product._id,
          category: product.category,  // Ensure this exists
          quantity: 1,
        }),
      });
  
      const data = await response.json();
      console.log("Cart response:", data); // Debug log
  
      if (!response.ok) {
        throw new Error(data.error || "Failed to add item to cart");
      }
  
      alert("Item added to cart successfully!");
    } catch (error) {
      console.error("Failed to add item to cart:", error.message);
    }
  };
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const categories = ['men', 'women', 'tshirts', 'shirts', 'trousers'];
        const responses = await Promise.all(
          categories.map((category) => axios.get(`${API_URL}/${category}`))
        );
        const data = responses.reduce((acc, res, index) => {
          acc[categories[index]] = res.data;
          return acc;
        }, {});
        setProducts(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
        setLoading(false);
      }
    };

    const fetchCart = async () => {
      try {
        const response = await axios.get(`${API_URL}/cart`);
        setCart(response.data.items || []);
      } catch (err) {
        console.error('Error fetching cart:', err);
      }
    };

    const fetchConversionRates = async () => {
      try {
        const response = await axios.get(`${API_URL}/conversion-rates`);
        setConversionRates(response.data);
      } catch (err) {
        console.error('Error fetching conversion rates:', err);
      }
    };

    fetchProducts();
    fetchCart();
    fetchConversionRates();
  }, []);

  const convertPrice = (price, currency) => {
    if (currency === 'USD') return price;
    return (price * conversionRates[currency]).toFixed(2);
  };

  return (
    <div className="main">
      <HeaderNavbar
        currency={currency}
        setCurrency={setCurrency}
        cart={cart}
        addToCart={addToCart}
      />
      {loading && <p>Loading products...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
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
      {Object.keys(products).map((category) => (
        <section key={category} className="product-section">
          <h2 className="collection-title">{category.charAt(0).toUpperCase() + category.slice(1)} Collection</h2>
          <div className="product-grid">
            {products[category]?.map((product) => (
              <div key={product._id} className="luxury-product-card">
                <div className="luxury-product-image">
                  <img src={product.image || 'https://via.placeholder.com/150'} alt={product.name} />
                  {product.sale && <span className="sale-tag">Sale</span>}
                </div>
                <div className="luxury-product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="luxury-rating">{Array.from({ length: Math.floor(product.rating) }, (_, i) => (i + 1)).map((_, i) => <span key={i}>⭐</span>)}</p>
                  <p className="luxury-price">
                    {currency} {convertPrice(product.price, currency)}
                  </p>
                  <div className="quantity-selector">
                    <label htmlFor={`quantity-${product._id}`}>Quantity:</label>
                    <select
                      id={`quantity-${product._id}`}
                      defaultValue="1"
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                    >
                      {[...Array(10).keys()].map(number => (
                        <option key={number} value={number + 1}>{number + 1}</option>
                      ))}
                    </select>
                    <button className="add-to-cart" onClick={() => addToCart(product._id.toString(), category, quantity)}>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="show-all-btn">Show All</button>
        </section>
      ))}
      <Footer />
    </div>
  );
};

export default MainComponent;