const express = require('express');
const { ObjectId } = require('mongodb');

const router = express.Router();

// Initialize product routes with database connection
const initializeProductRoutes = (db) => {
  
  // Route to fetch products by category
  router.get('/api/:category', async (req, res) => {
    const category = req.params.category;
    try {
      const products = await db.collection(category).find().toArray();
      res.json(products);
    } catch (err) {
      res.status(500).json({ error: "Error fetching products" });
    }
  });

  // Route to fetch product details by category and ID
  router.get('/api/:category/:productId', async (req, res) => {
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

  // Route for shirts with material filtering
  router.get('/api/shirts', async (req, res) => {
    const { material } = req.query;
    try {
      let query = {};
      if (material) {
        query = { material: material };
      }
      const shirts = await db.collection("shirts").find(query).toArray();
      res.json(shirts);
    } catch (err) {
      res.status(500).json({ error: "Error fetching shirts" });
    }
  });

  // Route for T-shirts with material filtering
  router.get('/api/tshirts', async (req, res) => {
    const { material } = req.query;
    
    try {
      const tshirts = await db.collection("tshirts").find({ material }).toArray();
      res.json(tshirts);
    } catch (err) {
      res.status(500).json({ error: "Error fetching T-shirts" });
    }
  });

  // Route for T-shirts with advanced filtering and sorting
  router.get('/tshirts', async (req, res) => {
    try {
        const { sort, minPrice, maxPrice, size, color, newArrival } = req.query;
        let filter = {};

        // Price Range Filter
        if (minPrice && maxPrice) {
            filter.price = { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) };
        }

        // Size Filter (checks if the size exists in array)
        if (size) {
            filter.size = size;
        }

        // Color Filter (checks if the color exists in array)
        if (color) {
            filter.color = color;
        }

        // New Arrival Filter
        if (newArrival) {
            filter.newArrival = newArrival === "true";
        }

        // Sorting Logic
        let sortOption = {};
        if (sort === "price_asc") {
            sortOption.price = 1; // Low to High
        } else if (sort === "price_desc") {
            sortOption.price = -1; // High to Low
        } else if (sort === "new_arrivals") {
            sortOption.newArrival = -1; // Show New Arrivals First
        }

        const tshirts = await db.collection("tshirts").find(filter).sort(sortOption).toArray();
        res.json(tshirts);
    } catch (err) {
        res.status(500).json({ error: "Error fetching T-shirts data" });
    }
  });

  // Route for category-based filtering and sorting
  router.get('/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const { sort, minPrice, maxPrice, size, color, newArrival } = req.query;

        // Ensure category is valid
        const validCategories = ['men', 'women', 'tshirts', 'trousers', 'shirts'];
        if (!validCategories.includes(category)) {
            return res.status(400).json({ error: "Invalid category" });
        }

        let filter = {};

        // Price Range Filter
        if (minPrice && maxPrice) {
            filter.price = { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) };
        }

        // Size Filter (checks if size exists in array)
        if (size) {
            filter.size = size;
        }

        // Color Filter (checks if color exists in array)
        if (color) {
            filter.color = color;
        }

        // New Arrival Filter
        if (newArrival) {
            filter.newArrival = newArrival === "true";
        }

        // Sorting Logic
        let sortOption = {};
        if (sort === "price_asc") {
            sortOption.price = 1; // Low to High
        } else if (sort === "price_desc") {
            sortOption.price = -1; // High to Low
        } else if (sort === "new_arrivals") {
            sortOption.newArrival = -1; // Show New Arrivals First
        }

        const collection = db.collection(category);
        const products = await collection.find(filter).sort(sortOption).toArray();

        res.json(products);
    } catch (err) {
        res.status(500).json({ error: "Error fetching products" });
    }
  });

  return router;
};

module.exports = initializeProductRoutes;