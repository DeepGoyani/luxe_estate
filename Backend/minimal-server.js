const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Luxe Estate Backend API is running',
    timestamp: new Date().toISOString()
  });
});

// API test route
app.get('/api/test', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API is working',
    timestamp: new Date().toISOString()
  });
});

// Sample products route
app.get('/api/men', (req, res) => {
  res.json([
    {
      _id: "1",
      name: "Sample Men Product",
      category: "men",
      price: 25000,
      image: "https://via.placeholder.com/300x400"
    }
  ]);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
