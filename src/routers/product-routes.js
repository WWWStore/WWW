const express = require('express');
const router = express.Router();

const Products = require('../models/products-model');
const products = new Products();

router.get('/products', getAllProducts);
router.get('/products/:id', getProduct);
router.post('/products', postProduct);
router.put('/products/:id', putProduct);
router.delete('/products/:id', deleteProducts);

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