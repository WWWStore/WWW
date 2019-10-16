'use strict';

const express = require('express');
const router = express.Router();

const auth = require('./middleware');
const User = require('./users-model');

/**
 * Sign up for a new account
 * @route POST /signup
 */
router.post('/signup', (req,res,next) => {
  let user = new User(req.body);
  user.save()
    .then(user => {
      req.token = user.generateToken();
      req.user = user;
      res.set('token', req.token);
      res.cookie('auth',req.token);
      res.send(req.token);
    })
    .catch(next);
});

router.get('/signin', auth(), (req,res,next) => {
  res.cookie('auth', req.token);
  res.send(req.token);
});

router.post('/key', auth('generate-key'), (req,res) => {
  res.send(req.user.generateToken('key'));
});

module.exports = router;
