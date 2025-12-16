import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCurrency } from '../../context/CurrencyContext.jsx';
import '../Collection/CollectionGallery.css';
import './Exclusive.css';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1400&q=80';
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const CATEGORY_SLUG = 'exclusive';

const formatListPreview = (value, fallback = 'Tailored Fit') => {
  if (Array.isArray(value) && value.length) {
    const preview = value.slice(0, 3).join(' • ');
    return value.length > 3 ? `${preview} +` : preview;
  }
  return value || fallback;
};

const ExclusiveProducts = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { formatPriceINR } = useCurrency();

  const filters = [
    { id: 'all', label: 'All Collections' },
    { id: 'exclusive', label: 'Exclusive Edition' },
    { id: 'limited', label: 'Limited Series' },
    { id: 'premium', label: 'Premium Selection' }
  ];

  useEffect(() => {
    const fetchExclusive = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await axios.get(`${API_URL}/exclusive`);
        const normalized = Array.isArray(data)
          ? data.map(item => ({
              ...item,
              collectionTag: item.collection || 'Exclusive Edition'
            }))
          : [];
        setAllProducts(normalized);
        setDisplayedProducts(normalized);
      } catch (err) {
        console.error('Error fetching exclusive products:', err);
        setError('Unable to load exclusive inventory.');
      } finally {
        setLoading(false);
      }
    };

    fetchExclusive();
  }, []);

  useEffect(() => {
    if (selectedFilter === 'all') {
      setDisplayedProducts(allProducts);
    } else {
      setDisplayedProducts(
        allProducts.filter(
          (product) => product.collectionTag?.toLowerCase().includes(selectedFilter)
        )
      );
    }
  }, [selectedFilter, allProducts]);

  if (loading) {
    return (
      <div className="page-loader">
        <div className="luxe-ring">
          <div className="luxe-initials">LE</div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="empty-state">{error}</div>;
  }

  return (
    <div className="collection-page exclusive-collection">
      <HeaderNavbar/>
      <section
        className="collection-hero"
        style={{ "--hero-image": `url(${HERO_IMAGE})` }}
      >
        <div className="collection-hero-content">
          <span className="collection-eyebrow">Limited Maison</span>
          <h1 className="collection-title">The Exclusive Salon</h1>
          <p className="collection-subtitle">
            Couture capsules, numbered editions, and atelier signatures reserved for the Luxe Estate inner circle.
          </p>
        </div>
      </section>

      <section className="collection-content">
        <div className="filter-toolbar">
          {filters.map(filter => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`filter-chip ${selectedFilter === filter.id ? 'active' : ''}`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {displayedProducts.length ? (
          <div className="collection-grid">
            {displayedProducts.map((product) => {
              const detailLink = product._id ? `/product/${CATEGORY_SLUG}/${product._id}` : null;
              const card = (
                <article className="gallery-card">
                  <div className="gallery-media">
                    <img
                      src={product.image || 'https://via.placeholder.com/400x500?text=Luxe+Exclusive'}
                      alt={product.name}
                      loading="lazy"
                    />
                    {(product.newArrival || product.sale) && (
                      <span className="gallery-badge">{product.newArrival ? 'New' : 'Sale'}</span>
                    )}
                  </div>

                  <div className="gallery-info">
                    <div className="gallery-pill-row">
                      <span className="gallery-pill">{product.material || 'Maison Atelier'}</span>
                      <span className="gallery-pill">{product.collectionTag || 'Exclusive Edition'}</span>
                    </div>
                    <h3 className="gallery-name">{product.name}</h3>
                    {product.description && (
                      <p className="gallery-description">{product.description}</p>
                    )}

                    <div className="gallery-price-row">
                      <span className="gallery-price">{formatPriceINR(product.price)}</span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="gallery-original">{formatPriceINR(product.originalPrice)}</span>
                      )}
                    </div>

                    <div className="gallery-meta">
                      <span>★ {product.rating || 4.9}</span>
                      <span>{formatListPreview(product.size)}</span>
                    </div>
                  </div>
                </article>
              );

              return detailLink ? (
                <Link key={product._id} to={detailLink} className="gallery-card-link">
                  {card}
                </Link>
              ) : (
                <div key={product._id || product.name} className="gallery-card-link">
                  {card}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">No looks available in this capsule.</div>
        )}
      </section>
      <Footer/>
    </div>
  );
};

export default ExclusiveProducts;