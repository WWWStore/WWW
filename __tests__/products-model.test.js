'use strict';

const Products = require('../src/models/products-model');
const products = new Products();

require('./supergoose.js');

let product = {
  name: 'Colt Model 1851 Revolver',
  description: '6-shot percussion revolver',
  image_url: 'image_url',
  categories: ['guns'],
  price: 50.00,
  keywords: ['colt', 'revolver', 'gun'],
};

describe('Testing products model', () => {
  it('Can create a new product', async () => {
    let record = await products.create(product);

    expect(record).toHaveProperty('_id');
    expect(record).toHaveProperty('name', 'Colt Model 1851 Revolver');

    let saved = await products.get(record._id);
    expect(saved).toHaveProperty('price', 50.00);
    expect(saved.categories.toObject()).toEqual(['guns']);
  });
  it('Can get a single product by id', async () => {
    let record = await products.create(product);

    let saved = await products.get(record._id);
    expect(saved).toHaveProperty('image_url', 'image_url');
  });
  it('Can get all products', async () => {
    let record = await products.create(product);

    await products.delete(record._id);
  });
});