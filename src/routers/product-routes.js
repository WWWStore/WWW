const express = require('express');
const router = express.Router();

const Products = require('../models/products-model');
const products = new Products();

router.get('/products', getAllProducts);
router.get('/products/:id', getProduct);
router.post('/products', postProduct);
router.put('/products/:id', putProduct);
router.delete('/products/:id', deleteProducts);

function getAllProducts(request,response,next) {
  products.get()
    .then( data => {
      const output = {
        count: data.length,
        results: data,
      };
      response.status(200).json(output);
    })
    .catch( next );
}

function getProduct(request,response,next) {
  products.get(request.params.id)
    .then( result => response.status(200).json(result) )
    .catch( next );
}

function postProduct(request,response,next) {
  products.post(request.body)
    .then( result => response.status(200).json(result) )
    .catch( next );
}

function putProduct(request,response,next) {
  products.put(request.params.id, request.body)
    .then( result => response.status(200).json(result) )
    .catch( next );
}

function deleteProducts(request,response,next) {
  products.delete(request.params.id)
    .then( result => response.status(200).json(result) )
    .catch( next );
}

module.exports = router;