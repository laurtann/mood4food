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
const cookieSession = require("cookie-session");

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

//psql database helper functions

const dbHelpers = require("./queryDatabase");
const { getAllMenuItems } = dbHelpers(db);

const getUser = require("./getPhoneNum.js");
const { getPhoneNumFromId } = getUser(db);

const getUserFromEmail = require("./fetchUserFromEmail.js");
const { fetchUserFromEmail } = getUserFromEmail(db);

//twilio confi
const http = require("http");
const MessagingResponse = require("twilio").twiml.MessagingResponse;
app.use(bodyParser.urlencoded({ extended: false }));

// const addOrderToDb = require("./addOrderToDb.js");

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

app.use(
  cookieSession({
    name: "session",
    keys: ["mOOd4F00d"],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
const widgetsRoutes = require("./routes/widgets");
const { promiseImpl } = require("ejs");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
app.use("/api/widgets", widgetsRoutes(db));
// Note: mount other resources here, using the same pattern above

//Generate random number (61-999)
const generateRandomNumber = () => {
  const random = Math.floor(Math.random() * 1000) + 61;
  return random;
}

//Get Time
const getTime = () => {
  const currentdate = new Date();
  const datetime = currentdate.getHours();
  return datetime;
}

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).
app.get("/", (req, res) => {
  console.log("this is a cookie", req.session.userId);
  getAllMenuItems().then((rows) => {
    let userId = req.session.userId;
    const templateVars = { menuItems: rows, userId, time: getTime() };
    res.render("index", templateVars);
  });
});

// added for dev - move later
app.get("/login", (req, res) => {
  let userId = req.session.userId;
  if (userId) {
    res.redirect("/");
  } else {
    res.render("login", { userId: null });
  }
});

// added for dev - move later
app.get("/register", (req, res) => {
  if (userId) {
    res.redirect("/");
  } else {
    res.render("registration", { userId: null });
  }
});

app.post("/register", (req, res) => {
  req.session.userId = generateRandomNumber();
  res.redirect("/");
});

//TWILIO - don't touch
app.get("/confirm", function (req, res) {
  let userId = 10;
  console.log("in orders");
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  //first number is customer, second number is restaurant
  const numbers = ["+14169869248", "+16473823731"];
  const client = require("twilio")(accountSid, authToken);

  numbers.forEach(async (number) => {
    const message = await client.messages
      .create({
        body:
          "The order has been sucessfully placed. Delivery time will be updated shortly.",
        from: "+12055966681",
        to: number,
      })
      .then((message) => {
        res.render("confirmation", { message: message });
      });
  });
});

const updateOrderTime = function (orderTime) {
  console.log("Updated order time: ", orderTime);
};

app.post("/sms", (req, res) => {
  const twiml = new MessagingResponse();
  console.log("in confirmation");
  const orderTime = req.body.Body;
  //sms response stored in req.body.Body
  twiml.message(
    `Thank you for updating us. The customer has been notified that the estimated pickup time is in ${orderTime} minutes.`
  );
  updateOrderTime(orderTime);
  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
});

// END OF TWILIO

//jpiotrowski0@jigsy.com --> password
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  fetchUserFromEmail(email)
    .then((row) => {
      if (!row) {
        res.send({error: "error"});
        return;
      }
      req.session.userId = row.id;
      res.redirect("/");
    }).catch((err) => {
      res.send(err);
    });
});

app.get("/logout", (req, res) => {
  req.session = null;
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

// get phoneNum - user on checkout pg
getPhoneNumFromId().then((rows) => {
  let userPhoneNumber =  rows.phone_num;
  return userPhoneNumber;
});
