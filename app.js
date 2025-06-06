const express = require('express');
const xss = require('xss-clean');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const ApiError = require('./utils/apiError.js');
const globalErrorHandler = require('./controllers/errorController.js');
const toursRoute = require('./routes/tour_route.js');
const usersRoute = require('./routes/user.route.js');

const morgan = require('morgan');

const app = express();
//Global Middleware
//set security to HTTP header
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  //development purpose
  app.use(morgan('dev'));
}
// limit request from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from the IP,Please try after an hour',
});

app.use('/api', limiter);
//Data sanitization against  NoSQL query injection
app.use(mongoSanitize());
//Data sanitization against XSS
app.use(xss());
//preventing parameter pollution
app.use(hpp());
//Serving static files
app.use(express.static('public'));
//Body Parser ,middleware to read data from req.body()
app.use(
  express.json({
    limit: '10kb',
  }),
);

app.use((req, res, next) => {
  // these are middleware which perform some task according to developer and pass to the next and so on , finally give response if there is no any error

  next();
});
//for routing if this route is called
app.use('/api/v1/tours', toursRoute);
app.use('/api/v1/users', usersRoute);

//handling error for different route
app.all('*', (req, _, next) => {
  next(new ApiError(`can't find  ${req.originalUrl} on this Url`, 404));
});
//handling global Error
app.use(globalErrorHandler);

module.exports = app;
