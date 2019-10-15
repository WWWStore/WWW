const express = require('express');
const router = express.Router();

const Categories = require('../models/categories/categories');
const categories = new Categories();

router.get('/', getCategories);
router.post('/', postCategories);
router.get('/:id', getCategory);
router.put('/:id', putCategories);
router.delete('/:id', deleteCategories);

// ROUTE HANDLER FUNCTIONS

function getCategories(request,response,next) {
  categories.get()
    .then( data => {
      const output = {
        count: data.length,
        results: data,
      };
      response.status(200).json(output);
    })
    .catch( next );
}

function getCategory(request,response,next) {
  categories.get(request.params.id)
    .then( result => response.status(200).json(result) )
    .catch( next );
}

function postCategories(request,response,next) {
  categories.create(request.body)
    .then( result => {
      response.status(200).json(result);
    } )
    .catch( next );
}

function putCategories(request,response,next) {
  categories.update(request.params.id, request.body)
    .then( result => response.status(200).json(result) )
    .catch( next );
}

function deleteCategories(request,response,next) {
  categories.delete(request.params.id)
    .then( result => response.status(200).json(result) )
    .catch( next );
}

module.exports = router;