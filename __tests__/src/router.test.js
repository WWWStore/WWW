'use strict';

const router = require('../../src/routers/router');

const server = require('../../src/server').server;
const supergoose = require('../supergoose');
const mockRequest = supergoose(server);

describe('main router tests', () => {
  it('should return 404 for a nonexisting page', () => {
    return mockRequest
      .get('/404')
      .expect(404)
      .then(res => {
        expect(res.status).toBe(404);
      });
  });

  it('should return 500 for a faulty serverside issue', () => {
    return mockRequest
      .get('/500')
      .expect(500)
      .then(res => {
        expect(res.status).toBe(500);
      });
  });
});

describe('User functionality tests', () => {
  it('can create a new user', () => {
    let user = new User({name: 'admin', role: 'admin', capabilities: ['create', 'read', 'update']});
    return mockRequest.post('/signup')
      .send(user)
      .expect(201)
      .then(result => {
        var token = jwt.decode(result.text);
        id = token.id;
        expect(token.id).toBeDefined();
        expect(token.capabilities).toEqual(['create','read','update']);
      })
  })
})
