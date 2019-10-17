'use strict';

const jwt = require('jsonwebtoken');
const server = require('../../src/server').server;
const supergoose = require('../supergoose');
const mockRequest = supergoose(server);

let user = {username: 'Andy', wagon: [], role: 'marshal', password: 'password'};
let category = {name: 'Boots', description: 'Cowboy boots, winter boots, rain boots, fluffy boots, big boots, small boots.', slug: 'boots'};
let product = {name: 'Western Style Cowboy Boots', price: 4, description: 'Your average, every day, normal cowboy needs boots. Available in tan or brown.', categories: ['boots', 'shoes', 'clothes'], image_url: 'google.com', keywords: ['boots', 'cowboy', 'tan', 'brown']};

describe('error handling tests', () => {
  it('should return 404 for a nonexisting page', () => {
    return mockRequest
      .get('/404')
      .expect(404)
      .then(res => {
        expect(res.status).toBe(404);
      });
  });

  it('should return 500 for a faulty server-side issue', () => {
    return mockRequest
      .get('/500')
      .expect(500)
      .then(res => {
        expect(res.status).toBe(500);
      });
  });
});

describe('Auth Router', () => {

  let id;
  let encodedToken;

  it('can create a new user', () => {
    return mockRequest
      .post('/signup')
      .send(user)
      .expect(200)
      .then(results => {
        let token = jwt.decode(results.text);
        id = token.id;
        encodedToken = results.text;
        expect(token.id).toBeDefined();
        expect(token.role).toBeDefined();
      });
  });

  it('can signin with basic', () => {
    return mockRequest.get('/signin')
      .auth(user.username, user.password)
      .expect(200)
      .then(results => {
        let token = jwt.decode(results.text);
        expect(token.id).toEqual(id);
      });
  });

  it('can signin with bearer', () => {
    return mockRequest.get('/signin')
      .set('Authorization', `Bearer ${encodedToken}`)
      .expect(200)
      .then(results => {
        let token = jwt.decode(results.text);
        expect(token.id).toEqual(id);
      });
  });
});

describe('category router tests', () => {
  it('can create a category', () => {
    return mockRequest.post('/categories')
      .send(category)
      .expect(200)
      .then(res => {
        expect(res.body).toHaveProperty('name', 'Boots');
        expect(res.body).toHaveProperty('slug', 'boots');
        expect(res.body).toHaveProperty('description', 'Cowboy boots, winter boots, rain boots, fluffy boots, big boots, small boots.');
      });
  });

  it('can get a category based on name', () => {
    return mockRequest.get('/categories/boots')
      .expect(200)
      .then(res => {
        expect(res.body).toHaveProperty('slug', 'boots');
      });
  });
});

describe('products router tests', () => {
  let id = null;
  it('can create a product', () => {
    return mockRequest.post('/products')
      .send(product)
      .expect(200)
      .then(res => {
        expect(res.body).toHaveProperty('name', 'Western Style Cowboy Boots');
        expect(res.body).toHaveProperty('price', 4);
        expect(res.body).toHaveProperty('description', 'Your average, every day, normal cowboy needs boots. Available in tan or brown.');
        expect(res.body.categories).toEqual(['boots', 'shoes', 'clothes']);
        expect(res.body).toHaveProperty('image_url', 'google.com');
        expect(res.body.keywords).toEqual(['boots', 'cowboy', 'tan', 'brown']);

        id = res.body._id;
      });
  });

  it('can get all products', () => {
    return mockRequest.post('/products')
      .send(product)
      .expect(200)
      .then(() => {
        return mockRequest.get('/products')
          .expect(200)
          .then(res => {
            expect(res.body.results[0]).toHaveProperty('name', 'Western Style Cowboy Boots');
            expect(res.body.results.length).toBe(2);
          });
      });
  });

  it('can get one product by id', () => {
    expect(id).toBeDefined();
    return mockRequest.get(`/products/${id}`)
      .expect(200)
      .then(res => {
        expect(res.body).toHaveProperty('name', 'Western Style Cowboy Boots');
      });
  });

  it('can update one product by id', () => {
    expect(id).toBeDefined();
    return mockRequest.get(`/products/${id}`)
      .expect(200)
      .then(res => {
        expect(res.body).toHaveProperty('name', 'Western Style Cowboy Boots');
      })
      .then(() => {
        return mockRequest.put(`/products/${id}`)
          .send({name: 'Tan Cowboy Boots'})
          .expect(200)
          .then(res => {
            expect(res.body).toHaveProperty('name', 'Tan Cowboy Boots');
            expect(res.body).toHaveProperty('price', 4);
          });
      });
  });

  it('can delete one product by id', () => {
    expect(id).toBeDefined();
    return mockRequest.delete(`/products/${id}`)
      .expect(200)
      .then(() => {
        return mockRequest.get('/products')
          .expect(200)
          .then(res => {
            expect(res.body.results.length).toBe(1);
          });
      })
      .then(() => {
        return mockRequest.get(`/products/${id}`)
          .expect(200)
          .then(res => {
            expect(res.body).toBe(null);
          });
      });
  });
});

describe('wagon methods test', () => {
  let productId;
  it('can add an item to wagon', () => {
    return mockRequest.post('/products')
      .send(product)
      .expect(200)
      .then(res => {
        productId = res.body._id;
        return mockRequest.post(`/products/${productId}/save`)
          .auth(user.username, user.password)
          .send({ quantity: 2 })
          .expect(200)
          .then(res => {
            expect(res.body.length).toBe(1);
            expect(res.body[0]).toHaveProperty('productId', productId);
            expect(res.body[0]).toHaveProperty('quantity', 2);
          });
      });
  });

  it('can get all products from the wagon', () => {
    return mockRequest.get(`/wagon`)
      .auth(user.username, user.password)
      .expect(200)
      .then(res => {
        expect(res.body).toEqual([
          { productId, quantity: 2 },
        ]);
      });
  });

  it('can update a product quantity in the user\'s wagon', () => {
    expect(productId).toBeDefined();
    return mockRequest.put(`/wagon/${productId}`)
      .auth(user.username, user.password)
      .send({quantity: 4})
      .expect(200)
      .then(res => {
        expect(res.body.length).toBe(1);
        expect(res.body[0]).toHaveProperty('productId', productId);
        expect(res.body[0]).toHaveProperty('quantity', 4);

        return mockRequest.get('/wagon')
          .auth(user.username, user.password)
          .expect(200)
          .expect([
            { productId: productId, quantity: 4 },
          ]);
      });
  });

  it('can delete a product from the user\'s wagon', () => {
    return mockRequest.get(`/wagon`)
      .auth(user.username, user.password)
      .expect(200)
      .then(res => {
        expect(res.body).toEqual([
          { productId, quantity: 4 },
        ]);
      })
      .then(() => {
        return mockRequest.delete(`/wagon/${productId}`)
          .auth(user.username, user.password)
          .expect(200)
          .then(res => {
            expect(res.body.length).toBe(1);
            expect(res.body[0]).toHaveProperty('productId', productId);
            expect(res.body[0]).toHaveProperty('quantity', 0);
            
            return mockRequest.get('/wagon')
              .auth(user.username, user.password)
              .expect(200)
              .expect([
                { productId: productId, quantity: 0 },
              ]);
          });
      });
  });
});
