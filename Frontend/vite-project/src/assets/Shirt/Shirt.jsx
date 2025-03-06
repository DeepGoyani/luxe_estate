import  { useState, useEffect } from 'react';
import axios from 'axios';
import './Shirt.css'; // Ensure this file exists for styling

const ShirtsCollection = () => {
  const [shirts, setShirts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShirts = async () => {
     try {
       const response = await axios.get('/api/shirts');
       setShirts(response.data);
       setLoading(false);
       setError(null);
     } catch (err) {
       // Log error to console or a monitoring service
       console.error('Error fetching shirts:', err);
       setLoading(false);
       setError(err.message || 'Failed to load shirts');
     }
   };

    fetchShirts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="shirts-collection">
      <h1>Shirts Collection</h1>
      <div className="filter-section">
        {/* Add filters if needed */}
      </div>
      <div className="products-grid">
        {shirts.map(shirt => (
          <div key={shirt._id} className="product-card">
            <img src={shirt.image} alt={shirt.name} />
            <h3>{shirt.name}</h3>
            <p>${shirt.price}</p>
            <p>Rating: {shirt.rating}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShirtsCollection;