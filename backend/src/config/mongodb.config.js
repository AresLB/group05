const { MongoClient } = require('mongodb');

const mongoConfig = {
  host: process.env.MONGO_HOST || 'localhost',
  port: process.env.MONGO_PORT || 27017,
  user: process.env.MONGO_USER || 'admin',
  password: process.env.MONGO_PASSWORD || 'adminpass',
  database: process.env.MONGO_DB || 'hackathon_nosql'
};

// Create connection URI
const uri = `mongodb://${mongoConfig.user}:${mongoConfig.password}@${mongoConfig.host}:${mongoConfig.port}`;

// Create MongoDB client
const client = new MongoClient(uri, {
  maxPoolSize: 10,
  minPoolSize: 2,
  maxIdleTimeMS: 30000
});

let db = null;

// Connect to MongoDB
async function connect() {
  try {
    await client.connect();
    db = client.db(mongoConfig.database);
    console.log('✅ MongoDB connected successfully');
    return db;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    throw error;
  }
}

// Get database instance
function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call connect() first.');
  }
  return db;
}

// Close connection
async function close() {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Initialize connection
connect().catch(console.error);

module.exports = { connect, getDb, close };
