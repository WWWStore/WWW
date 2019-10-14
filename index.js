'use strict';

const server = require('./src/server');
require('dotenv').config();

server.start(process.env.PORT);