const mongoose = require('mongoose');
const validator = require('validator');
const { validate } = require('./tour.model');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please tell us your name'],
      maxlength: 40,
      minlength: 8,
    },
    email: {
      type: String,
      required: [true, 'please enter your email Id'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'please provide a valid email'],
    },
    // username: {
    //   type: String,
    //   unique: true,
    // },
    password: {
      type: String,
      required: [true, 'must have a password'],
      minlength: 8,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'must have a correct password'],
    },
    // image: {
    //   type: String,
    // },
  },
  { timestamps: true },
);

const User = mongoose.model('User', UserSchema);
module.exports = User;
