const express = require('express');
const tourController = require('../controllers/tour.controllers.js');

const authController = require('../controllers/authController.js');

const router = express.Router();

router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .patch(tourController.updateTour)
  .get(tourController.getTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    tourController.deleteTour,
  );

module.exports = router;
