const express = require('express');
const ApiError = require('./utils/apiError.js');
const globalErrorHandler = require('./controllers/errorController.js');
const toursRoute = require('./routes/tour_route.js');
const usersRoute = require('./routes/user.route.js');
const morgan = require('morgan');

const app = express();

//Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.static('public'));
app.use(express.json());

app.use((req, _, next) => {
  // console.log(req.headers);

  next();
});

app.use('/api/v1/tours', toursRoute);
app.use('/api/v1/users', usersRoute);

//handling error for different route
app.all('*', (req, _, next) => {
  next(new ApiError(`can't find  ${req.originalUrl} on this Url`, 404));
});
//handling global Error
app.use(globalErrorHandler);

module.exports = app;
