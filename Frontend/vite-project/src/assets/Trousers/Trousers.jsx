import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../../components/ProductCard/ProductCard';
import { useCurrency } from '../../context/CurrencyContext.jsx';
import '../Collection/CollectionGallery.css';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const HERO_IMAGE =
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1400&q=80';

const formatListPreview = (value, fallback = 'Tailored Fit') => {
  if (Array.isArray(value) && value.length) {
    const preview = value.slice(0, 3).join(' • ');
    return value.length > 3 ? `${preview} +` : preview;
  }
  return value || fallback;
};

export default function Trousers() {
  const navigate = useNavigate();
  const [selectedMaterial, setSelectedMaterial] = useState('All fabrics');
  const [allProducts, setAllProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const { formatPriceINR } = useCurrency();

  const handleAddToCart = (productId, quantity = 1) => {
    const product = allProducts.find(p => p._id === productId);
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
    const fetchTrousers = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`${API_URL}/trousers`);
        const data = Array.isArray(res.data) ? res.data : [];
        setAllProducts(data);
        setDisplayedProducts(data);
      } catch (e) {
        setError('Failed to load trousers.');
      } finally {
        setLoading(false);
      }
    };
    fetchTrousers();
  }, []);

  useEffect(() => {
    if (selectedMaterial === 'All fabrics') {
      setDisplayedProducts(allProducts);
    } else {
      setDisplayedProducts(
        allProducts.filter(
          (product) => product.material?.toLowerCase() === selectedMaterial.toLowerCase()
        )
      );
    }
  }, [selectedMaterial, allProducts]);

  const materials = useMemo(() => {
    const unique = new Set();
    allProducts.forEach((product) => {
      if (product.material) {
        unique.add(product.material.trim());
      }
    });
    return ['All fabrics', ...Array.from(unique).sort((a, b) => a.localeCompare(b))];
  }, [allProducts]);

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
    <div className="collection-page trousers-collection">
      <section
        className="collection-hero"
        style={{ "--hero-image": `url(${HERO_IMAGE})` }}
      >
        <div className="collection-hero-content">
          <span className="collection-eyebrow">Precision Tailoring</span>
          <h1 className="collection-title">Trousers Maison</h1>
          <p className="collection-subtitle">
            Architectural lines and fluid drapes imagined in suiting wool, linen blends, and structured cotton.
          </p>
        </div>
      </section>

      <section className="collection-content">
        <div className="filter-toolbar">
          {materials.map((material) => (
            <button
              key={material}
              onClick={() => setSelectedMaterial(material)}
              className={`filter-chip ${selectedMaterial === material ? 'active' : ''}`}
            >
              {material}
            </button>
          ))}
        </div>

        {displayedProducts.length ? (
          <div className="collection-grid">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product._id || product.name}
                product={product}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">No trousers found at the moment.</div>
        )}
      </section>
    </div>
  );
}
