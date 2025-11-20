import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiShoppingCart, FiHeart, FiShare2, FiCheck, FiPlus, FiMinus } from 'react-icons/fi';
import { BsArrowLeft } from 'react-icons/bs';
import HeaderNavbar from '../../HeaderNavbar';
import Footer from '../../Footer';
import { useCurrency } from '../../context/CurrencyContext.jsx';
import './ProductDetail.css';

const ProductDetail = () => {
  const { category, productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState('L');
  const [selectedColor, setSelectedColor] = useState('purple');
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { formatPriceINR } = useCurrency();

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
  const colors = [
    { name: 'purple', value: '#8b5cf6' },
    { name: 'black', value: '#000000' },
    { name: 'gold', value: '#d97706' }
  ];

  useEffect(() => {
    fetchProduct();
    fetchRelatedProducts();
  }, [category, productId]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/${category}/${productId}`);
      setProduct(response.data);
    } catch (err) {
      setError('Product not found');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/${category}`);
      setRelatedProducts(response.data.slice(0, 4));
    } catch (err) {
      console.error('Error fetching related products:', err);
    }
  };

  const addToCart = async () => {
    try {
      await axios.post('http://localhost:3000/api/cart', {
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
    return (
      <>
        <HeaderNavbar />
        <div className="product-detail-page">
          <div className="page-loader">
            <div className="luxe-ring">
              <div className="luxe-initials">LE</div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <HeaderNavbar />
        <div className="product-detail-page">
          <div className="error-message">
            <h2>Product not found</h2>
            <p>The product you're looking for doesn't exist.</p>
            <button onClick={() => navigate('/')} className="btn-primary">
              Go Back Home
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <HeaderNavbar />
      <div className="product-detail-page">
        <div className="product-detail-container">
          <div className="product-detail-content">
            <div className="product-image-section">
              <img 
                src={product.image || 'https://via.placeholder.com/500x600/f5f3f0/3a3a3a?text=Product'} 
                alt={product.name}
                className="product-main-image"
              />
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

              <div className="product-options">
                <div className="size-selection">
                  <label>Size</label>
                  <div className="size-buttons">
                    {sizes.map(size => (
                      <button
                        key={size}
                        className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="color-selection">
                  <label>Color</label>
                  <div className="color-swatches">
                    {colors.map(color => (
                      <button
                        key={color.name}
                        className={`color-swatch ${selectedColor === color.name ? 'selected' : ''}`}
                        style={{ backgroundColor: color.value }}
                        onClick={() => setSelectedColor(color.name)}
                      />
                    ))}
                  </div>
                </div>

                <div className="quantity-selection">
                  <label>Quantity</label>
                  <div className="quantity-controls">
                    <button 
                      onClick={() => handleQuantityChange(-1)}
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <span className="quantity-value">{quantity}</span>
                    <button 
                      onClick={() => handleQuantityChange(1)}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <button 
                className={`add-to-cart-btn ${!product.inStock ? 'disabled' : ''}`}
                onClick={() => product.inStock && addToCart()}
                disabled={!product.inStock}
              >
                {!product.inStock ? 'Out of Stock' : 'Add To Cart'}
              </button>

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
              {relatedProducts.map(relatedProduct => (
                <div key={relatedProduct._id} className="related-product-card">
                  <div className="product-image-container">
                    <Link to={`/product/${relatedProduct.category}/${relatedProduct._id}`} className="product-image-link">
                      <div className="image-fallback">
                        <img 
                          src={relatedProduct.images?.[0] || 'https://via.placeholder.com/300x400/f5f3f0/3a3a3a?text=Product+Image'} 
                          alt={relatedProduct.name}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextElementSibling.style.display = 'flex';
                          }}
                        />
                        <div className="no-image" style={{display: 'none'}}>
                          <span>Image not available</span>
                        </div>
                      </div>
                    </Link>
                    <div className="product-actions">
                      <button className="action-btn wishlist-btn">
                        <FiHeart size={18} />
                      </button>
                      <button className="action-btn cart-btn">
                        <FiShoppingCart size={18} />
                      </button>
                      <Link 
                        to={`/product/${relatedProduct.category}/${relatedProduct._id}`} 
                        className="action-btn view-btn"
                      >
                        <FiEye size={18} />
                      </Link>
                    </div>
                    {relatedProduct.discount > 0 && (
                      <div className="discount-badge">
                        -{relatedProduct.discount}%
                      </div>
                    )}
                  </div>
                  <div className="product-details">
                    <div className="product-category">{relatedProduct.category || 'Luxury Apparel'}</div>
                    <h3 className="product-title">
                      <Link to={`/product/${relatedProduct.category}/${relatedProduct._id}`}>
                        {relatedProduct.name}
                      </Link>
                    </h3>
                    <div className="product-price">
                      {relatedProduct.discount > 0 ? (
                        <>
                          <span className="current-price">
                            {formatPriceINR(relatedProduct.price * (1 - relatedProduct.discount / 100))}
                          </span>
                          <span className="original-price">
                            {formatPriceINR(relatedProduct.price)}
                          </span>
                        </>
                      ) : (
                        <span className="current-price">
                          {formatPriceINR(relatedProduct.price)}
                        </span>
                      )}
                    </div>
                    {relatedProduct.rating && (
                      <div className="product-rating">
                        {[...Array(5)].map((_, i) => (
                          <span 
                            key={i} 
                            className={`star ${i < Math.round(relatedProduct.rating) ? 'filled' : ''}`}
                          >
                            ★
                          </span>
                        ))}
                        <span className="rating-count">({relatedProduct.ratingCount || 0})</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="view-all-container">
              <Link to={`/category/${category}`} className="view-all-btn">
                View All {category} Products →
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetail;
