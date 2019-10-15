'use strict';

const mongoose = require('mongoose');

let products = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image_url: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  keywords: { type: Array, required: false },
});

module.exports = mongoose.model('products', products);
