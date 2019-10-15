'use strict';

const Users = require('../src/models/users-model');
const users = new Users();

require('./supergoose');

describe('users model test', () => {
  it('can create a user', async () => {
    let user = {
      username: 'Andy',
      wagon: [],
      role: 'marshal',
      password: 'password',
    };
    let record = await users.create(user);
    expect(record).toHaveProperty('_id');
    expect(record).toHaveProperty('username', 'Andy');
    expect(record).toHaveProperty('role', 'marshal');
    expect(record).toHaveProperty('password', 'password');
  });
  it('can update a user', async () => {
    
  });
});
