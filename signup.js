const mysql = require('mysql');
const express = require('express');
const bodyparser = require('body-parser');
var app = express();
// const bcrypt = require('bcryptjs');
app.use(bodyparser.json());


var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'registration',

});

mysqlConnection.connect((err) =>{
    if(err) throw err;
    console.log('Mysql Connected...');
  });

app.get('/', (req, res) => {
    mysqlConnection.query('SELECT * FROM signup', (err, rows, fields) => {
      if (!err)
        res.send(rows);
      else
        console.log(err);
    });
  });
  
  app.post('/register', (req, res) => {
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const username = req.body.username;
    const password = req.body.password;
    let data = { first_name, last_name, username, password };
        mysqlConnection.query("SELECT * FROM signup WHERE username='" + username + "' limit 1", async  (err, rows, fields) => {
            if (rows.length > 0) {
              return res.send("already exist");
            } else if(password !== null) {
                return res.send('Passwords must 6 character')
                }
    let hashedPassword = await bcrypt.hash(password, 8)
    mysqlConnection.query("INSERT INTO signup SET ?", data, (err, results) => {
      if (err) {
        return res.send(err);
      }else{
        return res.send('success');
      }
    })
    });
});



  
  










const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}..`));