const Tour = require('../models/tour.model.js');
const asyncHandler = require('../utils/asyncHandler.js');

exports.getAllTours = asyncHandler(async (req, res, next) => {
  let queryObj = { ...req.query };

  // /advance filtering
  const excludedFields = ['page', 'limit', 'fields'];
  excludedFields.forEach((el) => delete queryObj[el]);
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  queryObj = Tour.find(JSON.parse(queryStr));

  // const queryObj= Tour.find()
  //   .where('duration')
  //   .equals(5)
  //   .where('difficulty')
  //   .equals('easy');

  //sorting
  if (req.query.sort) {
    console.log(req.query);
    const sortBy = req.query.sort.split(',').join(' ');
    // console.log('Sort By:', sortBy); // Debugging
    queryObj = queryObj.sort('price');
  } else {
    queryObj = queryObj.sort('-createdAt'); // Default sort
  }

  //field limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    queryObj = queryObj.select(fields);
  } else {
    queryObj = queryObj.sort('-_v');
  }

  const tours = await queryObj;
  console.log(tours);

  res.status(200).json({
    status: 'success',
    TotalTour: tours.length,
    data: { tours },
  });
});

exports.createTour = asyncHandler(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    message: 'Done',
    data: {
      tour: newTour,
    },
  });
});

exports.updateTour = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const tour = await Tour.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    message: 'Done',
    id,
  });
});

exports.getTour = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const tour = await Tour.findById(id);
  res.status(200).json({
    status: 'success',
    data: { tour },
  });
});

exports.deleteTour = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  await Tour.findByIdAndDelete(id);
  res.status(204).json({
    status: 'success',
    message: 'Deleted',
    data: null,
  });
});
