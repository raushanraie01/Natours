const Tour = require('../models/tour.model.js');
const ApiError = require('../utils/apiError.js');
const asyncHandler = require('../utils/asyncHandler.js');
const APIFeatures = require('../utils/apiFeatures.js');

exports.getAllTours = asyncHandler(async (req, res, next) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const tours = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
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

  if (!tour) {
    return next(new ApiError('Tour with given id does not exist', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Done',
    id,
  });
});

exports.getTour = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const tour = await Tour.findById(id).populate('guides');

  if (!tour) {
    return next(new ApiError('Tour with given id does not exist', 404));
  }
  res.status(200).json({
    status: 'success',
    data: { tour },
  });
});

exports.deleteTour = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const tour = await Tour.findByIdAndDelete(id);

  if (!tour) {
    return next(new ApiError('Tour with given id does not exist', 404));
  }
  res.status(204).json({
    status: 'success',
    message: 'Deleted',
    data: null,
  });
});
