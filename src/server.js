'use strict';

// Express
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Required Folders
const router = require('./auth/router');

// Prepare express app
const app = express();

/*========
Test Route Delete After Code is Written
========*/

app.get('/500', () => {
  throw 'Skylar is saying things';
});

// App  Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Use routes
app.use(router);

// app.use(router);

module.exports = {
  server: app,
  start: port => {
    let PORT = port || process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Listening on ${PORT}`));
  },
};