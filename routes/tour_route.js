const express = require('express');
const {
  createTour,
  getAllTours,
  updateTour,
  deleteTour,
  getTour,
} = require('../controllers/tour.controllers.js');

const authController = require('../controllers/authController.js');

const router = express.Router();

router.route('/').get(authController.protect, getAllTours).post(createTour);
router.route('/:id').patch(updateTour).get(getTour).delete(deleteTour);

module.exports = router;
