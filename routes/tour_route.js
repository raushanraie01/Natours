const express = require('express');
const tourController = require('../controllers/tour.controllers.js');

const authController = require('../controllers/authController.js');
const reviewController = require('../controllers/review.controller.js');

const router = express.Router();

router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    tourController.deleteTour,
  );

router
  .route('/:tourId/reviews')
  .post(
    authController.protect,
    authController.restrictTo,
    reviewController.createReview,
  );

module.exports = router;
