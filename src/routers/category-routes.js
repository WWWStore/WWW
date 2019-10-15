const express = require('express');
const router = express.Router();

const Categories = require('../models/categories/categories');
const categories = new Categories();

router.get('/', getHome);
router.get('/categories/:name', getCategory);
router.post('/categories/:name', postCategory);
router.put('/categories/:name', putCategory);

// ROUTE HANDLER FUNCTIONS

function getHome(request,response,next) {
  categories.get()
    .then(data => {
      const output = {
        count: data.length,
        results: data,
      };
      response.status(200).json(output);
    })
    .catch(next);
}

function getCategory(request,response,next) {
  categories.get(request.params.id)
    .then(result => response.status(200).json(result))
    .catch(next);
}

function postCategory(request,response,next) {
  categories.create(request.body)
    .then(result => {
      response.status(200).json(result);
    } )
    .catch( next );
}

function putCategory(request,response,next) {
  categories.update(request.params.id, request.body)
    .then(result => response.status(200).json(result))
    .catch(next);
}

module.exports = router;