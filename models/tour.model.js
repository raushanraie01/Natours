const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tour name must reuired'],
      unique: [true, 'Tour name must be unique'],
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      require: [true, 'A tour must have a difficulty'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    price: {
      type: Number,
      required: [true, 'Tour must have price'],
    },
    discount: {
      type: Number,
    },
    summary: {
      type: String,
      trim: true,
      require: [true, 'A tour must have a summary'],
    },
    discription: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
    startLocation: {
      type: {
        type: String,
        default: 'point',
        // enum: ['point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: { type: String, default: 'point' },

        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    // reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }], //  implement as virtual populate
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// virtual Populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  }).populate('reviews');

  next();
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
