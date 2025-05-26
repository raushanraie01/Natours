const User = require('../models/user.model');
const asyncHandler = require('../utils/asyncHandler');

exports.signUp = asyncHandler(async (req, res, next) => {
  const newUser = await User.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});
