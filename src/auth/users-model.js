const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const userAuth = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  email: {type: String},
  role: {
    type: String,
    required: true,
    default: 'ranger',
    enum: ['marshal', 'sheriff', 'deputy', 'ranger'],
  },
  wagon: { type: Array, required: true, default: [] },
});

userAuth.pre('save', async function() {
  if(this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

userAuth.statics.authenticateBasic = async function({username, password}) {
  let query = {username};
  let user = await this.findOne(query);
  return user && user.comparePassword(password);
};

userAuth.statics.authenticateToken = async function(token) {
  let tokenData = jwt.decode(token);
  let query = {_id: tokenData.id};
  let user = await this.findOne(query);
  if(user && jwt.verify(token, user.generateSecret())) {
    return user;
  } else {
    return null;
  }
};

userAuth.methods.comparePassword = async function(password) {
  let valid = await bcrypt.compare(password, this.password);
  return valid ? this : null;
};

userAuth.methods.generateToken = function() {
  let tokenData = {
    id: this._id,
    role: this.role,
  };
  return jwt.sign(tokenData, this.generateSecret());
};

userAuth.methods.generateSecret = function() {
  return process.env.SECRET || 'testingSecret';
};

module.exports = mongoose.model('users', userAuth);
