const dotenv = require('dotenv');
dotenv.config({
  path: './config.env',
});

const app = require('./app.js');
const ConnectDB = require('./db/index.js');

ConnectDB()
  .then(() => {
    app.listen(process.env?.PORT || 3000, () => {
      console.log(`🛞 Server is Running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log('Error:', err);
  });
