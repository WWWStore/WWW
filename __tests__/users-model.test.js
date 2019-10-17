'use strict';

const User = require('../src/models/users-model');

require('./supergoose');

describe('users model tests', () => {
  it('can create a user', async () => {
    let user = {
      username: 'Andy',
      wagon: [],
      role: 'marshal',
      password: 'password',
    };
    let record = await User.create(user);
    expect(record).toHaveProperty('_id');
    expect(record).toHaveProperty('username', 'Andy');
    expect(record).toHaveProperty('role', 'marshal');
    expect(record).toHaveProperty('password');
    expect(record.password).not.toBe(user.password);
  });
  it('can update() an existing user', async () => {
    let user = {
      username: 'Andy2',
      wagon: [],
      role: 'marshal',
      password: 'password',
    };
    let record = await User.create(user);
    let updatedUser = await User.update( record._id, { username: 'AndyToo' });
    let userObject = updatedUser.toObject();
    //let saved = await users.get(record._id);

    expect(userObject).toHaveProperty('username', 'AndyToo');
  });
  it('can delete() an existing user', async () => {
    let user = {
      username: 'Andy3',
      wagon: [],
      role: 'marshal',
      password: 'password',
    };
    let record = await User.create(user);
    let deletedRecord = await User.delete(record._id);
    expect(deletedRecord).toBe(true);
  });
});
