'use strict';

const express = require('express');
const router = express.Router();

const auth = require('../auth/middleware');

const User = require('../models/users-model');

router.get('/wagon', auth(), getWagon);

/**
 * Gets all products in a users wagon given a user is logged in.
 * @route GET /wagon
 * @group Wagon
 * @security [{"JWT": []},{"basicAuth": []}]
 */
function getWagon(req, res, next) {
  res.send(req.user.wagon);
}

module.exports = router;