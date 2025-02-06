const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://deepgoyani77:1234@cluster0.u6fyq.mongodb.net/";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function main() {
  try {
    await client.connect();
    console.log("Connected to MongoDB successfully");
    const db = client.db("LandingPage");

    // Middleware to validate email
    const validateEmail = (email) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(String(email));
    };

    // Middleware to validate product data
    const validateProductData = (data) => {
      return data.productId && typeof data.productId === 'string' &&
             data.quantity && typeof data.quantity === 'number' && data.quantity > 0;
    };

    // Route to fetch products by category
    app.get('/api/:category', async (req, res) => {
      const category = req.params.category;
      try {
        const products = await db.collection(category).find().toArray();
        res.json(products);
      } catch (err) {
        res.status(500).json({ error: "Error fetching products" });
      }
    });

    // Route for newsletter subscription
    app.post('/api/subscribers', async (req, res) => {
      const { email } = req.body;
      if (!email || !validateEmail(email)) {
        return res.status(400).json({ error: "Invalid email address" });
      }
      try {
        await db.collection('subscribers').insertOne({ email });
        res.json({ message: "Subscribed successfully" });
      } catch (err) {
        res.status(500).json({ error: "Error subscribing" });
      }
    });

    // Route to manage cart
    app.post('/api/cart', async (req, res) => {
      const { productId, quantity } = req.body;
      if (!validateProductData(req.body)) {
        return res.status(400).json({ error: "Invalid product ID or quantity" });
      }
      try {
        await db.collection('cart').insertOne({ productId, quantity });
        res.json({ message: "Item added to cart successfully" });
      } catch (err) {
        res.status(500).json({ error: "Error adding item to cart" });
      }
    });

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error(err.stack);
    process.exit(1);
  }
}

main().catch(console.dir);