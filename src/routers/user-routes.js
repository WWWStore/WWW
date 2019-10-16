'use strict';

const express = require('express');
const router = express.Router();

const auth = require('../auth/middleware');

const User = require('../models/users-model');

router.get('/:username/wagon', auth(), getWagon);

function getWagon(req, res, next) {
  User.getByUsername(req.params.username)
    .then(results => {
      res.send(results);
    });
}

module.exports = router;