const mysql = require('mysql');
const express = require('express');
var app = express();
const bodyparser = require('body-parser');
app.use(bodyparser.json());

var mysqlConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'registration',
});

mysqlConnection.connect((err) => {
  if (err) throw err;
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


//register//
app.post('/register', (req, res) => {
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const username = req.body.username;
  const password = req.body.password;
  let data = { first_name, last_name, username, password };
  mysqlConnection.query("SELECT * FROM signup WHERE username='" + username + "' limit 1", async (err, rows, fields) => {
    if (rows.length > 0) {
      return res.send("already exist");
    } else if (password !== null) {
      return res.send('Passwords must 6 character')
    }
    mysqlConnection.query("INSERT INTO signup SET ?", data, (err, results) => {
      if (err) {
        return res.send(err);
      } else {
        return res.send('success');
      }
    })
  });
});

//new image//
const multer = require('multer');
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "upload")
    },
    filename: function (req, file, cb) {
      cb(null, file.filename + "-" + Date.now() + ".jpg")
    }
  })
}).single("user_file");
app.post("/upload", upload, (req, res) => {
  res.send("file upload")
});

//login//
app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const data = { username, password };
  mysqlConnection.query('SELECT * FROM signup WHERE username = ? AND password = ?', [username, password], function (err, rows) {
    if (rows.length > 0) {
      return res.send("logged in")
    }
    else {
      return res.send("not found");
    }
  })
})

// changed password//
app.post('/changedpassword', (req, res) => {
  const username = req.body.username;
  const oldpassword = req.body.oldpassword;
  const newpassword = req.body.newpassword;
  mysqlConnection.query('SELECT * FROM signup where username =? and password =?', [username, oldpassword], (err, results) => {
    console.log(results.length);
    if (!err) {
      if (results.length <= 0) {
        return res.send("incorrect");
      }
      else if (results[0].password == oldpassword) {
        mysqlConnection.query('UPDATE signup set password = ? where username =?', [newpassword, username], (err, results) => {
          if (!err) {
            return res.send("password updated")
          }
          else {
            return res.send(err);
          }
        })
      }
      else {
        return res.send("something went wrong try again later");
      }
    }
    else {
      return res.send(err);
    }
  })
})

//forgot password//
app.post('/forgotpassword',(req,res) =>{
  const username = req.body.username;
  var newpassword = req.body.newpassword;
    mysqlConnection.query(`SELECT * FROM signup WHERE username = "${username}"`, (err,results) => {
      if (!err) {
        if (results.length != 0) {
          mysqlConnection.query('UPDATE signup set password = ? where username =?', [newpassword, username], (err, results) => {
            if (!err) {
              return res.send("password updated")
            }
            else {
              return res.send(err);
            }
          })
        }else{
          return res.send("user not found");
        }
      }else{
        return res.send(err);
      }
    })
  })
        


    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Listening on port ${port}..`));