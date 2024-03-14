const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.urlencoded({extended:true}));


const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "delta_app",
  password: "Iamvikas",
});

let getRandomUser = () => {
  return [
    faker.datatype.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password(),
  ];
};

// home route fetch and show total number of user in sql table ==SELECT count(*) FROM user;==
app.get("/", (req, res) => {
  let q = `SELECT count(*) FROM user`;
  try {
    connection.query(q, (err, result) => {
      // pass query
      if (err) throw err;
      let count = result[0]["count(*)"];
      console.log();
      res.render("home.ejs", { count });
    });
  } catch (err) {
    console.log(err);
    res.send("some error in database");
  }
});

//fecth and show route (userid,username,email) of all users using get/user

app.get("/user", (req, res) => {
  let q = `SELECT * FROM user`;
  try {
    connection.query(q, (err, users) => {
      // pass query
      if (err) throw err;
      // console.log(result);
      res.render("showusers.ejs", { users });
    });
  } catch (err) {
    console.log(err);
    res.send("some error in database");
  }
});

//edit rout
app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM user WHERE id='${id}'`;
  
  try { 
    connection.query(q, (err, result) => {
      if (err) {
        console.log(err);
        return res.send("Error fetching user");
      }

      let user = result[0];
      console.log(result[0]);
      res.render("edit.ejs", { user }); // Render the edit template with user data
    });
  } catch (err) {
    console.log(err);
    res.send("Some error in database");
  }
});

// update route in database 
app.patch("/user/:id", (req, res) => {
  let { id } = req.params;
  let { password: formPass, username: newUsername } = req.body;
  let q = `SELECT * FROM user WHERE id='${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      if (formPass != user.password) {
        res.send("WRONG PASSWORD"); // Sending response here
      } else {
        let q2 = `UPDATE user SET username='${newUsername}' WHERE id='${id}'`;
        connection.query(q2, (err, result) => {
          if (err) throw err;
          res.redirect("/user");
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.send("Some error in database");
  }
});



app.listen(8080, (req, res) => {
  console.log("Server is listening to 8080  ");
});

//inserting new data
// let q = "INSERT INTO user(id,username,email,password) VALUES ?"; //varibal query

// let data=[];
// for(let i=1;i<=100;i++){
// data.push(getRandomUser()); //100 fake user data
// }

// try {
//   connection.query(q, [data], (err, result) => {
//     // pass query
//     if (err) throw err;
//     console.log(result);
//   });
// } catch (err) {
//   console.log(err);
// }

// connection.end();
