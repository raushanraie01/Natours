const User = require('../models/user.model');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');

// exports.signUp = asyncHandler(async (req, res) => {
//   const newUser = User.create(req.body);

//   res.status(201).json({
//     status: 'success',
//     data: { user: newUser },
//   });
// });

// exports.getAllUsers = asyncHandler(async (req, res) => {
//   const users = await User.find();

//   res.status(400).json({
//     status: 'success',
//     users: {
//       data: users,
//     },
//   });
// });

// exports.getUser = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;

//   const user = await User.findById(id);

//   if (!user) {
//     return next(new ApiError('User Id does not exist ', 404));
//   }

//   //if exist
//   res.status(400).json({
//     status: 'success',
//     users: {
//       data: users,
//     },
//   });
// });

// exports.deleteUser = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;

//   const user = await User.findOneAndDelete(id);

//   if (!user) {
//     return next(new ApiError('user with given id does not exist', 404));
//   }

//   res.status(400).json({
//     status: 'success',
//     message: 'Deleted',
//     data: null,
//   });
// });

// exports.updateUser = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const user = await User.findByIdAndUpdate(id, req.body, {
//     new: true,
//     runValidators: true,
//   });

//   if (!user) {
//     return next(new ApiError('user does not exist ', 404));
//   }

//   res.status(400).json({
//     status: 'success',
//     users: {
//       data: user,
//     },
//   });
// });

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

exports.deleteUser = (req, res) => {
  console.log(req.params);

  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

exports.updateMe = asyncHandler(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400,
      ),
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
