const User = require('../models/user.model');
const asyncHandler = require('../utils/asyncHandler');
const jwt = require('jsonwebtoken');
const apiError = require('../utils/apiError');
const { promisify } = require('util');

const generateRefreshToken = async (payload) => {
  return jwt.sign({ payload }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

exports.signUp = asyncHandler(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;

  //check user enter every credential or not
  if (!name || !email || !password || !passwordConfirm) {
    return next(new apiError('Enter all credentials', 401));
  }
  //check password and confirmPassword are same
  if (password !== passwordConfirm) {
    return next(new apiError("Password and confirmPassword didn't match"), 401);
  }

  //if exists , then create User
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
  });

  //generateToken
  const token = await generateRefreshToken(newUser._id);

  //send response along with token
  res.status(201).json({
    status: 'success',
    token: token,
    data: {
      user: newUser,
    },
  });
});

exports.login = asyncHandler(async (req, res, next) => {
  //destructuring email and password from client side
  const { email, password } = req.body;

  //check wheater it exsits or not
  if (!email && !password) {
    return next(new apiError('Please provide Email and Password', 400));
  }

  // if exists,
  // then check wheater exist in DB or Not...
  const user = await User.findOne({ email }).select('+password');

  //if no user exist for that email
  if (!user) {
    return next(
      new apiError(
        'Invalid Credentials either Email or Password may wrong',

        400,
      ),
    );
  }

  //if user exists
  //confirm password first
  let isCorrect = await user.isPasswordCorrect(password, user.password);
  //if wrong password
  if (!user || !isCorrect) {
    return next(new apiError('Email or password is invalid', 401));
  }
  //if right passsword then generate token
  let token = await generateRefreshToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
  });
});

//protecting routing from unauthorized access
exports.protect = asyncHandler(async (req, _, next) => {
  //1)getting token and check of it's there
  let token;
  if (
    req.headers?.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
    // console.log(token);
  }
  if (!token) {
    return next(new apiError('You need to login First', 401));
  }
  //2)verification token
  const decodedData = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET,
  );

  //check wheather user is exist or not

  const freshUser = await User.findById(decodedData.payload);

  if (!freshUser) {
    return next(
      new apiError("The user belonging to this token doesn't exists!", 401),
    );
  }

  //4)check if user change password after the token was issue ----meaningly token is not valid
  if (!freshUser.isTokenValid(decodedData.iat)) {
    return next(new apiError('Invalid Token,Please login first!', 401));
  }
  //it means token is valid
  req.user = freshUser;
  next();
});

//protecting tours from deleting it.
exports.restrictTo = (...roles) => {
  return (req, _, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new apiError("You don't have permission to perform this action", 403),
      );
    }
    next();
  };
};

exports.forgetPassword = async (req, res, next) => {
  //1.)  Get user based on email
  const user = await User.findOne({ email: req.body.email });

  //if user doesn't exists
  if (!user) {
    return next(new apiError("User doesn't exists as per given email", 401));
  }
  //2.) if exists   generate token

  const resetToken = await user.createPasswordRefreshToken();
  user.save({ validateBeforeSave: false });

  //send it to user's email

  res.status(200).json({
    status: 'successfull',
    data: { user },
  });
};
