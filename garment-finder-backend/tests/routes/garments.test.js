const request = require('supertest');
const express = require('express');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

const garmentsRouter = require('../../routes/garments');
const { connectToDatabase, setDb, getDb } = require('../../db');

let app;
let mongod;
let client;

beforeAll(async () => {
  // Set up MongoDB Memory Server
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  // Connect to the in-memory database
  client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  const db = client.db();
  setDb(db);
  
  // Set up the Express app
  app = express();
  app.use('/garments', garmentsRouter);
});

afterAll(async () => {
  await client.close();
  await mongod.stop();
});

beforeEach(async () => {
  // Clear the database before each test
  const db = getDb();
  await db.collection('garments').deleteMany({});
});

describe('GET /garments/search', () => {
  it('should return 400 if query is missing', async () => {
    const response = await request(app).get('/garments/search');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Search query is required' });
  });

  it('should return matching garments', async () => {
    const db = getDb();
    // Insert test data
    await db.collection('garments').insertMany([
      {
        product_title: 'Blue T-shirt',
        brand: 'TestBrand',
        product_description: 'A comfortable blue t-shirt',
        price: 20,
        discount: 0.1,
        currency_code: 'USD',
        gender: 'men',
        product_categories: ['T-shirts'],
        images: [{ s3_url_resized: 'http://example.com/image1.jpg' }]
      },
      {
        product_title: 'Red Dress',
        brand: 'AnotherBrand',
        product_description: 'A beautiful red dress',
        price: 50,
        discount: 0.2,
        currency_code: 'EUR',
        gender: 'women',
        product_categories: ['Dresses'],
        images: [{ s3_url_resized: 'http://example.com/image2.jpg' }]
      }
    ]);

    const response = await request(app).get('/garments/search?query=blue');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toMatchObject({
      title: 'Blue T-shirt',
      brand: 'TestBrand',
      description: 'A comfortable blue t-shirt',
      price: 20,
      discountedPrice: 18,
      currency: 'USD',
      gender: 'men',
      categories: ['T-shirts'],
      imageUrl: 'http://example.com/image1.jpg'
    });
  });

  it('should return an empty array if no matches found', async () => {
    const response = await request(app).get('/garments/search?query=nonexistent');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should search across multiple fields', async () => {
    const db = getDb();
    await db.collection('garments').insertMany([
      {
        product_title: 'Blue T-shirt',
        brand: 'TestBrand',
        product_description: 'A comfortable t-shirt',
        price: 20,
        discount: 0.1,
        currency_code: 'USD',
        gender: 'men',
        product_categories: ['T-shirts'],
        images: [{ s3_url_resized: 'http://example.com/image1.jpg' }]
      },
      {
        product_title: 'Red Dress',
        brand: 'AnotherBrand',
        product_description: 'A beautiful dress in blue color',
        price: 50,
        discount: 0.2,
        currency_code: 'EUR',
        gender: 'women',
        product_categories: ['Dresses'],
        images: [{ s3_url_resized: 'http://example.com/image2.jpg' }]
      }
    ]);

    const response = await request(app).get('/garments/search?query=blue');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });

  it('should handle case-insensitive search', async () => {
    const db = getDb();
    await db.collection('garments').insertOne({
      product_title: 'Blue T-shirt',
      brand: 'TestBrand',
      product_description: 'A comfortable t-shirt',
      price: 20,
      discount: 0.1,
      currency_code: 'USD',
      gender: 'men',
      product_categories: ['T-shirts'],
      images: [{ s3_url_resized: 'http://example.com/image1.jpg' }]
    });

    const response = await request(app).get('/garments/search?query=BLUE');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].title).toBe('Blue T-shirt');
  });
});
