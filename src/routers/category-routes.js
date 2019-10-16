const express = require('express');
const router = express.Router();

const Categories = require('../models/categories-model');
const categories = new Categories();

router.get('/', getHome);
router.get('/categories/:slug', getCategory);
router.post('/categories', postCategory);

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

/**
 * Get a single category by given slug (name of category without spaces or special characters)
 * @route GET /categories/{slug}
 * @group Categories - Operations for manipulating categories
 * @param {string} slug.path.required
 */
function getCategory(req,res,next) {
  categories.getBySlug(req.params.slug)
    .then(result => res.status(200).json(result))
    .catch(next);
}

/**
 * @typedef Category
 * @property {string} name.required
 * @property {string} description.required
 * @property {string} slug.required
 */
/**
 * Creates a single category, given a name, description, and a slug (name of category without spaces or special characters)
 * @route POST /categories
 * @group Categories
 * @param {Category.model} category.body.required
 */
function postCategory(req,res,next) {
  categories.create(req.body)
    .then(result => {
      res.status(200).json(result);
    } )
    .catch( next );
}

module.exports = router;