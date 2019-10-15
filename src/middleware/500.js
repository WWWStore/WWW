'use strict';

module.exports = (err, req, res, next) => {
  console.log('__SERVER_ERROR__', err);
  let error = {error: err.message || err};
  res.status(err.status || 500).json(error);
};
