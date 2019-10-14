'use strict';

const User = require('./users-schema.js');

class Users {
  get(id) {
    if(id) {
      return User.findOne({_id: id});
    }
  }
}