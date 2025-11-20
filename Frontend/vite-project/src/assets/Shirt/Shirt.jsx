import { useEffect, useState } from "react";
import axios from "axios";
import { useCurrency } from "../../context/CurrencyContext.jsx";
import "../Collection/CollectionGallery.css";
import "./Shirt.css";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1400&q=80";
const API_URL = "http://localhost:3000/api";

const formatListPreview = (value, fallback = "Tailored Fit") => {
  if (Array.isArray(value) && value.length) {
    const preview = value.slice(0, 3).join(" • ");
    return value.length > 3 ? `${preview} +` : preview;
  }
  return value || fallback;
};

export default function ShirtCollection() {
  const materials = ["Cotton", "Silk", "Linen", "Flannel"];
  const [shirtData, setShirtData] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(materials[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { formatPriceINR } = useCurrency();

  useEffect(() => {
    const fetchShirts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const { data } = await axios.get(`${API_URL}/shirts`, {
          params: { material: selectedMaterial }
        });
        setShirtData(Array.isArray(data) ? data : []);
      } catch (fetchError) {
        console.error("Error fetching Shirts:", fetchError);
        setError("Unable to load this tailored curation.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchShirts();
  }, [selectedMaterial]);

  if (isLoading) {
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
    <div className="collection-page shirt-collection">
      <section
        className="collection-hero"
        style={{ "--hero-image": `url(${HERO_IMAGE})` }}
      >
        <div className="collection-hero-content">
          <span className="collection-eyebrow">Made to Move</span>
          <h1 className="collection-title">Luxe Shirt Studio</h1>
          <p className="collection-subtitle">
            Bespoke shirting woven in exquisite yarns with heritage craftsmanship and modern ease.
          </p>
        </div>
      </section>

      <section className="collection-content">
        <div className="filter-toolbar">
          {materials.map((material) => (
            <button
              key={material}
              onClick={() => setSelectedMaterial(material)}
              className={`filter-chip ${selectedMaterial === material ? "active" : ""}`}
            >
              {material}
            </button>
          ))}
        </div>

        {shirtData.length ? (
          <div className="collection-grid">
            {shirtData.map((shirt) => (
              <article key={shirt._id || shirt.name} className="gallery-card">
                <div className="gallery-media">
                  <img
                    src={shirt.image || "https://via.placeholder.com/400x500?text=Luxe+Shirt"}
                    alt={shirt.name}
                    loading="lazy"
                  />
                  {(shirt.newArrival || shirt.sale) && (
                    <span className="gallery-badge">{shirt.newArrival ? "New" : "Sale"}</span>
                  )}
                </div>

                <div className="gallery-info">
                  <div className="gallery-pill-row">
                    <span className="gallery-pill">{shirt.material || selectedMaterial}</span>
                    <span className="gallery-pill">{shirt.category || "Signature"}</span>
                  </div>
                  <h3 className="gallery-name">{shirt.name}</h3>
                  {shirt.description && (
                    <p className="gallery-description">{shirt.description}</p>
                  )}

                  <div className="gallery-price-row">
                    <span className="gallery-price">{formatPriceINR(shirt.price)}</span>
                    {shirt.originalPrice && shirt.originalPrice > shirt.price && (
                      <span className="gallery-original">{formatPriceINR(shirt.originalPrice)}</span>
                    )}
                  </div>

                  <div className="gallery-meta">
                    <span>★ {shirt.rating || 4.8}</span>
                    <span>{formatListPreview(shirt.sizeRange, "Tailored Fit")}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            No {selectedMaterial.toLowerCase()} shirts available at the moment.
          </div>
        )}
      </section>

    </div>
  );
}
