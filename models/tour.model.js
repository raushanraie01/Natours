const mongoose = require('mongoose');

const TourSchema = new mongoose.Schema({});

const Tour = mongoose.model('Tours', TourSchema);
module.exports = Tour;
