import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiEye } from 'react-icons/fi';
import { useCurrency } from '../../context/CurrencyContext';
import './ProductCard.css';

const FALLBACK_IMAGE = 'https://via.placeholder.com/500x600/f5f1eb/1c1917?text=Luxe+Estate';

const ProductCard = ({ product, onAddToCart, onAddToWishlist }) => {
  const { formatPriceINR } = useCurrency();
  const getCategorySlug = () => {
    if (product.categorySlug) return product.categorySlug;
    if (typeof product.category === 'string') {
      return product.category.toLowerCase().replace(/\s+/g, '');
    }
    return 'products';
  };

  const detailLink = `/product/${getCategorySlug()}/${product._id}`;
  const primaryImage = product.images?.[0] || product.image || FALLBACK_IMAGE;
  
  return (
    <div className="product-card">
      <div className="product-image-container">
        <Link to={detailLink} className="product-image-link">
          <div className="image-fallback">
            <img 
              src={primaryImage}
              alt={product.name}
              onError={(e) => {
                e.target.src = FALLBACK_IMAGE;
              }}
            />
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
            to={detailLink} 
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
        <div className="product-card-header">
          <div className="product-category">{product.category || 'Luxury Apparel'}</div>
          {product.material && (
            <span className="product-pill">{product.material}</span>
          )}
        </div>

        <h3 className="product-title">
          <Link to={detailLink}>
            {product.name}
          </Link>
        </h3>

        {product.description && (
          <p className="product-summary">
            {product.description.length > 80
              ? `${product.description.slice(0, 80)}…`
              : product.description}
          </p>
        )}

        <ul className="product-meta-list">
          <li>
            <span>Sizes</span>
            <strong>{Array.isArray(product.size) ? product.size.slice(0, 3).join(' • ') : 'XS-XXL'}</strong>
          </li>
          <li>
            <span>Colors</span>
            <strong>{Array.isArray(product.color) ? product.color.slice(0, 2).join(' • ') : 'Curated'}</strong>
          </li>
        </ul>
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
