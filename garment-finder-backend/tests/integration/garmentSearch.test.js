const request = require('supertest');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../app');
let mongod;
let con;
let db;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  con = await MongoClient.connect(uri, {});
  db = con.db();

  app.locals.db = db;

  await db.collection('garments').insertMany([
    {
      product_title: 'Blue Jeans',
      brand: 'Levis',
      product_description: 'Classic blue jeans',
      price: 59.99,
      discount: 0.1,
      currency_code: 'USD',
      gender: 'Unisex',
      product_categories: ['Jeans', 'Casual'],
      images: [{ s3_url_resized: 'http://example.com/blue-jeans.jpg' }]
    },
    {
      product_title: 'Red T-Shirt',
      brand: 'Nike',
      product_description: 'Comfortable red t-shirt',
      price: 24.99,
      discount: 0,
      currency_code: 'USD',
      gender: 'Unisex',
      product_categories: ['T-Shirts', 'Casual'],
      images: [{ s3_url_resized: 'http://example.com/red-tshirt.jpg' }]
    }
  ]);
});

afterAll(async () => {
  if (con) {
    await con.close();
  }
  if (mongod) {
    await mongod.stop();
  }
});

describe('Garment Search API', () => {
  it('should return matching garments when given a valid query', async () => {
    const response = await request(app)
      .get('/garments/search')
      .query({ query: 'Blue' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toMatchObject({
      title: 'Blue Jeans',
      brand: 'Levis',
      description: 'Classic blue jeans',
      price: 59.99,
      discountedPrice: 53.991,
      currency: 'USD',
      gender: 'Unisex',
      categories: ['Jeans', 'Casual'],
      imageUrl: 'http://example.com/blue-jeans.jpg'
    });
  });

  it('should return multiple matching garments', async () => {
    const response = await request(app)
      .get('/garments/search')
      .query({ query: 'Casual' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });

  it('should return an empty array when no matches are found', async () => {
    const response = await request(app)
      .get('/garments/search')
      .query({ query: 'Nonexistent' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(0);
  });

  it('should return a 400 error when query is missing', async () => {
    const response = await request(app)
      .get('/garments/search');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Search query is required' });
  });
});
