const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

mongoose
  .connect(
    'mongodb+srv://raushanraie01:KOpwW93WU0aWSJ6z@udemyclouster0.pgj0n.mongodb.net/',
  )
  .then(() => console.log('Database Connected!'))
  .catch((err) => {
    console.log('Error!');
  });

dotenv.config({ path: './config.env' });

const PORT = Number(process.env.PORT) || 3002;
app.listen(PORT, () => {
  console.log(`Server app listening on port:${PORT} `);
});
