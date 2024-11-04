const garmentService = require('../services/garmentService');

const searchGarments = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const garments = await garmentService.searchGarmentsService(query, req.app.locals.db);
    res.json(garments);
  } catch (error) {
    console.error('Error searching garments:', error);
    res.status(500).json({ error: 'An error occurred while searching for garments' });
  }
};

module.exports = {
  searchGarments
};