'use strict';

const express = require('express');
const router = express.Router();

const auth = require('./middleware');

const User = require('./users-model');

router.post('/signup', (req, res, next) => {
  let user = new User(req.body);
  user.save()
    .then(user => {
      req.user = user;
      req.token = user.generateToken();
      res.send(req.token);
    })
    .catch(next);
});

router.get('/signin', auth(), (req,res,next) => {
  res.send(req.token);
});

module.exports = router;
