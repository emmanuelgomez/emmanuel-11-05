var express = require('express');
var router = express.Router();
const { getDb } = require('../db');  // Make sure this path is correct

router.get('/search', async function(req, res, next) {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const db = getDb();
    const collection = db.collection('garments');
    const searchRegex = new RegExp(query, 'i');
    
    const garments = await collection.find({
      $or: [
        { product_title: searchRegex },
        { product_description: searchRegex },
        { brand: searchRegex },
        { product_categories: searchRegex },
        { gender: searchRegex }
      ]
    }).project({
      product_title: 1,
      brand: 1,
      product_description: 1,
      price: 1,
      discount: 1,
      currency_code: 1,
      gender: 1,
      product_categories: 1,
      images: { $slice: 1 }
    }).limit(20).toArray();

    const formattedGarments = garments.map(garment => ({
      id: garment._id,
      title: garment.product_title,
      brand: garment.brand,
      description: garment.product_description,
      price: garment.price,
      discountedPrice: garment.price * (1 - garment.discount),
      currency: garment.currency_code,
      gender: garment.gender,
      categories: garment.product_categories,
      imageUrl: garment.images && garment.images[0] ? garment.images[0].s3_url_resized : null
    }));

    res.json(formattedGarments);
  } catch (error) {
    console.error('Error searching garments:', error);
    res.status(500).json({ error: 'An error occurred while searching for garments' });
  }
});

module.exports = router;
