// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const sass = require("node-sass-middleware");
const app = express();
const morgan = require("morgan");
const session = require('express-session')

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

//psql database helper functions

const dbHelpers = require("./queryDatabase");
const { getAllMenuItems } = dbHelpers(db);

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  "/styles",
  sass({
    src: __dirname + "/styles",
    dest: __dirname + "/public/styles",
    debug: true,
    outputStyle: "expanded",
  })
);
app.use(express.static("public"));

var sess = {
  secret: 'keyboard cat',
  cookie: {}
}

app.use(session(sess))


// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
const widgetsRoutes = require("./routes/widgets");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
app.use("/api/widgets", widgetsRoutes(db));
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).
app.get("/", (req, res) => {
  getAllMenuItems().then((rows) => {
    let userId = req.session && req.session.userId;
    const templateVars = { menuItems: rows, userId };
    console.log(templateVars);
    res.render("index", templateVars);
  });
});

// added for dev - move later
app.get("/checkout", (req, res) => {
  let userId = req.session && req.session.userId;
  res.render("checkout", {userId});
});

// added for dev - move later
app.get("/login", (req, res) => {
  let userId = req.session && req.session.userId;
  if(userId){
    res.redirect("/")
  }else{
    res.render("login", {userId:null});
  }
});

// added for dev - move later
app.get("/register", (req, res) => {
  res.render("registration");
});

// added for dev - move later
app.get("/myorders", (req, res) => {
  let userId = req.session && req.session.userId;
  res.render("myorders", {userId});
});

//jpiotrowski0@jigsy.com --> password
app.post('/login', (req, res) => {
  req.session.userId = 1;
  res.redirect("/")
})

app.get("/logout", (req, res) => {
  req.session.userId = null;
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});


