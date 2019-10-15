'use strict';

const mongoose = require('mongoose');

let categories = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
  slug: { type: String, required: true, unique: true },
});

module.exports = mongoose.model('categories', categories);
