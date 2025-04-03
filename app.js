const express = require('express');
const toursRoute = require('./routes/tour_route.js');
const morgan = require('morgan');
const app = express();

//Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.static('public'));
app.use(express.json());

app.use('/api/v1/tours', toursRoute);

module.exports = app;
