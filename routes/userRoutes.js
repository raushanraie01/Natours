const express = require('express');

const userRouter = express.Router();
const {
  getAllUsers,
  createNewUser,
  getUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

//Routes

userRouter.route('/').get(getAllUsers).post(createNewUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
module.exports = userRouter;
