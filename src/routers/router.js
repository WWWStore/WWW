'use strict';

const express = require('express');
const router = express.Router();

router.post('/signup', (req, res, next) => {
  let user = {_id: 1,name: 'Andy',wagon: [],role: 'Marshal',password: 'password'};
  user.save()
    .then((user) => {
      req.token = user.generateToken();
      req.user = user;
      res.set('token', req.token);
      res.cookie('auth', req.token);
      res.send(req.token);
    })
    .catch(next);
});
