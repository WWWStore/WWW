'use strict';

const jwt = require('jsonwebtoken');
const server = require('../../src/server').server;
const supergoose = require('../supergoose');
const mockRequest = supergoose(server);

let user = {username: 'Andy', wagon: [], role: 'marshal', password: 'password'};
let category = {name: 'Boots', description: 'Cowboy boots, winter boots, rain boots, fluffy boots, big boots, small boots.', slug: 'boots'};

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
        console.log(token);
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

describe('category and product router tests', () => {
  it('can post a category', () => {
    return mockRequest.post('/categories/boots')
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
        console.log(res.body);
        expect(res.body).toHaveProperty('slug', 'boots');
      });
  });
});