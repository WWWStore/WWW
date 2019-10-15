const express = require('express');
const router = express.Router();

const Categories = require('../models/categories-model');
const categories = new Categories();

router.get('/', getHome);
router.get('/categories/:name', getCategory);
router.post('/categories/:name', postCategory);

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
  categories.post(request.body)
    .then(result => {
      response.status(200).json(result);
    } )
    .catch( next );
}

module.exports = router;