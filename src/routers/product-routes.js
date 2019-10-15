const express = require('express');
const router = express.Router();

const Products = require('../models/products-model');
const products = new Products();

const Users = require('../models/users-model');
const users = new Users();

router.get('/products', getAllProducts);
router.get('/products/:id', getProduct);
router.post('/products', postProduct);
router.put('/products/:id', putProduct);
router.delete('/products/:id', deleteProducts);
router.post('/products/:id/save', addToCart);

function addToCart(req, res, next) {
  let currentWagon = users.get(req.userId).wagon;
  console.log(currentWagon);
  let update = {
    wagon: currentWagon.push({
      productId: req.body.productId,
      quantity: req.body.quantity,
    }),
  };
  res.send(users.update(req.userId, update));
}

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

function getProduct(req,res,next) {
  products.get(req.params.id)
    .then(result => res.status(200).json(result))
    .catch(next);
}

function postProduct(req,res,next) {
  products.create(req.body)
    .then(result => res.status(200).json(result))
    .catch(next);
}

function putProduct(req,res,next) {
  products.update(req.params.id, req.body)
    .then(result => res.status(200).json(result))
    .catch(next);
}

function deleteProducts(req,res,next) {
  products.delete(req.params.id)
    .then(result => res.status(200).json(result))
    .catch(next);
}

module.exports = router;