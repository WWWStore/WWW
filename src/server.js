'use strict';

// Express
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Required Folders
const productRouter = require('./routers/product-routes');
const categoryRouter = require('./routers/category-routes');
const authRouter = require('./auth/router');
const userRouter = require('./routers/user-routes');
const serverErr = require('./middleware/500');
const swagger = require('./api/swagger');

// Prepare express app
const app = express();

// App  Middleware
let corsOptions = {
  exposedHeaders: `token`,
};

app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Static Routes
app.use('/docs', express.static('docs'));
swagger(app);

// Use routes
app.use(authRouter);
app.use(categoryRouter);
app.use(productRouter);
app.use(userRouter);
app.use(serverErr);

module.exports = {
  server: app,
  start: port => {
    let PORT = port || process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Listening on ${PORT}`));
  },
};