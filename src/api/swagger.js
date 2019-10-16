const express = require('express');
const generator = require('express-swagger-generator');

let options = {
  swaggerDefinition: {
    info: {
      description: 'API Server',
      title: 'Swaggertastic Docs!',
      version: '1.0.1',
    },
    host: 'localhost:3000',
    basePath: '',
    produces: [
      'application/json',
    ],
    schemes: ['http'],
    securityDefinitions: {
      basicAuth: {
        type: 'basic',
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
