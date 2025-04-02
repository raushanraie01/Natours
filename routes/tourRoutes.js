const express = require('express');
const Tour = require('../models/tour.model.js');

const router = express.Router();

router.route('/').get((_, res) => {
  res.status(200).json({
    status: 'success',
  });
});
router.route('/').post((req, res) => {
  // const { name, price, rating } = req.body();
  const tour = Tour.create({
    name: 'Raushan',
    price: 300,
    rating: 5,
  });
  console.log(tour);

  res.status(200).json({
    status: 'success',
    message: 'Done',
  });
});

module.exports = router;
