import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiEye } from 'react-icons/fi';
import { useCurrency } from '../../context/CurrencyContext';
import './ProductCard.css';

const ProductCard = ({ product, onAddToCart, onAddToWishlist }) => {
  const { formatPriceINR } = useCurrency();
  
  return (
    <div className="product-card">
      <div className="product-image-container">
        <Link to={`/product/${product._id}`} className="product-image-link">
          <div className="image-fallback">
            {product.images?.[0] ? (
              <img 
                src={product.images[0]} 
                alt={product.name}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
            ) : (
              <div className="no-image">
                <span>No Image</span>
              </div>
            )}
            <div className="no-image" style={{display: 'none'}}>
              <span>Image not available</span>
            </div>
          </div>
        </Link>
        <div className="product-actions">
          <button 
            className="action-btn wishlist-btn" 
            onClick={() => onAddToWishlist?.(product._id)}
            aria-label="Add to wishlist"
          >
            <FiHeart size={18} />
          </button>
          <button 
            className="action-btn cart-btn" 
            onClick={() => onAddToCart?.(product._id)}
            aria-label="Add to cart"
          >
            <FiShoppingBag size={18} />
          </button>
          <Link 
            to={`/product/${product._id}`} 
            className="action-btn view-btn"
            aria-label="View details"
          >
            <FiEye size={18} />
          </Link>
        </div>
        {product.discount > 0 && (
          <div className="discount-badge">
            -{product.discount}%
          </div>
        )}
      </div>
      <div className="product-details">
        <div className="product-category">{product.category || 'Luxury Apparel'}</div>
        <h3 className="product-title">
          <Link to={`/product/${product._id}`}>
            {product.name}
          </Link>
        </h3>
        <div className="product-price">
          {product.discount > 0 ? (
            <>
              <span className="current-price">{formatPriceINR(product.price * (1 - product.discount / 100))}</span>
              <span className="original-price">{formatPriceINR(product.price)}</span>
            </>
          ) : (
            <span className="current-price">{formatPriceINR(product.price)}</span>
          )}
        </div>
        {product.rating && (
          <div className="product-rating">
            {[...Array(5)].map((_, i) => (
              <span 
                key={i} 
                className={`star ${i < Math.round(product.rating) ? 'filled' : ''}`}
              >
                ★
              </span>
            ))}
            <span className="rating-count">({product.ratingCount || 0})</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
