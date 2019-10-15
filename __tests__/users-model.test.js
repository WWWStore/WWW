'use strict';

const Users = require('../src/models/users-model');
const users = new Users();

require('./supergoose');

describe('users model tests', () => {
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
  it('can update() an existing user', async () => {
    let user = {
      username: 'Andy',
      wagon: [],
      role: 'marshal',
      password: 'password',
    };
    let record = await users.create(user);
    let updatedUser = await users.update( record._id, { wagon: ['cowboy hat'] });
    let userObject = updatedUser.toObject();
    //let saved = await users.get(record._id);

    expect(userObject).toHaveProperty('wagon', ['cowboy hat']);
  });
  it('can delete() an existing user', async () => {
    let user = {
      username: 'Andy',
      wagon: [],
      role: 'marshal',
      password: 'password',
    };
    let record = await users.create(user);
    let deletedRecord = await users.delete(record._id);
    expect(deletedRecord).toBe(true);
  });
});
