const mysql = require('mysql');
const express = require('express');
const jwt = require('jsonwebtoken');
const bodyparser = require('body-parser');
var app = express();
app.use(bodyparser.json());

var mysqlConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'e-commerce_users',
  multipleStatements: true
});
mysqlConnection.connect((err) => {
  if (!err)
    console.log('Connection Established Successfully');
  else
    console.log('Connection Failed!' + JSON.stringify(err, undefined, 2));
});














app.listen(5000, () => console.log('server'));