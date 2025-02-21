import { useEffect, useState } from "react";
import "./T-Shirt.css";
import HeaderNavbar from "../../HeaderNavbar";
import Footer from "../../Footer";

export default function TshirtCollection() {
  const materials = ["Cashmere", "Merino Wool", "Alpaca Wool", "Linen"];
  const [tshirtData, setTshirtData] = useState({});

  useEffect(() => {
    const fetchTshirts = async () => {
      try {
        const fetchedData = {};
        for (const material of materials) {
          const response = await fetch(`http://localhost:5000/api/tshirts?material=${encodeURIComponent(material)}`);
          const data = await response.json();
          fetchedData[material] = data; // Store fetched data by material category
        }
        setTshirtData(fetchedData);
      } catch (error) {
        console.error("Error fetching T-shirts:", error);
      }
    };

    fetchTshirts();
  }, []);

  return (
    <div className="app">
      <HeaderNavbar />

      {/* Main Content */}
      <main className="main-content">
        <h2 className="collection-title">T-Shirt Collection</h2>

        {/* Product Sections */}
        {materials.map((material) => (
          <section key={material} className="product-section">
            <h3 className="material-title">{material} Material</h3>
            <div className="product-grid">
              {tshirtData[material] ? (
                tshirtData[material].map((tshirt, index) => (
                  <div key={index} className="product-card">
                    <img src={tshirt.imageUrl} alt={tshirt.name} className="product-image" />
                    <div className="product-tag">{tshirt.newArrival ? "NEW" : "TRENDING"}</div>
                    <p className="product-name">{tshirt.name}</p>
                    <p className="product-price">${tshirt.price}</p>
                  </div>
                ))
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </section>
        ))}
      </main>

      <Footer />
    </div>
  );
}
