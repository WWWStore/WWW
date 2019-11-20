const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const user = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  email: {type: String},
  role: {
    type: String,
    required: true,
    default: 'ranger',
    enum: ['marshal', 'sheriff', 'deputy', 'ranger'],
  },
  wagon: [{
    product: { type: mongoose.Types.ObjectId, ref: 'products', required: true },
    quantity: Number,
  }],
});

user.methods.populateWagon = function() {
  return this.populate('wagon.product')
    .execPopulate();
};

user.statics.get = function(id) {
  if(id) {
    return this.findOne({_id: id});
  } else {
    return this.find();
  }
};

user.statics.create = function(obj) {
  let newUser = new this(obj);
  return newUser.save();
};

user.statics.update = function(id, obj) {
  return this.findByIdAndUpdate(id, obj, {new: true});
};

user.statics.delete = function(id) {
  return this.deleteOne({_id: id})
    .then(result => {
      return result.deletedCount === 1;
    });
};

user.statics.getByUsername = function(username) {
  return this.findOne({ username: username });
};

user.pre('save', async function() {
  if(this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

user.statics.authenticateBasic = async function({username, password}) {
  let query = {username};
  let user = await this.findOne(query);
  return user && user.comparePassword(password);
};

user.statics.authenticateToken = async function(token) {
  let tokenData = jwt.decode(token);
  let query = {_id: tokenData.id};
  let user = await this.findOne(query);
  if(user && jwt.verify(token, user.generateSecret())) {
    return user;
  } else {
    return null;
  }
};

user.methods.comparePassword = async function(password) {
  let valid = await bcrypt.compare(password, this.password);
  return valid ? this : null;
};

user.methods.generateToken = function() {
  let tokenData = {
    id: this._id,
    role: this.role,
    username: this.username,
  };
  return jwt.sign(tokenData, this.generateSecret());
};

user.methods.generateSecret = function() {
  return process.env.SECRET || 'testingSecret';
};

module.exports = mongoose.model('users', user);
