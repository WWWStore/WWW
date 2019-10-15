'use strict';

const User = require('../auth/users-model');

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
    return User.deleteOne({_id: id})
      .then(result => {
        return result.deletedCount === 1;
      });
  }
}


module.exports= Users;