const Tour = require('../models/tour.model.js');

exports.getAllTours = async (_, res) => {
  try {
    const tours = await Tour.find();

    res.status(200).json({
      status: 'success',
      TotalTour: tours.length,
      data: { tours },
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      mesage: 'something went wrong with the server',
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      message: 'Done',
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'Fail',
      message: 'Invalid data sent!',
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'Something wrong while updating data!',
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const { id } = req.params;

    const tour = await Tour.findById(id);
    res.status(200).json({
      status: 'success',
      data: { tour },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const { id } = req.params;
    await Tour.findByIdAndDelete(id);
    res.status(204).json({
      status: 'success',
      message: 'Deleted',
      data: null,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};
