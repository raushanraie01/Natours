const User = require('../models/user.model');
const asyncHandler = require('../utils/asyncHandler');
const jwt = require('jsonwebtoken');
const apiError = require('../utils/apiError');

exports.signUp = asyncHandler(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;
  const newUser = await User.create({ name, email, password, passwordConfirm });

  // console.log(process.env.JWT_EXPIRES);

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
  res.status(201).json({
    status: 'success',
    token: token,
    data: {
      user: newUser,
    },
  });
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  //check wheater it exsits or not
  if (!email && !password) {
    return next(new apiError('Please provide Email and Password', 400));
  }

  //Already exists in DB or not
  const user = await User.findOne({ email });

  //no user exist for that email
});
