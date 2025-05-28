const mongoose = require('mongoose');
const validator = require('validator');
const { validate } = require('./tour.model');
const bcrypt = require('bcrypt');

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
      select: false,
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

UserSchema.pre('save', async function (next) {
  //if password wasn't modified
  if (!this.isModified('password')) return next();
  //if modified with cost/saltround of 10
  this.password = await bcrypt.hash(this.password, 10);
  this.passwordConfirm = undefined;
  next();
});

UserSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', UserSchema);
module.exports = User;
