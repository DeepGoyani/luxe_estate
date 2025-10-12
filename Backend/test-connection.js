const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://deepgoyani77_Deep:1234@luxeestate.ge896bz.mongodb.net/";
const client = new MongoClient(uri);

async function testConnection() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB successfully!");
    
    const db = client.db("LandingPage");
    const collections = await db.listCollections().toArray();
    
    console.log("📊 Available collections:");
    collections.forEach(collection => {
      console.log(`  - ${collection.name}`);
    });
    
    // Test each collection
    const collectionNames = ['men', 'women', 'tshirts', 'shirts', 'trousers'];
    
    for (const collectionName of collectionNames) {
      try {
        const collection = db.collection(collectionName);
        const count = await collection.countDocuments();
        console.log(`📦 ${collectionName}: ${count} documents`);
      } catch (err) {
        console.log(`❌ ${collectionName}: Collection not found or empty`);
      }
    }
    
  } catch (error) {
    console.error("❌ Connection failed:", error.message);
  } finally {
    await client.close();
    console.log("🔌 Connection closed");
  }
}

testConnection();
