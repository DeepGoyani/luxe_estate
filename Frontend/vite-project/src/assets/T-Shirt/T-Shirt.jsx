import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./T-Shirt.css";
import "../Collection/CollectionGallery.css";
import { useCurrency } from "../../context/CurrencyContext";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1400&q=80";
const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
const CATEGORY_SLUG = "tshirts";

const formatListPreview = (value) => {
  if (Array.isArray(value) && value.length) {
    const preview = value.slice(0, 3).join(" • ");
    return value.length > 3 ? `${preview} +` : preview;
  }
  return value || "XS-XXL";
};

export default function TshirtCollection() {
  const materials = ["Cashmere", "Merino Wool", "Alpaca Wool", "Linen"];
  const [tshirtData, setTshirtData] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(materials[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { formatPriceINR } = useCurrency();

  useEffect(() => {
    const fetchTshirts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const { data } = await axios.get(`${API_URL}/tshirts`, {
          params: { material: selectedMaterial },
        });
        setTshirtData(Array.isArray(data) ? data : []);
      } catch (fetchError) {
        console.error("Error fetching T-shirts:", fetchError);
        setError("Unable to load luxury T-shirt inventory.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTshirts();
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
    <div className="collection-page tshirt-collection">
      <section
        className="collection-hero"
        style={{ "--hero-image": `url(${HERO_IMAGE})` }}
      >
        <div className="collection-hero-content">
          <span className="collection-eyebrow">Luxe Estate</span>
          <h1 className="collection-title">Curated T-Shirt Atelier</h1>
          <p className="collection-subtitle">
            Breathable silhouettes and couture finishes crafted in premium cotton, silk
            blends, and elevated knits.
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

        {tshirtData.length ? (
          <div className="collection-grid">
            {tshirtData.map((tshirt) => {
              const detailLink = tshirt._id ? `/product/${CATEGORY_SLUG}/${tshirt._id}` : null;
              const card = (
                <article className="gallery-card">
                  <div className="gallery-media">
                    <img
                      src={tshirt.image || "https://via.placeholder.com/400x500?text=Luxe+Tee"}
                      alt={tshirt.name}
                      loading="lazy"
                    />
                    {(tshirt.newArrival || tshirt.sale) && (
                      <span className="gallery-badge">{tshirt.newArrival ? "New" : "Sale"}</span>
                    )}
                  </div>

                  <div className="gallery-info">
                    <div className="gallery-pill-row">
                      <span className="gallery-pill">{tshirt.material || selectedMaterial}</span>
                      <span className="gallery-pill">Tailored</span>
                    </div>
                    <h3 className="gallery-name">{tshirt.name}</h3>
                    {tshirt.description && (
                      <p className="gallery-description">{tshirt.description}</p>
                    )}

                    <div className="gallery-price-row">
                      <span className="gallery-price">{formatPriceINR(tshirt.price)}</span>
                      {tshirt.originalPrice && tshirt.originalPrice > tshirt.price && (
                        <span className="gallery-original">{formatPriceINR(tshirt.originalPrice)}</span>
                      )}
                    </div>

                    <div className="gallery-meta">
                      <span>★ {tshirt.rating || 4.8}</span>
                      <span>{formatListPreview(tshirt.size)}</span>
                    </div>
                  </div>
                </article>
              );

              return detailLink ? (
                <Link key={tshirt._id} to={detailLink} className="gallery-card-link">
                  {card}
                </Link>
              ) : (
                <div key={tshirt.name} className="gallery-card-link">
                  {card}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            No {selectedMaterial.toLowerCase()} T-shirts available right now.
          </div>
        )}
      </section>
    </div>
  );
}