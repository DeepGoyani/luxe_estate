const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['https://luxe-estate-theta.vercel.app', 'http://localhost:5173', '*'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// MongoDB connection
const uri = "mongodb+srv://deepgoyani77_Deep:1234@luxeestate.ge896bz.mongodb.net/";
const client = new MongoClient(uri);

async function main() {
  try {
    await client.connect();
    console.log("Connected to MongoDB successfully");
    const db = client.db("LandingPage");

    // Root route for health check
    app.get('/', (req, res) => {
      res.json({ 
        status: 'OK', 
        message: 'Luxe Estate Backend API is running',
        timestamp: new Date().toISOString()
      });
    });

    // Health check route
    app.get('/api/health', (req, res) => {
      res.json({ 
        status: 'OK', 
        message: 'Luxe Estate API is running',
        timestamp: new Date().toISOString()
      });
    });

    // Simple test route
    app.get('/api/test', (req, res) => {
      res.json({ 
        status: 'OK', 
        message: 'API is working',
        timestamp: new Date().toISOString()
      });
    });

    // Route to fetch conversion rates
    app.get('/api/conversion-rates', async (req, res) => {
      try {
        const axios = require('axios');
        const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
        res.json(response.data.rates);
      } catch (err) {
        res.status(500).json({ error: "Error fetching conversion rates" });
      }
    });

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log('Available routes:');
      console.log('- Health: /api/health');
      console.log('- Test: /api/test');
      console.log('- Conversion rates: /api/conversion-rates');
    });

  } catch (err) {
    console.error(err.stack);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down server...');
  await client.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nShutting down server...');
  await client.close();
  process.exit(0);
});

main().catch(console.dir);
