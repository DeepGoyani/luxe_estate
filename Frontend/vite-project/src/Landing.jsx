// import  { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import './Landing.css'; // Ensure you have a Landing.css for styling

// const API_URL = 'http://localhost:3000/api';

// const LuxeEstate = () => {
//   const [email, setEmail] = useState('');
//   const [products, setProducts] = useState({});
//   const [cart, setCart] = useState([]);
//   const [currency, setCurrency] = useState('USD');
//   const [language, setLanguage] = useState('English');
//   const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
//   const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const currencies = ['INR', 'USD', 'EUR', 'GBP', 'JPY'];
//   const languages = ['English', 'Hindi', 'Spanish', 'French', 'German'];

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const categories = ['men', 'women', 'tshirts', 'shirts', 'trousers'];
//         const responses = await Promise.all(
//           categories.map((category) => axios.get(`${API_URL}/${category}`))
//         );
//         const data = responses.reduce((acc, res, index) => {
//           acc[categories[index]] = res.data;
//           return acc;
//         }, {});
//         setProducts(data);
//         setLoading(false);
//       } catch (err) {
//         console.error('Error fetching products:', err);
//         setError('Failed to load products');
//         setLoading(false);
//       }
//     };

//     const fetchCart = async () => {
//       try {
//         const response = await axios.get(`${API_URL}/cart`);
//         setCart(response.data.items || []);
//       } catch (err) {
//         console.error('Error fetching cart:', err);
//       }
//     };

//     fetchProducts();
//     fetchCart();
//   }, []);

//   const handleNewsletterSubmit = async (e) => {
//     e.preventDefault();
//     if (!email) {
//       alert('Please enter a valid email address.');
//       return;
//     }
//     try {
//       localStorage.setItem('subscriberEmail', email);
//       await axios.post(`${API_URL}/subscribers`, { email });
//       alert('Subscribed successfully!');
//       setEmail('');
//     } catch (error) {
//       alert('Failed to subscribe');
//     }
//   };

//   const addToCart = async (productId, categoryId, quantity) => {
//     try {
//       await axios.post(`${API_URL}/cart`, { productId, quantity, categoryId });
//       const response = await axios.get(`${API_URL}/cart`);
//       setCart(response.data.items || []);
//       alert('Item added to cart');
//     } catch (err) {
//       console.error('Error adding to cart:', err);
//       alert('Failed to add item to cart');
//     }
//   };

//   const [quantity, setQuantity] = useState(1);

//   useEffect(() => {
//     const savedEmail = localStorage.getItem('subscriberEmail');
//     if (savedEmail) {
//       setEmail(savedEmail);
//     }
//   }, []);

//   return (
//     <div className="main">
//       <header className="header">
//         <h1 className="le">The Luxe Estate</h1>
//       </header>

//       <nav className="navbar">
//         <div className="nav-links">
//           <button className="nav-btn">Shop Men</button>
//           <button className="nav-btn">Shop Women</button>
//           <button className="nav-btn">Contact Us</button>
//         </div>

//         <div className="nav-controls">
//           <div className="dropdown">
//             <button onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}>
//               {currency} ▼
//             </button>
//             {showCurrencyDropdown && (
//               <ul className="dropdown-menu">
//                 {currencies.map((cur) => (
//                   <li key={cur} onClick={() => setCurrency(cur)}>
//                     {cur}
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           <div className="dropdown">
//             <button onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}>
//               {language} ▼
//             </button>
//             {showLanguageDropdown && (
//               <ul className="dropdown-menu">
//                 {languages.map((lang) => (
//                   <li key={lang} onClick={() => setLanguage(lang)}>
//                     {lang}
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           <Link to="/cart" className="cart-btn">🛒 ({cart.length})</Link>
//         </div>
//       </nav>

//       <section className="hero-section">
//         <video autoPlay loop muted playsInline className="hero-video">
//           <source
//             src="https://old-money.com/cdn/shop/videos/c/vp/fd726fc6578a4ba48c24cdd4d2c94cb3/fd726fc6578a4ba48c24cdd4d2c94cb3.HD-720p-4.5Mbps-35961835.mp4"
//             type="video/mp4"
//           />
//           Your browser does not support the video tag.
//         </video>
//         <div className="hero-overlay">
//           <h2>{language === "Hindi" ? "लक्ज़री हमसे शुरू होती है" : "Luxury Starts and Ends With Us"}</h2>
//           <button className="shop-btn">
//             {language === "Hindi" ? "विशेष उत्पाद खरीदें" : "Shop Exclusive Products"}
//           </button>
//         </div>
//       </section>

//       {loading && <p>Loading products...</p>}
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       {Object.keys(products).map((category) => (
//         <section key={category} className="product-section">
//           <h2 className="collection-title">{category.charAt(0).toUpperCase() + category.slice(1)} Collection</h2>
//           <div className="product-grid">
//             {products[category]?.map((product) => (
//               <div key={product._id} className="luxury-product-card">
//                 <div className="luxury-product-image">
//                   <img src={product.image || 'https://via.placeholder.com/150'} alt={product.name} />
//                   {product.sale && <span className="sale-tag">Sale</span>}
//                 </div>
//                 <div className="luxury-product-info">
//                   <h3 className="product-name">{product.name}</h3>
//                   <p className="luxury-rating">{Array.from({ length: Math.floor(product.rating) }, (_, i) => (i + 1)).map((_, i) => <span key={i}>⭐</span>)}</p>
//                   <p className="luxury-price">
//                     {currency} {product.price}
//                   </p>
//                   <div className="quantity-selector">
//                     <label htmlFor={`quantity-${product._id}`}>Quantity:</label>
//                     <select
//                       id={`quantity-${product._id}`}
//                       defaultValue="1"
//                       onChange={(e) => setQuantity(parseInt(e.target.value))}
//                     >
//                       {[...Array(10).keys()].map(number => (
//                         <option key={number} value={number + 1}>{number + 1}</option>
//                       ))}
//                     </select>
//                     <button className="add-to-cart" onClick={() => addToCart(product._id.toString(), category, quantity)}>
//                       Add to Cart
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <button className="show-all-btn">Show All</button>
//         </section>
//       ))}

//       <footer className="footer">
//         <div className="footer-columns">
//           <h3>The Luxe Estate</h3>
//           <p>Kedar Business Hub Katargam Ved Road Surat Gujarat</p>
//           <ul>
//             <li><Link to="/">Home</Link></li>
//             <li><Link to="/shop">Shop</Link></li>
//             <li><Link to="/about">About</Link></li>
//             <li><Link to="/contact">Contact</Link></li>
//           </ul>
//         </div>
//         <div className="footer-columns">
//           <h4>Links</h4>
//           <ul>
//             <li><Link to="/payment-options">Payment Options</Link></li>
//             <li><Link to="/returns">Returns</Link></li>
//             <li><Link to="/privacy-policies">Privacy Policies</Link></li>
//           </ul>
//         </div>
//         <div className="footer-columns">
//           <h4>Help</h4>
//           {/* Add your help links here */}
//         </div>
//         <div className="footer-columns">
//           <h4>Newsletter</h4>
//           <form onSubmit={handleNewsletterSubmit}>
//             <input
//               type="email"
//               placeholder="Enter Your Email Address"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//             <button type="submit">SUBSCRIBE</button>
//           </form>
//         </div>
//         <div className="copyright">
//           <p>2023 The Luxe Estate. All rights reserved</p>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default LuxeEstate;