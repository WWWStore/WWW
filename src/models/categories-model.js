'use strict';

const Category = require('./schemas/categories-schema');

class Categories {
  get(id) {
    if(id) {
      return Category.findOne({ _id: id });
    } else {
      return Category.find();
    }
  }

  getBySlug(slug) {
    return Category.findOne({ slug });
  }

  create(obj) {
    let newRecord = new Category(obj);
    return newRecord.save();
  }
}

module.exports = Categories;