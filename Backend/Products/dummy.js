// const express = require("express");
// const cors = require("cors");
// const { MongoClient, ObjectId } = require("mongodb"); // Correct import of ObjectId

// const app = express();
// app.use(express.json());
// app.use(cors());

// const MONGO_URI = "mongodb+srv://deepgoyani77:1234@cluster0.u6fyq.mongodb.net/"; 
// const DB_NAME = "Luxe_Estate";
// const client = new MongoClient(MONGO_URI);
// let db;

// // Function to connect to MongoDB
// const connectDB = async () => {
//     try {
//         await client.connect();
//         db = client.db(DB_NAME);
//         console.log("✅ Connected to MongoDB");
//     } catch (error) {
//         console.error("❌ MongoDB Connection Failed:", error);
//         process.exit(1);
//     }
// };
// // Connect to MongoDB
// connectDB();

// /**
//  * ➕ Add a new product
//  */
// app.post("/products/add", async (req, res) => {
//     try {
//         const result = await db.collection("products").insertOne(req.body);
//         res.status(201).json({ message: "✅ Product added", product: result });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// /**
//  * 📄 Get all products
//  */
// app.get("/products", async (req, res) => {
//     try {
//         const products = await db.collection("products").find().toArray();
//         res.json(products);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// /**
//  * ✏️ Update a product (Full Update)
//  */
// app.put("/products/:id", async (req, res) => {
//     try {
//         const { id } = req.params;
//         if (!ObjectId.isValid(id)) {
//             return res.status(400).json({ message: "❌ Invalid Product ID format" });
//         }

//         const updatedProduct = req.body;
//         const result = await db.collection("products").updateOne(
//             { _id: new ObjectId(id) }, 
//             { $set: updatedProduct }
//         );

//         if (result.matchedCount === 0) {
//             return res.status(404).json({ message: "❌ Product not found" });
//         }

//         res.json({ message: "✅ Product updated", product: updatedProduct });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// /**
//  * 🔄 Update a product (Partial Update)
//  */
// app.patch("/products/:id", async (req, res) => {
//     try {
//         const { id } = req.params;
//         if (!ObjectId.isValid(id)) {
//             return res.status(400).json({ message: "❌ Invalid Product ID format" });
//         }

//         const updatedFields = req.body;
//         const result = await db.collection("products").updateOne(
//             { _id: new ObjectId(id) },
//             { $set: updatedFields }
//         );

//         if (result.matchedCount === 0) {
//             return res.status(404).json({ message: "❌ Product not found" });
//         }

//         res.json({ message: "✅ Product updated", product: updatedFields });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// /**
//  * ❌ Delete a product
//  */
// app.delete("/products/:id", async (req, res) => {
//     try {
//         const { id } = req.params;
//         if (!ObjectId.isValid(id)) {
//             return res.status(400).json({ message: "❌ Invalid Product ID format" });
//         }

//         const result = await db.collection("products").deleteOne({ _id: new ObjectId(id) });

//         if (result.deletedCount === 0) {
//             return res.status(404).json({ message: "❌ Product not found" });
//         }

//         res.json({ message: "✅ Product deleted" });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // Start the server
// const PORT = 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));