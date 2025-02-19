import  { useState } from 'react';
import axios from 'axios';
import HeaderNavbar from './HeaderNavbar';
import Footer from './Footer';
import './Landing.css'; // Ensure the path is correct based on your project structure

const API_URL = 'http://localhost:3000/api';

const MainComponent = () => {
  const [products, setProducts] = useState({});
  const [cart, setCart] = useState([]);
  const [currency, setCurrency] = useState('USD');
  const [language, setLanguage] = useState('English');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Define quantity state and its setter
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

    const fetchCart = async () => {
     try {
       const response = await axios.get(`${API_URL}/cart`);
       setCart(response.data.items || []);
     } catch (err) {
       console.error('Error fetching cart:', err);
    }
   };

    fetchProducts();
    fetchCart();
  }, []);

  const addToCart = async (productId, categoryId, quantity) => {
    try {
      await axios.post(`${API_URL}/cart`, { productId, quantity, categoryId });
      const response = await axios.get(`${API_URL}/cart`);
      setCart(response.data.items || []);
      alert('Item added to cart');
   } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Failed to add item to cart');
    }
  };

  return (
    <div className="main">
      <HeaderNavbar
        currency={currency}
        setCurrency={setCurrency}
        language={language}
        setLanguage={setLanguage}
        cart={cart}
        addToCart={addToCart}
      />
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
                  <p className="luxury-rating">{Array.from({ length: Math.floor(product.rating) }, (_, i) => (i + 1)).map((_, i) => <span key={i}>⭐</span>)}</p>
                  <p className="luxury-price">
                    {currency} {product.price}
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