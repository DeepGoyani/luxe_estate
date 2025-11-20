const express = require('express');
const { ObjectId } = require('mongodb');

const router = express.Router();

// Initialize product routes with database connection
const initializeProductRoutes = (db) => {
  const buildFilters = (query = {}) => {
    const {
      material,
      minPrice,
      maxPrice,
      size,
      color,
      newArrival,
      collection,
      search
    } = query;

    const clauses = [];

    if (material) clauses.push({ material });

    if (collection) {
      clauses.push({
        $or: [
          { collection },
          { collectionType: collection },
          { category: collection },
          { tier: collection }
        ]
      });
    }

    if (minPrice || maxPrice) {
      const priceClause = {};
      if (minPrice) priceClause.$gte = parseInt(minPrice, 10);
      if (maxPrice) priceClause.$lte = parseInt(maxPrice, 10);
      clauses.push({ price: priceClause });
    }

    if (size) {
      clauses.push({
        $or: [
          { size },
          { sizeRange: size },
          { sizes: size },
          { size: { $elemMatch: { $eq: size } } },
          { sizeRange: { $elemMatch: { $eq: size } } },
          { sizes: { $elemMatch: { $eq: size } } }
        ]
      });
    }

    if (color) {
      clauses.push({
        $or: [
          { color },
          { colors: color },
          { color: { $elemMatch: { $eq: color } } },
          { colors: { $elemMatch: { $eq: color } } }
        ]
      });
    }

    if (typeof newArrival !== 'undefined') {
      clauses.push({ newArrival: newArrival === 'true' });
    }

    if (search) {
      clauses.push({ name: { $regex: search, $options: 'i' } });
    }

    if (!clauses.length) return {};
    return clauses.length === 1 ? clauses[0] : { $and: clauses };
  };

  const buildSort = (sortKey) => {
    switch (sortKey) {
      case 'price_asc':
        return { price: 1 };
      case 'price_desc':
        return { price: -1 };
      case 'new_arrivals':
        return { newArrival: -1 };
      default:
        return {};
    }
  };

  const fetchCollection = async (collectionName, query) => {
    const filter = buildFilters(query);
    const sort = buildSort(query?.sort);
    return db.collection(collectionName).find(filter).sort(sort).toArray();
  };

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
    try {
      const shirts = await fetchCollection('shirts', req.query);
      res.json(shirts);
    } catch (err) {
      res.status(500).json({ error: "Error fetching shirts" });
    }
  });

  // Route for T-shirts with material filtering
  router.get('/api/tshirts', async (req, res) => {
    try {
      const tshirts = await fetchCollection('tshirts', req.query);
      res.json(tshirts);
    } catch (err) {
      res.status(500).json({ error: "Error fetching T-shirts" });
    }
  });

  // Exclusive collection route
  router.get('/api/exclusive', async (req, res) => {
    try {
      const exclusiveProducts = await fetchCollection('exclusive', req.query);
      res.json(exclusiveProducts);
    } catch (err) {
      res.status(500).json({ error: "Error fetching exclusive products" });
    }
  });

  // Route to fetch products by category with shared filters
  router.get('/api/:category', async (req, res) => {
    const { category } = req.params;
    const validCategories = ['men', 'women', 'tshirts', 'trousers', 'shirts', 'exclusive'];

    if (!validCategories.includes(category)) {
      return res.status(400).json({ error: "Invalid category" });
    }

    try {
      const products = await fetchCollection(category, req.query);
      res.json(products);
    } catch (err) {
      res.status(500).json({ error: "Error fetching products" });
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