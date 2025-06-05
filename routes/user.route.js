const express = require('express');
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} = require('../controllers/user.controller');
const authController = require('../controllers/authController.js');

const router = express.Router();

router.route('/signUp').post(authController.signUp);
router.route('/login').post(authController.login);

router.route('/forgetPassword').post(authController.forgetPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);

router
  .route('/updatePassword/')
  .patch(authController.protect, authController.updatePassword);
router
  .route('/updateME')
  .patch(authController.protect, authController.updateMe);

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').patch(updateUser).get(getUser).delete(deleteUser);

module.exports = router;
