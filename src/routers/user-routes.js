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
  User.get(req.user._id)
    .then(user => {
      return user.populateWagon();
    })
    .then(saved => {
      res.send(saved.wagon);
    });
}

/**
 * Updates the quantity of a given product in a wagon.
 * @route PUT /wagon/{productId}
 * @group Wagon
 * @param {Wagon.model} wagon.body.required
 * @param {string} productId.path
 * @security [{"JWT": []},{"basicAuth": []}]
 */
function updateCart(req, res, next) {
  return updateQuantity(req, req.body.quantity)
    .then(user => {
      return user.populateWagon();
    })
    .then(saved => {
      res.send(saved.wagon);
    });
}

/**
 * Takes the quantity of a given product in your wagon and sets it to 0, to simulate deletion.
 * @route DELETE /wagon/{productId}
 * @group Wagon
 * @param {string} productId.path
 */
function deleteFromCart(req, res, next) {
  return updateQuantity(req, 0)
    .then(user => {
      return user.populateWagon();
    })
    .then(saved => {
      res.send(saved.wagon);
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