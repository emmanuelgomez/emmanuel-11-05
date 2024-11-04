
const searchGarmentsService = async (query, db) => {
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

  return garments.map(formatGarment);
};

const formatGarment = (garment) => ({
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
});

module.exports = {
  searchGarmentsService
};
