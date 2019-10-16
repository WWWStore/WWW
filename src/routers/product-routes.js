const express = require('express');
const router = express.Router();

const auth = require('../auth/middleware');

const Products = require('../models/products-model');
const products = new Products();

const Users = require('../models/users-model');
const users = new Users();

router.get('/products', getAllProducts);
router.get('/products/:id', getProduct);
router.post('/products', postProduct);
router.put('/products/:id', putProduct);
router.delete('/products/:id', deleteProducts);
router.post('/products/:id/save', auth(), addToCart);

/**
 * @typedef Wagon
 * @property {integer} quantity.required
 */
/**
 * Takes in a user ID and product object - including an ID and a quantity - adding that product to your personal cart.
 * @route POST /products/{id}/save
 * @group Wagon - Operations for the user's wagon
 * @param {Wagon.model} wagon.body.required
 * @param {string} id.path.required
 * @security basicAuth
 */
function addToCart(req, res, next) {
  console.log(req.user);
  let update = {
    $push: {
      wagon: {
        productId: req.params.id,
        quantity: req.body.quantity,
      },
    },
  };
  users.update(req.user._id, update)
    .then(saved => {
      res.send(saved.wagon);
    })
    .catch(next);
}

/**
 * Gets all products from the database, returning them to the client.
 * @route GET /products 
 * @group Products - Operations for products
 */
function getAllProducts(req,res,next) {
  products.get()
    .then(data => {
      const output = {
        count: data.length,
        results: data,
      };
      res.status(200).json(output);
    })
    .catch(next);
}

/**
 * Gets one product from the database given an ID, returning the product details to the client.
 * @route GET /products/{id}
 * @param {string} id.path
 * @group Products - Operations for products
 */
function getProduct(req,res,next) {
  products.get(req.params.id)
    .then(result => res.status(200).json(result))
    .catch(next);
}

/**
 * @typedef Product
 * @property {string} name.required
 * @property {string} description.required
 * @property {number} price.required
 * @property {array.<string>} categories.required
 * @property {string} image_url.required
 * @property {array.<string>} keywords
 */
/**
 * Creates one product and saves it to the database.
 * @route POST /products
 * @group Products - Operations for products
 * @param {Product.model} product.body.required
 */
function postProduct(req,res,next) {
  products.create(req.body)
    .then(result => res.status(200).json(result))
    .catch(next);
}

/**
 * Updates one product based on given parameters and saves the updates to the database.
 * @route PUT /products/{id}
 * @group Products - Operations for products
 * @param {string} id.path
 * @param {Product.model} product.body.required
 */
function putProduct(req,res,next) {
  products.update(req.params.id, req.body)
    .then(result => res.status(200).json(result))
    .catch(next);
}

/**
 * Deletes one product from the database given an ID.
 * @route DELETE /products/{id}
 * @group Products - Operations for products
 * @param {string} id.path
 */
function deleteProducts(req,res,next) {
  products.delete(req.params.id)
    .then(result => res.status(200).json(result))
    .catch(next);
}

module.exports = router;