// dbConfig.js
const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'rusl_srs',
});

module.exports = db;
