const mysql = require('mysql');
const express = require('express');
const path =require("path");
const bodyparser = require('body-parser');
const app = express();
app.use(bodyparser.json());
const multer = require('multer');
const { join } = require('path');

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
  })
  
app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const data = {email, password};
  conn.query("SELECT * FROM users WHERE email = ? AND password = ?", [email, password], function (err, rows) {
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
  let query = conn.query(sql, (err, results) => {
  if(err) throw err;
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

app.post('/categories',(req, res) => {
  let sql = "SELECT * FROM categories";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(results)
  });
});

app.post('/brands',(req, res) => {
  let sql = "SELECT * FROM brands";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(results)
  });
});

const uploadImg = multer({storage: storage}).single('product_image');
app.post('/product',uploadImg, (req, res) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
      },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
  const product_name= req.body.product_name;
  const product_price = req.body.product_price;
  const product_image = req.file.originalname;
  const rating = req.body.rating;
  const brands_id = req.body.brands_id ;
  const categories_id = req.body.categories_id;
  let data = { product_name, product_price, product_image, rating, brands_id , categories_id };
    conn.query("INSERT INTO product_details SET?", data, (err, results) => {
      if (err) {
        console.log(err);
        return res.send("Failed"); 
      }
      else {
        return res.send("success");
      }
    });
  });

  app.post('/join',(req, res) => {
    let sql = "SELECT product_details.product_name, product_details.product_price, categories.cname, brands.bname FROM product_details INNER JOIN categories ON product_details.id = categories.cid INNER JOIN brands ON product_details.id = brands.bid";
    let query = conn.query(sql, (err, results) => {
      if(err) throw err;
      res.send(results)
    });
  });
 

app.listen(5000, () => console.log('server'));
  