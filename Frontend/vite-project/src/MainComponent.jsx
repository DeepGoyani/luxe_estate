import { useState, useEffect } from 'react';
import axios from 'axios';
import './Landing.css'

const API_URL = 'https://luxe-estate-2.onrender.com/api';

const MainContent = ({ addToCart = () => {} }) => {
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

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

    fetchProducts();
  }, []);

  return (
    <main>
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

      {loading && <p>Loading products...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

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
                  <p className="luxury-rating">{Array.from({ length: Math.floor(product.rating) }, (_, i) => <span key={i}>⭐</span>)}</p>
                  <p className="luxury-price">USD {product.price}</p>
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
        </section>
      ))}
    </main>
  );
};

export default MainContent;
