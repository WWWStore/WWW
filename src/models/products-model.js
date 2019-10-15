'use strict';

const Product = require('./schemas/products-schema');

class Products {
  get(id) {
    if(id) {
      return Product.findOne({_id: id});
    } else {
      return Product.find();
    }
  }
  create(obj) {
    let newProduct = new Product(obj);
    return newProduct.save();
  }
  update(id, obj) {
    return Product.findByIdAndUpdate(id, obj, {new: true});
  }
  delete(id) {
    return Product.deleteOne({_id: id});
  }
}

module.exports = Products;