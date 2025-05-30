const mongoose = require('mongoose');
const validator = require('validator');
// const { validate } = require('./tour.model');
const bcrypt = require('bcrypt');
// const { token } = require('morgan');

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
    role: {
      type: String,
      enum: ['user', 'guide', 'lead-guide', 'admin'],
      default: 'user',
    },

    password: {
      type: String,
      required: [true, 'must have a password'],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'must have a correct password'],
    },

    passwordChangedAt: Date,
  },
  { timestamps: true },
);

UserSchema.pre('save', async function (next) {
  //if password wasn't modified
  if (!this.isModified('password')) return next();

  //if modified with cost/saltround of 10
  this.password = await bcrypt.hash(this.password, 10);
  this.passwordConfirm = undefined;
  //password changed
  this.passwordChangedAt = Date.now();
  next();
});

UserSchema.methods.isPasswordCorrect = async function (password, userPassword) {
  return await bcrypt.compare(password, userPassword);
};
UserSchema.methods.isTokenValid = async function (tokenIssuedAt) {
  //if the password was never changed then the token is valid
  if (!this.passwordChangedAt) return true;
  //if it changed
  let passwordChangeTimestamps = this.passwordChangedAt.getTime() / 1000; //changed in seconds
  return tokenIssuedAt > passwordChangeTimestamps;
};

const User = mongoose.model('User', UserSchema);
module.exports = User;
