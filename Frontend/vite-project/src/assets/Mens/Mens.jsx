import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import HeaderNavbar from '../../HeaderNavbar';
import Footer from '../../Footer';
import { useCurrency } from '../../context/CurrencyContext.jsx';
import LuxeLoader from '../../components/LuxeLoader';
import { Filter, SortAsc, Grid, List, Star } from 'lucide-react';

const API_URL = 'http://localhost:3000/api';

const Mens = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMaterial, setSelectedMaterial] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const { formatPriceINR } = useCurrency();

  const formatListPreview = (value, fallback = 'Luxury fit range') => {
    if (Array.isArray(value) && value.length) {
      const preview = value.slice(0, 3).join(' • ');
      return value.length > 3 ? `${preview} +` : preview;
    }
    return typeof value === 'string' && value.trim() ? value : fallback;
  };

  const categories = [
    { value: 'all', label: 'All Products' },
    { value: 'tshirts', label: 'T-Shirts' },
    { value: 'shirts', label: 'Shirts' },
    { value: 'trousers', label: 'Trousers' },
    { value: 'blazers', label: 'Blazers' },
    { value: 'jeans', label: 'Jeans' },
    { value: 'accessories', label: 'Accessories' }
  ];

  const materials = [
    { value: 'all', label: 'All Materials' },
    { value: 'cotton', label: 'Cotton' },
    { value: 'cashmere', label: 'Cashmere' },
    { value: 'silk', label: 'Silk' },
    { value: 'wool', label: 'Wool' },
    { value: 'linen', label: 'Linen' },
    { value: 'denim', label: 'Denim' }
  ];

  const sortOptions = [
    { value: 'name', label: 'Name A-Z' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Rating' },
    { value: 'newest', label: 'Newest First' }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, selectedCategory, selectedMaterial, sortBy, priceRange]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const responses = await Promise.all([
        axios.get(`${API_URL}/tshirts`),
        axios.get(`${API_URL}/shirts`)
      ]);
      
      const allProducts = [
        ...responses[0].data.map(product => ({ ...product, category: 'tshirts' })),
        ...responses[1].data.map(product => ({ ...product, category: 'shirts' }))
      ];
      
      setProducts(allProducts);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by material
    if (selectedMaterial !== 'all') {
      filtered = filtered.filter(product => 
        product.material && product.material.toLowerCase().includes(selectedMaterial.toLowerCase())
      );
    }

    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return (b.rating || 4.8) - (a.rating || 4.8);
        case 'newest':
          return new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now());
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  };

  const handleProductClick = (product) => {
    navigate(`/product/${product.category}/${product._id}`);
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedMaterial('all');
    setPriceRange([0, 5000]);
    setSortBy('name');
  };

  if (loading) {
    return (
      <>
        <HeaderNavbar />
        <div className="mens-page">
          <LuxeLoader message="Curating the gentlemen's atelier..." />
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <HeaderNavbar />
        <div className="mens-page">
          <div className="error-message">
            <p>{error}</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <div className="mens-page">
      <HeaderNavbar />
      
      <div className="mens-hero">
        <div className="mens-hero-content">
          <h1>Men's Collection</h1>
          <p>Discover premium menswear crafted for the modern gentleman</p>
        </div>
      </div>

      <div className="mens-container">
        <div className="mens-sidebar">
          <div className="filter-section">
            <div className="filter-header">
              <Filter size={20} />
              <h3>Filters</h3>
              <button className="clear-filters" onClick={clearFilters}>
                Clear All
              </button>
            </div>

            <div className="filter-group">
              <h4>Category</h4>
              <div className="filter-options">
                {categories.map(category => (
                  <label key={category.value} className="filter-option">
                    <input
                      type="radio"
                      name="category"
                      value={category.value}
                      checked={selectedCategory === category.value}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    />
                    <span className="checkmark"></span>
                    {category.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h4>Material</h4>
              <div className="filter-options">
                {materials.map(material => (
                  <label key={material.value} className="filter-option">
                    <input
                      type="radio"
                      name="material"
                      value={material.value}
                      checked={selectedMaterial === material.value}
                      onChange={(e) => setSelectedMaterial(e.target.value)}
                    />
                    <span className="checkmark"></span>
                    {material.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h4>Price Range</h4>
              <div className="price-range">
                <input
                  type="range"
                  min="0"
                  max="5000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="price-slider"
                />
                <div className="price-labels">
                  <span>{formatPriceINR(priceRange[0])}</span>
                  <span>{formatPriceINR(priceRange[1])}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mens-content">
          <div className="mens-toolbar">
            <div className="results-info">
              <p>Showing {filteredProducts.length} products</p>
            </div>
            
            <div className="toolbar-controls">
              <div className="sort-control">
                <SortAsc size={16} />
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="view-controls">
                <button 
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid size={16} />
                </button>
                <button 
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className={`products-grid ${viewMode}`}>
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <div 
                  key={product._id} 
                  className="product-card"
                  onClick={() => handleProductClick(product)}
                >
                  <div className="product-image-container">
                    <img
                      src={product.image || 'https://via.placeholder.com/300x400/f5f3f0/3a3a3a?text=Luxe+Estate'}
                      alt={product.name}
                      className="product-image"
                    />
                    <div className="product-badges">
                      {product.newArrival && <span className="badge new-arrival">NEW</span>}
                      {product.sale && <span className="badge sale-badge">SALE</span>}
                      {!product.inStock && <span className="badge out-of-stock">OUT OF STOCK</span>}
                    </div>
                  </div>
                  
                  <div className="product-info">
                    <div className="product-header">
                      <h3 className="product-name">{product.name}</h3>
                      {product.description && (
                        <p className="product-summary">
                          {product.description.length > 110 
                            ? `${product.description.slice(0, 110)}…`
                            : product.description}
                        </p>
                      )}
                    </div>
                    
                    <div className="luxury-rating">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span key={i} className={i < Math.floor(product.rating || 4.8) ? 'star-filled' : 'star-empty'}>★</span>
                      ))}
                      <span className="rating-text">({product.rating || 4.8})</span>
                    </div>
                    
                    <div className="product-details">
                      <div className="detail-item">
                        <span className="detail-label">Material:</span>
                        <span className="detail-value">{product.material || 'Premium Cotton'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Sizes:</span>
                        <span className="detail-value">{formatListPreview(product.size, 'XS-XXL')}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Colors:</span>
                        <span className="detail-value">{formatListPreview(product.color, 'Curated Palette')}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Category:</span>
                        <span className="detail-value">{product.category.charAt(0).toUpperCase() + product.category.slice(1)}</span>
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
                    
                    {product.features && (
                      <div className="product-features">
                        {product.features.slice(0, 1).map((feature, index) => (
                          <div key={index} className="feature-tag">
                            ✨ {feature}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-products">
                <p>No products found matching your criteria.</p>
                <button className="clear-filters-btn" onClick={clearFilters}>
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Mens;
