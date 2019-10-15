const express = require('express');
const router = express.Router();

const Categories = require('../models/categories-model');
const categories = new Categories();

router.get('/', getHome);
router.get('/categories/:slug', getCategory);
router.post('/categories/:name', postCategory);

// ROUTE HANDLER FUNCTIONS

function getHome(req,res,next) {
  categories.get()
    .then(data => {
      const output = {
        count: data.length,
        results: data,
      };
      res.status(200).json(output);
    })
    .catch(next);
}

function getCategory(req,res,next) {
  categories.getBySlug(req.params.slug)
    .then(result => res.status(200).json(result))
    .catch(next);
}

function postCategory(req,res,next) {
  categories.create(req.body)
    .then(result => {
      res.status(200).json(result);
    } )
    .catch( next );
}

module.exports = router;