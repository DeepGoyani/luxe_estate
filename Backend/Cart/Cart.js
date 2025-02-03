const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
app.use(express.json());
app.use(cors());

const MONGO_URI = "mongodb+srv://deepgoyani77:1234@cluster0.u6fyq.mongodb.net/";
const DB_NAME = "Luxe_Estate";
const client = new MongoClient(MONGO_URI);
let db;

const connectDB = async () => {
    try {
        await client.connect();
        db = client.db(DB_NAME);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB Connection Failed:", error);
        process.exit(1);
    }
};

connectDB();

// **Add product to cart**
app.post("/cart/add", async (req, res) => {
    try {
        const { productId, name, price, quantity, image } = req.body;
        const existingItem = await db.collection("cart").findOne({ productId });

        if (existingItem) {
            await db.collection("cart").updateOne(
                { productId },
                { $inc: { quantity: quantity } }
            );
            return res.json({ message: "Quantity updated in cart" });
        }

        const newItem = { productId, name, price, quantity, image };
        await db.collection("cart").insertOne(newItem);
        res.status(201).json({ message: "Product added to cart" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// **Get all cart items**
app.get("/cart", async (req, res) => {
    try {
        const cartItems = await db.collection("cart").find().toArray();
        res.json(cartItems);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// **Update cart item quantity**
app.put("/cart/update/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;
        const result = await db.collection("cart").updateOne(
            { _id: new ObjectId(id) },
            { $set: { quantity } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Item not found in cart" });
        }
        res.json({ message: "Cart item updated" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// **Remove an item from cart**
app.delete("/cart/remove/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.collection("cart").deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Item not found in cart" });
        }
        res.json({ message: "Item removed from cart" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// **Clear cart**
app.delete("/cart/clear", async (req, res) => {
    try {
        await db.collection("cart").deleteMany({});
        res.json({ message: "Cart cleared" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
