import "./Shirt.css";
import HeaderNavbar from "../../HeaderNavbar";
import Footer from "../../Footer";
import { useEffect, useState } from "react";

export default function ShirtCollection() {
  const materials = ["Cotton", "Silk", "Linen", "Flannel"];
  const [products, setProducts] = useState({});

  useEffect(() => {
    materials.forEach((material) => {
      fetch(`http://localhost:5000/api/products/shirts?material=${material}`)
        .then((res) => res.json())
        .then((data) => setProducts((prev) => ({ ...prev, [material]: data })))
        .catch((err) => console.error("Error fetching data:", err));
    });
  }, []);

  return (
    <div className="app">
      <HeaderNavbar />
      <main className="main-content">
        <h2 className="collection-title">Shirt Collection</h2>
        {materials.map((material) => (
          <section key={material} className="product-section">
            <h3 className="material-title">{material} Material</h3>
            <div className="product-grid">
              {products[material]?.map((product, index) => (
                <div key={index} className="product-card">
                  <img src={product.image} alt={product.name} className="product-image" />
                  <div className="product-tag">NEW</div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>
      <Footer />
    </div>
  );
}
