const mongoose = require('mongoose');

const ConnectDB = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://raushanraie01:JstsKLazCuwye7lF@cluster0.ykly0ja.mongodb.net/TravellersData',
    );
    console.log('MongoDB Connected !! successfully');
  } catch (error) {
    console.log('MongoDB connection Failed! ', error);
    process.exit(1);
  }
};
module.exports = ConnectDB;
