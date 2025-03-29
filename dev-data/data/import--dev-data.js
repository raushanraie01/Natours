const mongoose = require('mongoose');
const fs = require('fs');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');

mongoose
  .connect(
    'mongodb+srv://raushanraie01:KOpwW93WU0aWSJ6z@udemyclouster0.pgj0n.mongodb.net/',
  )
  .then(() => console.log('Connecting to DB'))
  .catch((err) => console.log(err));

dotenv.config({ path: './config.env' });

//Reading the file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'),
);

//importing to DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data is imported!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteAllData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Tour data Deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

console.log(process.argv);
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteAllData();
}
