'use strict';

const mongoose = require('mongoose');

let users = mongoose.Schema({
  username: { type: String, required: true },
  wagon: { type: Array, required: false },
  role: { type: String, required: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model('users', users);
