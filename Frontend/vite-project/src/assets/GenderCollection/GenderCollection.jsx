import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LuxeLoader from '../../components/LuxeLoader';
import ProductCard from '../../components/ProductCard/ProductCard';
import { useCurrency } from '../../context/CurrencyContext';
import '../Collection/CollectionGallery.css';
import './GenderCollection.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const INLINE_PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400">' +
      '<rect width="100%" height="100%" fill="#f4efe6" />' +
      '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#b1976b" font-family="serif" font-size="18">Luxe Estate</text>' +
    '</svg>'
  );

const SEGMENT_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'T-Shirts', value: 'tshirts' },
  { label: 'Shirts', value: 'shirts' },
  { label: 'Trousers', value: 'trousers' }
];

const SORT_OPTIONS = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'New Arrivals', value: 'new' }
];

const normalizeList = (value) => {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }
  return value ? [value] : [];
};

const inferSegment = (product = {}) => {
  const source = `${product.name || ''} ${product.description || ''}`.toLowerCase();
  if (/tee|t-shirt|tshirt|polo/.test(source)) return 'tshirts';
  if (/shirt|blouse|oxford|tun(i|)c/.test(source)) return 'shirts';
  if (/trouser|pant|pants|trouser|chino|denim|jean|skirt|jogger|short/.test(source)) return 'trousers';
  return 'other';
};

const formatListPreview = (value, fallback = 'Tailored Fit') => {
  if (Array.isArray(value) && value.length > 0) {
    const preview = value.slice(0, 3).join(' • ');
    return value.length > 3 ? `${preview} +` : preview;
  }
  return value || fallback;
};

const getDisplayCategory = (category) =>
  category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Collection';

const getCategorySlug = (product = {}, fallback = 'products') => {
  const source = product.categorySlug || product.category || fallback;
  return typeof source === 'string' ? source.toLowerCase().replace(/\s+/g, '') : 'products';
};

const GenderCollection = ({
  gender = 'men',
  title,
  subtitle,
  heroImage,
  endpoint,
  eyebrow,
  segmentOptions = SEGMENT_OPTIONS,
  enableSegmentFilter = true
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    segment: 'all',
    material: 'all',
    color: 'all',
    size: 'all',
    sort: 'featured'
  });
  const [priceBounds, setPriceBounds] = useState([0, 0]);
  const [priceLimit, setPriceLimit] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const { formatPriceINR } = useCurrency();

  const handleAddToCart = (productId, quantity = 1) => {
    const product = products.find(p => p._id === productId);
    if (product) {
      setCartItems(prev => {
        const existingItem = prev.find(item => item.productId === productId);
        if (existingItem) {
          return prev.map(item => 
            item.productId === productId 
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          return [...prev, { productId, quantity, product }];
        }
      });
      
      // Show success feedback
      console.log(`Added ${quantity} ${product.name} to cart`);
    }
  };

  const handleAddToWishlist = (productId) => {
    console.log(`Added product ${productId} to wishlist`);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        setFilters({ segment: 'all', material: 'all', color: 'all', size: 'all', sort: 'featured' });
        const resource = endpoint || gender;
        const { data } = await axios.get(`${API_BASE_URL}/${resource}`);

        const enriched = (data || []).map((item) => {
          const normalizedColors = normalizeList(item.color).map((color) => color?.toLowerCase?.() ?? color);
          const normalizedSizes = normalizeList(item.size || item.sizes).map((size) => size?.toLowerCase?.() ?? size);
          return {
            ...item,
            price: Number(item.price) || 0,
            segment: inferSegment(item),
            normalizedColors,
            normalizedSizes,
            images: item.images?.length ? item.images : item.image ? [item.image] : []
          };
        });

        setProducts(enriched);
        if (enriched.length) {
          const prices = enriched.map((p) => p.price);
          const min = Math.min(...prices);
          const max = Math.max(...prices);
          setPriceBounds([min, max]);
          setPriceLimit(max);
        } else {
          setPriceBounds([0, 0]);
          setPriceLimit(0);
        }
      } catch (fetchError) {
        console.error(fetchError);
        setError('Failed to load the collection. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [gender]);

  const availableSegments = useMemo(() => {
    const segmentSet = new Set();
    products.forEach((product) => {
      if (product.segment && product.segment !== 'other') {
        segmentSet.add(product.segment);
      }
    });
    return segmentSet;
  }, [products]);

  const materialOptions = useMemo(() => {
    const options = new Set();
    products.forEach((product) => {
      if (product.material) {
        options.add(product.material.toLowerCase());
      }
    });
    return Array.from(options).sort();
  }, [products]);

  const colorOptions = useMemo(() => {
    const options = new Set();
    products.forEach((product) => {
      normalizeList(product.color).forEach((color) => {
        if (color) {
          options.add(color.toLowerCase());
        }
      });
    });
    return Array.from(options).sort();
  }, [products]);

  const sizeOptions = useMemo(() => {
    const options = new Set();
    products.forEach((product) => {
      normalizeList(product.size || product.sizes).forEach((size) => {
        if (size) {
          options.add(size.toLowerCase());
        }
      });
    });
    return Array.from(options).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }, [products]);

  const filteredProducts = useMemo(() => {
    const next = products.filter((product) => {
      if (filters.segment !== 'all' && product.segment !== filters.segment) return false;
      if (
        filters.material !== 'all' &&
        product.material?.toLowerCase() !== filters.material
      )
        return false;
      if (
        filters.color !== 'all' &&
        !product.normalizedColors?.includes(filters.color)
      )
        return false;
      if (
        filters.size !== 'all' &&
        !product.normalizedSizes?.includes(filters.size)
      )
        return false;
      if (priceLimit && product.price > priceLimit) return false;
      return true;
    });

    switch (filters.sort) {
      case 'price-asc':
        return next.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return next.sort((a, b) => b.price - a.price);
      case 'new':
        return next.sort((a, b) => (b.newArrival === true) - (a.newArrival === true));
      default:
        return next;
    }
  }, [products, filters, priceLimit]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({ segment: 'all', material: 'all', color: 'all', size: 'all', sort: 'featured' });
    setPriceLimit(priceBounds[1]);
  };

  if (loading) {
    return <LuxeLoader message={`Curating the ${title || 'collection'}...`} />;
  }

  if (error) {
    return <div className="gender-empty-state">{error}</div>;
  }

  return (
    <div className="gender-page">
      <section
        className="gender-hero"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(11, 10, 10, 0.65), rgba(11, 10, 10, 0.15)), url(${heroImage})`
        }}
      >
        <div className="gender-hero-content">
          <p className="gender-eyebrow">{eyebrow || (gender === 'men' ? 'The Gentleman Atelier' : 'The Salon Collection')}</p>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </section>

      <section className="gender-content">
        <div className="gender-filter-panel-toggle">
          <button
            type="button"
            className="ghost-btn filter-toggle-btn"
            onClick={() => setFiltersOpen((prev) => !prev)}
          >
            {filtersOpen ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
        <div className={`gender-filter-panel ${filtersOpen ? 'open' : 'collapsed'}`}>
          <div className="gender-panel-header">
            <div>
              <p className="panel-label">Filters</p>
              <h3>{filteredProducts.length} styles curated</h3>
            </div>
            <button type="button" className="ghost-btn" onClick={clearFilters}>
              Reset
            </button>
          </div>

          {enableSegmentFilter && segmentOptions.length > 0 && (
            <div className="chip-group">
              {segmentOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`filter-chip ${filters.segment === option.value ? 'active' : ''}`}
                  disabled={option.value !== 'all' && !availableSegments.has(option.value)}
                  onClick={() => handleFilterChange('segment', option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}

          <div className="filter-grid">
            <label className="filter-control">
              <span>Material</span>
              <select
                value={filters.material}
                onChange={(e) => handleFilterChange('material', e.target.value)}
              >
                <option value="all">All materials</option>
                {materialOptions.map((material) => (
                  <option key={material} value={material}>
                    {material.replace(/\b\w/g, (char) => char.toUpperCase())}
                  </option>
                ))}
              </select>
            </label>

            <label className="filter-control">
              <span>Color</span>
              <select
                value={filters.color}
                onChange={(e) => handleFilterChange('color', e.target.value)}
              >
                <option value="all">All palettes</option>
                {colorOptions.map((color) => (
                  <option key={color} value={color}>
                    {color.replace(/\b\w/g, (char) => char.toUpperCase())}
                  </option>
                ))}
              </select>
            </label>

            <label className="filter-control">
              <span>Size</span>
              <select
                value={filters.size}
                onChange={(e) => handleFilterChange('size', e.target.value)}
              >
                <option value="all">All sizes</option>
                {sizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size.toUpperCase()}
                  </option>
                ))}
              </select>
            </label>

            <label className="filter-control">
              <span>Sort by</span>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {priceBounds[0] !== priceBounds[1] && (
            <div className="price-filter">
              <div className="price-label">
                <span>Up to {formatPriceINR(priceLimit)}</span>
                <small>
                  Range {formatPriceINR(priceBounds[0])} – {formatPriceINR(priceBounds[1])}
                </small>
              </div>
              <input
                type="range"
                min={priceBounds[0]}
                max={priceBounds[1]}
                value={priceLimit}
                onChange={(e) => setPriceLimit(Number(e.target.value))}
              />
            </div>
          )}
        </div>

        {filteredProducts.length ? (
          <div className="gender-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id || product.name}
                product={product}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
              />
            ))}
          </div>
        ) : (
          <div className="gender-empty-state">
            No looks matched those filters. Try adjusting the palette, size, or price.
          </div>
        )}
      </section>
    </div>
  );
};

export default GenderCollection;
