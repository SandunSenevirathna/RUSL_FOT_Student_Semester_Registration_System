// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./dbConfig'); // Import the database configuration

const server = express();
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(express.json());
server.use(cors({ origin: 'http://localhost:3000', optionsSuccessStatus: 200 }));

// Establish the database connection
db.connect(function (error) {
  if (error) {
    console.log('Error Connecting to DB');
  } else {
    console.log('Successfully Connected to DB');
  }
});

const PORT = 8085;
server.listen(PORT, function check(error) {
  if (error) {
    console.log(err + 'Error....!!!!');
  } else {
    console.log(`Server is running on port ${PORT}..!`);
  }
});

