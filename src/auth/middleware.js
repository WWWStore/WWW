const User = require('../models/users-model');
const uuid = require('uuid/v4');

module.exports = () =>
  async (req,res,next) => {
    if(req.headers.authorization) {
      try {
        let [authType, authString] = (req.headers.authorization || '').split(/\s+/);
        switch(authType.toLowerCase()) {
        case 'basic':
          return await _authBasic(authString);
        case 'bearer':
          return await _authBearer(authString);
        default:
          return await _authError();
        }
      }
      catch(err) {
        return await _authError(err);
      }
    } else if (req.cookies) {
      console.log(req.cookies);
    } else {
      User.create({
        username: `NONUSER-${uuid()}`,
        password: uuid(),
      })
        .then(_authenticate);
    }
    

    async function _authBasic(authString) {
      let decoded = Buffer.from(authString, 'base64').toString();
      let [username, password] = decoded.split(':');

      let user = await User.authenticateBasic({username, password});
      _authenticate(user);
    }

    async function _authBearer(token) {
      let user = await User.authenticateToken(token);
      _authenticate(user);
    }

    async function _authenticate(user) {
      if(user) {
        req.user = user;
        req.token = user.generateToken();
        res.set('token', req.token);
        res.cookie('auth', req.token);
        next();
      } else {
        await _authError();
      }
    }
    async function _authError(err) {
      console.error(err);
      next({status: 401, message: 'unauthorized'});
    }
  };
