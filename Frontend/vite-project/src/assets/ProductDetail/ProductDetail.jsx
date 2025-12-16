import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FiShoppingCart, FiHeart, FiShare2, FiPlus, FiMinus, FiEye } from 'react-icons/fi';
import { useCurrency } from '../../context/CurrencyContext.jsx';
import './ProductDetail.css';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const ProductDetail = () => {
  const { category, productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const { formatPriceINR } = useCurrency();

  useEffect(() => {
    fetchProduct();
    fetchRelatedProducts();
  }, [category, productId]);

  // Auto-play carousel
  useEffect(() => {
    if (isAutoPlaying && product && product.images && product.images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => 
          prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000); // Change image every 3 seconds

      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, product]);

  const handleImageChange = (index) => {
    setCurrentImageIndex(index);
    setIsAutoPlaying(false); // Stop auto-play when user manually changes image
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  const fetchProduct = async () => {
    try {
      console.log('Fetching product:', `${API_URL}/${category}/${productId}`);
      const response = await axios.get(`${API_URL}/${category}/${productId}`);
      console.log('Product response:', response.data);
      setProduct(response.data);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Product not found');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/${category}`);
      setRelatedProducts(response.data.slice(0, 4));
    } catch (err) {
      console.error('Error fetching related products:', err);
    }
  };

  const addToCart = async () => {
    try {
      await axios.post(`${API_URL}/cart`, {
        productId,
        category,
        quantity
      });
      alert('Product added to cart successfully!');
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Failed to add product to cart');
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    console.log('Loading state:', loading);
    return (
      <div className="product-detail-page">
        <div className="page-loader">
          <div className="luxe-ring">
            <div className="luxe-initials">LE</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    console.log('Error state:', error, 'Product state:', product);
    return (
      <div className="product-detail-page">
        <div className="error-message">
          <h2>Product not found</h2>
          <p>The product you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  console.log('Rendering product:', product);

  return (
    <>
      <div className="product-detail-page">
        <div className="product-detail-container">
          <div className="product-detail-content">
            <div className="product-image-section">
              <div className="main-image-container">
                <img 
                  src={(product.images && product.images[currentImageIndex]) || product.image || 'https://via.placeholder.com/400x500?text=Luxe+Product'} 
                  alt={product.name}
                  className="product-main-image"
                  loading="lazy"
                />
              </div>
              {product.images && product.images.length > 1 && (
                <div className="thumbnail-gallery">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => handleImageChange(index)}
                      className={`thumbnail ${currentImageIndex === index ? 'active' : ''}`}
                    >
                      <img 
                        src={image} 
                        alt={`${product.name} - View ${index + 1}`}
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="product-info-section">
              <div className="product-header">
                <h1 className="product-title">{product.name}</h1>
                <div className="product-badges">
                  {product.newArrival && <span className="badge new-arrival">NEW</span>}
                  {product.sale && <span className="badge sale-badge">SALE</span>}
                  {!product.inStock && <span className="badge out-of-stock">OUT OF STOCK</span>}
                </div>
              </div>
              
              <div className="price-section">
                <div className="price-container">
                  <span className="current-price">{formatPriceINR(product.price)}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="original-price">{formatPriceINR(product.originalPrice)}</span>
                  )}
                </div>
                {product.originalPrice && product.originalPrice > product.price && (
                  <div className="discount-percentage">
                    -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </div>
                )}
              </div>
              
              <div className="product-rating">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} className={i < Math.floor(product.rating || 4.8) ? 'star-filled' : 'star-empty'}>★</span>
                ))}
                <span className="rating-text">1 Customer Review</span>
              </div>

              <p className="product-description">
                {product.description || "Experience unparalleled luxury with our premium collection. Crafted with the finest materials and attention to detail, this piece embodies timeless elegance and sophistication."}
              </p>

              {product.features && (
                <div className="product-features">
                  <h4>Key Features:</h4>
                  <div className="features-list">
                    {product.features.map((feature, index) => (
                      <div key={index} className="feature-tag">
                        ✨ {feature}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="product-actions">
                <div className="quantity-selector">
                  <label>Quantity</label>
                  <div className="quantity-controls">
                    <button 
                      className="quantity-btn" 
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                    >
                      <FiMinus />
                    </button>
                    <span className="quantity-value">{quantity}</span>
                    <button 
                      className="quantity-btn" 
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= 10}
                    >
                      <FiPlus />
                    </button>
                  </div>
                </div>

                <div className="action-buttons">
                  <button className="add-to-cart-btn" onClick={addToCart}>
                    <FiShoppingCart size={18} />
                    Add to Cart
                  </button>
                  <button className="wishlist-btn">
                    <FiHeart size={18} />
                  </button>
                  <button className="share-btn">
                    <FiShare2 size={18} />
                  </button>
                </div>
              </div>

              <div className="product-meta">
                <div className="meta-item">
                  <span className="meta-label">SKU:</span>
                  <span className="meta-value">{product._id}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Category:</span>
                  <span className="meta-value">{category}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Tags:</span>
                  <span className="meta-value">Luxury, Premium, {category}</span>
                </div>
              </div>

              <div className="share-section">
                <label>Share</label>
                <div className="share-buttons">
                  <button className="share-btn">📘</button>
                  <button className="share-btn">📷</button>
                  <button className="share-btn">🐦</button>
                </div>
              </div>
            </div>
          </div>

          <div className="product-description-section">
            <h2>Description</h2>
            <p>
              {product.description || "This exceptional piece represents the pinnacle of luxury fashion. Meticulously crafted with premium materials and traditional techniques, it offers unparalleled comfort and style. The attention to detail is evident in every stitch, making it a perfect addition to any sophisticated wardrobe."}
            </p>
            <p>
              Designed for the discerning individual who appreciates quality and elegance, this product combines timeless design with modern functionality. Whether for special occasions or everyday luxury, it delivers exceptional value and lasting satisfaction.
            </p>
          </div>

          <div className="related-products-section">
            <div className="section-header">
              <h2>You May Also Like</h2>
              <div className="section-divider"></div>
            </div>
            <div className="related-products-grid">
              {relatedProducts.map(relatedProduct => {
                const categorySlug = relatedProduct.category?.toLowerCase().replace(/\s+/g, '') || 'products';
                const detailLink = `/product/${categorySlug}/${relatedProduct._id}`;
                
                return (
                  <Link key={relatedProduct._id} to={detailLink} className="related-product-card">
                    <div className="related-product-image">
                      <img 
                        src={relatedProduct.image || 'https://via.placeholder.com/300x400?text=Luxe+Product'} 
                        alt={relatedProduct.name}
                        loading="lazy"
                      />
                      {relatedProduct.newArrival && <span className="related-badge">New</span>}
                    </div>
                    <div className="related-product-info">
                      <h4>{relatedProduct.name}</h4>
                      <p className="related-price">{formatPriceINR(relatedProduct.price)}</p>
                      <div className="related-rating">
                        ★ {relatedProduct.rating || 4.8}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="view-all-container">
              <Link to={`/category/${category}`} className="view-all-btn">
                View All {category} Products →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
