'use strict';

const mongoose = require('mongoose');

let categories = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
});

module.exports = mongoose.model('categories', categories);
