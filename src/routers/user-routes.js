'use strict';

const express = require('express');
const router = express.Router();

const auth = require('../auth/middleware');

const User = require('../models/users-model');

router.get('/wagon', auth(), getWagon);

function getWagon(req, res, next) {
  res.send(req.user.wagon);
}

module.exports = router;