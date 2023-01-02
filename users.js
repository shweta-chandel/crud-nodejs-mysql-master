const mysql = require('mysql');
const express = require('express');
const path =require("path");
const bodyparser = require('body-parser');
const app = express();
app.use(bodyparser.json());
const multer = require('multer');

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'e-commerce_users',
  multipleStatements: true
});
conn.connect((err) =>{
  if(err) throw err;
  console.log('Mysql Connected...');
});


app.get('/',(req, res) => {
  let sql = "SELECT * FROM users";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(results)
  });
});

  app.post('/register', (req, res) => {
    console.log(req.body);
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const type = req.body.type;
    let data = { username, email, password, type };
    conn.query("SELECT * FROM users WHERE email='" + email + "' limit 1", (err, rows, fields) => {
      if (rows.length > 0) {
        return res.send("already exist");
      }
      conn.query("INSERT INTO users SET?", data, (err, results) => {
        if (err) {
          return res.send("Failed");
        }
        else {
          return res.send("success");
        }
      });
    });
  });
  
app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const data = {email, password};
  conn.connect('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], function (err, rows) {
    if (rows.length > 0) {
      return res.send("logged in")
    }
    else {
      return res.send("not found");
    }
  })
})

app.post('/update',(req, res) => {
  let sql = "UPDATE users SET username='"+req.body.username+"',email='"+req.body.email+"',password='"+req.body.password+"', type='"+req.body.type+"' WHERE id="+req.body.id;
   conn.connect(sql, (err, rows) => {
  if(err) throw err;
  console.log(rows);
    res.send("successfully profile updated");
  });
});

const storage = multer.diskStorage({
  destination:  './upload/images',
  filename: (req, file, cb) => {
    return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
  }
})
const upload = multer({
  storage : storage
})

app.post("/upload", upload.single('profile'),(req, res)=>{
  console.log(req.file);


res.json({
  success:1,
  profile_url:`http://localhost:4000/profile/${req.file.filename}`
})
})


app.post('/product', (req, res) => {
  const product_categories = req.body.product_categories;
  const product_prices = req.body.emaproduct_pricesil;
  const product_images = req.body.product_images;
  const brands = req.body.brands;
  let data = { product_categories, product_prices, product_images, brands };
    conn.query("INSERT INTO product SET?", data, (err, results) => {
      if (err) {
        return res.send("Failed");
      }
      else {
        return res.send("success");
      }
    });
  });







app.listen(5000, () => console.log('server'));