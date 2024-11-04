const request = require('supertest');
const express = require('express');
const garmentRoutes = require('../../routes/garmentRoutes');
const garmentController = require('../../controllers/garmentController');

jest.mock('../../controllers/garmentController');

describe('Garment Routes', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.locals.db = {};
    app.use('/garments', garmentRoutes);
  });

  it('GET /garments/search should call searchGarments controller', async () => {
    const mockResponse = [{ id: '1', title: 'Test Garment' }];
    garmentController.searchGarments.mockImplementation((req, res) => {
      res.json(mockResponse);
    });

    const response = await request(app).get('/garments/search?query=test');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResponse);
    expect(garmentController.searchGarments).toHaveBeenCalled();
  });
});
