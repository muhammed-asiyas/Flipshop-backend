const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mern-ecom';

const products = [
  { name: 'Classic Tee', description: 'Comfortable cotton t-shirt', price: 25, brand: 'BrandA', category: 'T-Shirts', sizes: ['S','M','L'], colors: ['white','black'], images: [], countInStock: 50 },
  { name: 'Denim Jeans', description: 'Slim fit jeans', price: 60, brand: 'BrandB', category: 'Jeans', sizes: ['M','L','XL'], colors: ['blue'], images: [], countInStock: 30 },
  { name: 'Hoodie', description: 'Warm hoodie', price: 40, brand: 'BrandC', category: 'Sweatshirts', sizes: ['S','M','L','XL'], colors: ['grey','black'], images: [], countInStock: 20 }
];

const seed = async () => {
  await mongoose.connect(MONGO_URI);
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log('Seeded products');
  process.exit();
};

seed();
