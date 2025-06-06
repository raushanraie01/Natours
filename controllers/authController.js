const User = require('../models/user.model');
const asyncHandler = require('../utils/asyncHandler');
const jwt = require('jsonwebtoken');
const apiError = require('../utils/apiError');
const { promisify } = require('util');
const sendMail = require('../utils/email');
const crypto = require('crypto');

const createResponseAndGenerateToken = async (user, statusCode, res) => {
  //generate JWT token
  let token = await generateRefreshToken(user._id);
  res.cookie('jwt', token, {
    expiresIn: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
    secure: true,
  });

  //only changed in object not in database
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

const generateRefreshToken = async (payload) => {
  return jwt.sign({ payload }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

exports.signUp = asyncHandler(async (req, res, next) => {
  const { name, email, password, passwordConfirm, role } = req.body;

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
    role,
  });

  //generateToken
  //send response along with token

  createResponseAndGenerateToken(newUser, 201, res);
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
  createResponseAndGenerateToken(user, 200, res);
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
  //it means token is valid and update user in request
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

//implementing forgotPassword to update new Passsword
exports.forgetPassword = asyncHandler(async (req, res, next) => {
  //1.)  Get user based on email
  const user = await User.findOne({ email: req.body.email });

  //if user doesn't exists
  if (!user) {
    return next(new apiError("User doesn't exists as per given email", 401));
  }
  //2.) if exists   generate token

  const resetToken = await user.createPasswordRefreshToken();
  await user.save({ validateBeforeSave: false });

  //send it to user's email
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot your password ? Submit the patch requestwith your new password ans password confirm to: ${resetURL}.\n If you didn't forget your password , please ignore this email!`;

  try {
    await sendMail({
      email: user.email,
      subject: `Your password reset token ( valid for 10 min)`,
      message,
    });
    res.status(200).json({
      status: 'successfull',
      message: ' Token send to email',
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({
      validateBeforeSave: false,
    });
    return next(new apiError('There was an error while sending mail', 500));
  }
});

//implementing resetPassword to update new Passsword
exports.resetPassword = asyncHandler(async (req, res, next) => {
  //Get the user based on token
  const { token } = req.params;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  //2) if the token has not expired ,and there is a user , set a new password

  if (!user) {
    return next(new apiError('Token is invalid or expired!', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  // 3)Update changePasswordAt property for the user --->userSchema.pre

  // 4)log the user in , send JWT
  createResponseAndGenerateToken(user, 200, res);
});

//implementing UpdatePassword to update new Passsword
exports.updatePassword = asyncHandler(async (req, res, next) => {
  //Get user from collection
  const user = await User.findById(req.user._id).select('+password');

  if (!user) {
    return next(new apiError('Need to logged in first... '));
  }
  if (
    !(await user.isPasswordCorrect(req.body.passwordCurrent, user.password))
  ) {
    return next(new apiError('Your Current password is wrong', 401));
  }

  //if so , update password
  (user.password = req.body.password),
    (user.passwordConfirm = req.body.passwordConfirm);
  await user.save();

  // *** User.findByIdAndUpdate() ---> validation will not work

  //logged the user in and send JWT token
  createResponseAndGenerateToken(user, 200, res);
});
