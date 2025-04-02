const express = require('express');

const app = express();
//Middleware
app.use(express.static('public'));
app.use(express.json());

app.get('api/v1/tours', (req, res) => {
  res.send();
});

module.exports = app;
