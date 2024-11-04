const garmentController = require('../../controllers/garmentController');
const garmentService = require('../../services/garmentService');

jest.mock('../../services/garmentService');

describe('Garment Controller', () => {
  let mockRequest;
  let mockResponse;
  let mockNext;

  beforeEach(() => {
    mockRequest = {
      query: { query: 'test' },
      app: {
        locals: {
          db: {}
        }
      }
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  it('should return garments when given a valid query', async () => {
    const mockGarments = [{ id: '1', title: 'Test Garment' }];
    garmentService.searchGarmentsService.mockResolvedValue(mockGarments);

    await garmentController.searchGarments(mockRequest, mockResponse, mockNext);

    expect(garmentService.searchGarmentsService).toHaveBeenCalledWith('test', mockRequest.app.locals.db);
    expect(mockResponse.json).toHaveBeenCalledWith(mockGarments);
  });

  it('should return 400 error when query is missing', async () => {
    mockRequest.query = {};

    await garmentController.searchGarments(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Search query is required' });
  });

  it('should return 500 error when service throws an error', async () => {
    garmentService.searchGarmentsService.mockRejectedValue(new Error('Database error'));

    await garmentController.searchGarments(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'An error occurred while searching for garments' });
  });
});
