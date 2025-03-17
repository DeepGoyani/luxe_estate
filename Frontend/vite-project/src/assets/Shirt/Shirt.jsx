import { useEffect, useState } from "react";
import HeaderNavbar from "../../HeaderNavbar";
import Footer from "../../Footer";
import "./Shirt.css";

export default function ShirtCollection() {
  const materials = ["Cotton", "Silk", "Linen", "Flannel"];
  const [shirtData, setShirtData] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(materials[0]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchShirts = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/shirts?material=${encodeURIComponent(selectedMaterial)}`
        );
        const data = await response.json();
        setShirtData(data);
      } catch (error) {
        console.error("Error fetching Shirts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShirts();
  }, [selectedMaterial]);

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="shirt-page">
      <HeaderNavbar />

      <main className="container">
        <h2 className="title">Shirt Collection</h2>

        <div className="material-buttons">
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

        <section>
          <h3 className="material-heading">{selectedMaterial} Material</h3>
          <div className="shirt-grid">
            {Array.isArray(shirtData) && shirtData.length > 0 ? (
              shirtData.map((shirt, index) => (
                <div key={index} className="shirt-card">
                  <img src={shirt.image} alt={shirt.name} className="shirt-image" />
                  <span className="badge">{shirt.newArrival ? "NEW" : "TRENDING"}</span>
                  <p className="shirt-name">{shirt.name}</p>
                  <p className="shirt-price">${shirt.price}</p>
                </div>
              ))
            ) : (
              <p className="no-products">No products found.</p>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
