import  { useState } from 'react';
import { Star, ChevronRight, Search, ShoppingBag, Heart } from 'lucide-react';
import './Exclusive.css';
import HeaderNavbar from '../../HeaderNavbar';
import Footer from '../../Footer';


const ExclusiveProducts = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [hoveredProduct, setHoveredProduct] = useState(null);

  const filters = [
    { id: 'all', label: 'All Collections' },
    { id: 'exclusive', label: 'Exclusive Edition' },
    { id: 'limited', label: 'Limited Series' },
    { id: 'premium', label: 'Premium Selection' }
  ];

  const products = [
    {
     id: 1,
      name: "The Manhattan Suit",
      price: "$1,299",
      rating: 5,
      image: "/placeholder.svg?height=600&width=400",
      category: "Exclusive Edition",
      description: "Tailored perfection in Italian wool",
      discount: "15% OFF"
    },
    // ... other products
  ];

  return (
    <div className="exclusive-shop">
      {/* Hero Section */}
      <HeaderNavbar/>

      <div className="hero-section">
        <div className="hero-content">
          <h1>Exclusive Collection</h1>
          <p>Where Luxury Meets Legacy</p>
          <div className="search-bar">
            <Search className="search-icon" />
            <input type="text" placeholder="Search exclusive items..." />
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <div className="filter-container">
          {filters.map(filter => (
            <button
              key={filter.id}
              className={`filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter.id)}
            >
              {filter.label}
              <ChevronRight className={`arrow-icon ${activeFilter === filter.id ? 'active' : ''}`} />
            </button>
          ))}
        </div>
      </div>

      {/* Featured Product */}
      <div className="featured-product">
        <div className="featured-content">
          <span className="featured-label">Featured Item</span>
          <h2>The Manhattan Collection</h2>
          <p>Experience unparalleled luxury with our signature collection</p>
          <button className="explore-btn">
            Explore Collection
            <ChevronRight className="btn-icon" />
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {products.map(product => (
          <div
            key={product.id}
            className="product-card"
            onMouseEnter={() => setHoveredProduct(product.id)}
            onMouseLeave={() => setHoveredProduct(null)}
          >
            <div className="product-image">
              <img src={product.image || "/placeholder.svg"} alt={product.name} />
              {hoveredProduct === product.id && (
                <div className="product-actions">
                  <button className="action-btn">
                    <ShoppingBag className="action-icon" />
                  </button>
                  <button className="action-btn">
                    <Heart className="action-icon" />
                  </button>
                </div>
              )}
              {product.isNew && <span className="status-label new">New Arrival</span>}
              {product.trending && <span className="status-label trending">Trending</span>}
              {product.discount && <span className="status-label discount">{product.discount}</span>}
            </div>
            <div className="product-info">
              <div className="product-category">{product.category}</div>
              <h3>{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <div className="product-details">
                <span className="price">${product.price}</span>
                <div className="rating">
                  {[...Array(product.rating)].map((_, i) => (
                    <Star key={i} className="star-icon" fill="currentColor" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Footer/>
    </div>
  );
};

export default ExclusiveProducts;