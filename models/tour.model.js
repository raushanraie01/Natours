const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tour name must reuired'],
    unique: [true, 'Tour name must be unique'],
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'Tour must have price'],
  },
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
