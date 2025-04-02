const mongoose = require('mongoose');
const app = require('./app');

mongoose
  .connect(
    'mongodb+srv://raushanraie01:JstsKLazCuwye7lF@cluster0.ykly0ja.mongodb.net/TravellersData',
  )
  .then(() => console.log('Database Connected!'))
  .catch((err) => {
    console.log('Error!');
  });

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server app listening on port:${PORT} `);
});
