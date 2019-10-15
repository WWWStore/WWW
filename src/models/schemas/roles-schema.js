'use strict';

const mongoose = require('mongoose');

let roles = mongoose.Schema({
  name: { type: String, required: true },
  capabilities: { type: Array, required: true },
});

module.exports = mongoose.model('roles', roles);
