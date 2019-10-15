'use strict';

const express = require('express');
const router = express.Router();

const Users = require('../models/users-model');
const users = new Users();

router.post('/products/:id/:username', addProduct);

function addProduct(req,res,next) {
  let currentWagon = users.get(req.userId).wagon;
  let changes = {
    productId: req.body.productId,
    quantity: req.body.quantity,
  };
  users.put(req.userId, changes)

}