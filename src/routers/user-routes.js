'use strict';

const express = require('express');
const router = express.Router();

const auth = require('../auth/middleware');

const User = require('../models/users-model');

router.get('/wagon', auth(), getCart);
router.put('/wagon/:productId', auth(), updateCart);
router.delete('/wagon/:productId', auth(), deleteFromCart);

/**
 * Gets all products in a users wagon given a user is logged in.
 * @route GET /wagon
 * @group Wagon
 * @security [{"JWT": []},{"basicAuth": []}]
 */
function getCart(req, res, next) {
  res.send(req.user.wagon);
}

function updateCart(req, res, next) {
  return updateQuantity(req, req.body.quantity)
    .then(user => {
      res.send(user.wagon);
    });
}

function deleteFromCart(req, res, next) {
  return updateQuantity(req, 0)
    .then(user => {
      res.send(user.wagon);
    });
}

function updateQuantity(req, quantity) {
  let updates = {
    $set: {
      'wagon.$[product].quantity': quantity,
    },
  };
  return User.findByIdAndUpdate(req.user._id, updates, {
    arrayFilters: [{'product.product': {$eq: req.params.productId}}],
    new: true,
  });
}

module.exports = router;