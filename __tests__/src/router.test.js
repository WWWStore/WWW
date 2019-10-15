'use strict';

const router = require('../../src/auth/router');

const jwt = require('jsonwebtoken');
const server = require('../../src/server').server;
const supergoose = require('../supergoose');
const mockRequest = supergoose(server);

let user = {username: 'Andy', wagon: [], role: 'marshal', password: 'password'};

describe('main router tests', () => {
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
