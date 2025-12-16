const Product = require('../models/Product');

// GET /api/products?search=&category=&brand=&minPrice=&maxPrice=&sort=&page=&limit=
exports.getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      sort = '-createdAt',
      page = 1,
      limit = 12,
      price
    } = req.query;

    const query = {};
    if (search) query.name = { $regex: search, $options: 'i' };
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (price) query.price = price;
    if (minPrice || maxPrice) query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);

    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find(query).sort(sort).skip(skip).limit(Number(limit));
    const total = await Product.countDocuments(query);

    res.json({ products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};