const express = require('express');
const router = express.Router();

const Products = require('../models/products/products');
const products = new Products();

router.get('/', getProducts);
router.post('/', postProducts);
router.get('/:id', getProduct);
router.put('/:id', putProducts);
router.delete('/:id', deleteProducts);

function getProducts(request,response,next) {
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

function postProducts(request,response,next) {
  products.create(request.body)
    .then( result => response.status(200).json(result) )
    .catch( next );
}

function putProducts(request,response,next) {
  products.update(request.params.id, request.body)
    .then( result => response.status(200).json(result) )
    .catch( next );
}

function deleteProducts(request,response,next) {
  products.delete(request.params.id)
    .then( result => response.status(200).json(result) )
    .catch( next );
}

module.exports = router;