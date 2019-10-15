const expressSwaggerGenerator = require('express-swagger-generator');

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
  files: ['./*.js'], //Path to the API handle folder
};

function enableSwagger(app) {
  const expressSwagger = expressSwaggerGenerator(app);
  expressSwagger(options);
}

// start up a specific standalone swagger server on a specific port
// http://[domain]/api-docs
if (!module.parent){
  const express = require('express');
  const swaggerServer = express();
  enableSwagger(swaggerServer);
  swaggerServer.listen(3333, () => console.log('Listening on port 3333'));
}

module.exports = enableSwagger;