const { MongoClient } = require('mongodb');

let db;
let client;

const connectToDatabase = async (uri = process.env.MONGODB_URI) => {
  try {
    client = await MongoClient.connect(uri);
    console.log('Connected to MongoDB');
    db = client.db();
    return db;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

const getDb = () => {
  if (!db) {
    throw new Error('Database not initialized. Call connectToDatabase first.');
  }
  return db;
};

const setDb = (database) => {
  db = database;
};

const closeConnection = async () => {
  if (client) {
    await client.close();
    db = null;
    client = null;
  }
};

module.exports = { connectToDatabase, getDb, setDb, closeConnection };
