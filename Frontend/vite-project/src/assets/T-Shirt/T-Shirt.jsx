import { useEffect, useState } from "react";
import "./T-Shirt.css";
import HeaderNavbar from "../../HeaderNavbar";
import Footer from "../../Footer";

export default function TshirtCollection() {
  const materials = ["Cashmere", "Merino Wool", "Alpaca Wool", "Linen"];
  const [tshirtData, setTshirtData] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(materials[0]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTshirts = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/tshirts?material=${encodeURIComponent(selectedMaterial)}`);
        const data = await response.json();
        setTshirtData(data);
      } catch (error) {
        console.error("Error fetching T-shirts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTshirts();
  }, [selectedMaterial]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app">
      <HeaderNavbar />

      {/* Main Content */}
      <main className="main-content">
        <h2 className="collection-title">T-Shirt Collection</h2>

        {/* Material Filter */}
        <div className="material-filter">
          {materials.map((material) => (
            <button
              key={material}
              onClick={() => setSelectedMaterial(material)}
              className={selectedMaterial === material ? "active" : ""}
            >
              {material}
            </button>
          ))}
        </div>

        {/* Product Sections */}
        <section className="product-section">
          <h3 className="material-title">{selectedMaterial} Material</h3>
          <div className="product-grid">
            {Array.isArray(tshirtData) && tshirtData.length > 0 ? (
              tshirtData.map((tshirt, index) => (
                <div key={index} className="product-card">
                  <img src={tshirt.image} alt={tshirt.name} className="product-image" />
                  <div className="product-tag">{tshirt.newArrival ? "NEW" : "TRENDING"}</div>
                  <p className="product-name">{tshirt.name}</p>
                  <p className="product-price">${tshirt.price}</p>
                </div>
              ))
            ) : (
              <p>No products found.</p>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}