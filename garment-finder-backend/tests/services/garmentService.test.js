const { searchGarmentsService } = require('../../services/garmentService');

describe('Garment Service', () => {
  let mockDb;
  let mockCollection;

  beforeEach(() => {
    mockCollection = {
      find: jest.fn().mockReturnThis(),
      project: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      toArray: jest.fn()
    };

    mockDb = {
      collection: jest.fn().mockReturnValue(mockCollection)
    };
  });

  it('should return formatted garments', async () => {
    const mockGarments = [
      {
        _id: '1',
        product_title: 'Test Garment',
        brand: 'Test Brand',
        product_description: 'Test Description',
        price: 100,
        discount: 0.1,
        currency_code: 'USD',
        gender: 'Unisex',
        product_categories: ['Test Category'],
        images: [{ s3_url_resized: 'http://test-image.jpg' }]
      }
    ];

    mockCollection.toArray.mockResolvedValue(mockGarments);

    const result = await searchGarmentsService('test', mockDb);

    expect(result).toEqual([
      {
        id: '1',
        title: 'Test Garment',
        brand: 'Test Brand',
        description: 'Test Description',
        price: 100,
        discountedPrice: 90,
        currency: 'USD',
        gender: 'Unisex',
        categories: ['Test Category'],
        imageUrl: 'http://test-image.jpg'
      }
    ]);

    expect(mockDb.collection).toHaveBeenCalledWith('garments');
    expect(mockCollection.find).toHaveBeenCalledWith({
      $or: expect.arrayContaining([
        { product_title: expect.any(RegExp) },
        { product_description: expect.any(RegExp) },
        { brand: expect.any(RegExp) },
        { product_categories: expect.any(RegExp) },
        { gender: expect.any(RegExp) }
      ])
    });

    expect(mockCollection.project).toHaveBeenCalled();
    expect(mockCollection.limit).toHaveBeenCalledWith(20);
  });
});
