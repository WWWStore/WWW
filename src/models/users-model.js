'use strict';

const User = require('./schemas/users-schema.js');

class Users {
  get(id) {
    if(id) {
      return User.findOne({_id: id});
    } else {
      return User.find();
    }
  }
  
  create(obj) {
    let newUser = new User(obj);
    return newUser.save();
  }

  update(id, obj) {
    return User.findByIdAndUpdate(id, obj, {new: true});
  }

  delete(id) {
    return User.deleteOne({_id: id}), function (err) {
      if(err) return err;
    };
  }
}


module.exports= Users;