const Tour = require('../models/tourModel');

//Route handlers

exports.getAllTours = async (req, res) => {
  try {
    // Build Query
    let queryObj = { ...req.query };
    const excludeedField = ['page', 'sort', 'limit', 'field'];
    excludeedField.forEach((el) => {
      delete queryObj[el];
    });
    // { duration: { gte: '5' } }
    // { duration: { $gte: '5' } }

    //Advance query
    let queryStr = JSON.stringify(queryObj);

    queryStr = queryStr.replace(
      /\b(gte)|(gt)|(lte)|(lt)\b/g,
      (match) => `$${match}`,
    );
    // console.log(JSON.parse(queryStr));
    let query = Tour.find(JSON.parse(queryStr));

    if (req.query?.sort) {
      query = query.sort(req.query.sort);
    }

    const tours = await query;

    //send response
    res.status(200).json({
      status: 'success',
      length: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Something Wrong...',
    });
  }
};
exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(200).json({
      status: 'success',
      // requestTime: req.requestTime,
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // Tour.findOne({ _id: req.params.id });
    res.status(302).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid Id...',
    });
  }
};
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(201).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid Id...',
    });
  }
};
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      message: 'Deleted Tour',
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid Id!',
    });
  }
};
