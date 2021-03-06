const express = require('express');
const generator = require('express-swagger-generator');

let options = {
  swaggerDefinition: {
    info: {
      description: 'Documentation to utilize the methods that we have implemented on our API server, the Wild Wild West.',
      title: 'WWW Swagger Docs!',
      version: '1.0.1',
    },
    host: process.env.API_HOST || 'localhost:3000',
    basePath: '',
    produces: [
      'application/json',
    ],
    schemes: [process.env.API_SCHEME || 'http'],
    securityDefinitions: {
      basicAuth: {
        type: 'basic',
      },
      JWT: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
        description: '',
      },
    },
  },
  basedir: __dirname, //app absolute path
  files: ['../**/*.js'], //Path to the API handle folder
};

// start up a specific standalone swagger server on a specific port
// http://[domain]/api-docs
if(!module.parent) {
  const swaggerServer = express();
  const expressSwagger = generator(swaggerServer);
  expressSwagger(options);
  swaggerServer.listen(3333);
}

module.exports = server => generator(server)(options);
