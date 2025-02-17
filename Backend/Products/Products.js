const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
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

    // Route to add item to cart (with full product details)
    app.post('/api/cart', async (req, res) => {
      const { productId, quantity } = req.body;
      const cartCollection = db.collection('cart');

      try {
        // Fetch full product details
        const product = await db.collection("products").findOne({ _id: new ObjectId(productId) });

        if (!product) {
          return res.status(404).json({ error: "Product not found" });
        }

        const existingItem = await cartCollection.findOne({ productId });

        if (existingItem) {
          await cartCollection.updateOne({ productId }, { $inc: { quantity: quantity } });
        } else {
          const cartItem = {
            productId,
            quantity,
            name: product.name,
            image: product.image,
            price: product.price,
            rating: product.rating
          };
          await cartCollection.insertOne(cartItem);
        }

        res.json({ message: "Item added to cart successfully" });
      } catch (err) {
        res.status(500).json({ error: "Error adding item to cart" });
      }
    });

    // Route to get cart items
    app.get('/api/cart', async (req, res) => {
      try {
        const cartItems = await db.collection('cart').find().toArray();
        res.json({ items: cartItems });
      } catch {
        res.status(500).json({ error: "Error fetching cart items" });
      }
    });

    // Route to delete item from cart
    app.delete('/api/cart/:itemId', async (req, res) => {
      const itemId = req.params.itemId;
      try {
        await db.collection('cart').deleteOne({ productId: itemId });
        res.json({ message: "Item removed from cart successfully" });
      } catch (err) {
        res.status(500).json({ error: "Error removing item from cart" });
      }
    });

    // Route to update quantity in cart
    app.patch('/api/cart/:itemId', async (req, res) => {
      const itemId = req.params.itemId;
      const { quantity } = req.body;
      try {
        await db.collection('cart').updateOne({ productId: itemId }, { $set: { quantity } });
        res.json({ message: "Quantity updated successfully" });
      } catch (err) {
        res.status(500).json({ error: "Error updating quantity" });
      }
    });

    // Route to fetch product details by category and ID
    app.get('/api/:category/:productId', async (req, res) => {
      const { category, productId } = req.params;
      try {
        const product = await db.collection(category).findOne({ _id: new ObjectId(productId) });
        if (!product) {
          return res.status(404).json({ error: "Product not found" });
        }
        res.json(product);
      } catch (err) {
        res.status(500).json({ error: "Error fetching product" });
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