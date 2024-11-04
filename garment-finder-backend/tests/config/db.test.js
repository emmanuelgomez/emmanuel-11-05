const { MongoMemoryServer } = require('mongodb-memory-server');
const { connectToDatabase, getDb, setDb, closeConnection } = require('../../config/db');

let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
});

afterAll(async () => {
  await closeConnection();
  await mongod.stop();
});

describe('Database module', () => {
  afterEach(async () => {
    await closeConnection();
  });

  describe('connectToDatabase', () => {
    it('should connect to the database successfully', async () => {
      const uri = await mongod.getUri();
      const db = await connectToDatabase(uri);
      expect(db).toBeDefined();
      expect(typeof db).toBe('object');
    });
  });

  describe('getDb', () => {
    it('should return the database instance if it exists', async () => {
      const uri = await mongod.getUri();
      await connectToDatabase(uri);
      const retrievedDb = getDb();
      expect(retrievedDb).toBeDefined();
    });

    it('should throw an error if database is not initialized', async () => {
      await closeConnection();
      expect(() => getDb()).toThrow('Database not initialized. Call connectToDatabase first.');
    });
  });

  describe('setDb', () => {
    it('should set the database instance', () => {
      const mockDb = { collection: jest.fn() };
      setDb(mockDb);
      expect(getDb()).toBe(mockDb);
    });
  });
});
