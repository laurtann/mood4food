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

const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

//psql database helper functions

const dbHelpers = require("./queryDatabase");
const { getAllMenuItems } = dbHelpers(db);

//twilio confi
const http = require("http");
const MessagingResponse = require("twilio").twiml.MessagingResponse;
app.use(bodyParser.urlencoded({ extended: false }));

const getUser = require("./getPhoneNum.js");
const { getPhoneNumFromId } = getUser(db);
const  addUser  = require("./3_add_user_details_reg");

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
    let userId = req.session.userId;
    // time is +4
    const currentdate = new Date();
    const datetime = currentdate.getHours();
    const templateVars = { menuItems: rows, userId, time: datetime };
    console.log(' inside of / page via get request : and user id : -------->   ', userId);
    // const templateVars = { menuItems: rows, userId };
    res.render("index", templateVars);
  });
});

// app.get("/checkout", (req, res) => {
//   let userId = req.session.userId;
//   res.render("checkout", { userId });
// });

// app.post("/checkout", (req, res) => {
//   addOrderToDb(addFoodToOrder).then((res) =>
//   console.log("something"));
// });

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
  res.render("registration", { userId: null });
});

app.post("/registration", (req, res) => {
  const user = req.body;
  console.log('****** typeof user is : ****  ', typeof user.phone);
  user.password = bcrypt.hashSync(user.password, 12);
  // user.phone_num =
  // const data = $(user).serialize();
  addUser.addUserDetails(user)
  .then(user => {
    if(!user.id) {
      console.log(' >>>>>>> On absence of users <<<<<<<');
      res.send({error: "error"});
      return;
    }

  // userId = user.id;
  // res.send("🤗🤗🤗");
  req.session.userId = user.id;

  res.redirect("/");
    // console.log('------> on line no 103 <-------');
    // req.session.userId = user.id;
    // res.send("🤗🤗🤗");
  })
    .catch(e => res.send(e));

  // console.log("THIS IS A USER ID ", userId);

});

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

  if (!orderTime) {
    $("#error").hide();
    return true;
  } else {
    $("#error").show();
    return false;
  }
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

//jpiotrowski0@jigsy.com --> password
app.post("/login", (req, res) => {
  // cookie
  req.session.userId = 1;
  req.session.orderId = 1;
  console.log("These are cookies", req.session.userId, req.session.orderId);

  // get phoneNum
  getPhoneNumFromId().then((rows) => {
    let userPhoneNumber = rows[0].phone_num;
    return userPhoneNumber;
  });
  res.redirect("/");
});

app.get("/logout", (req, res) => {
  req.session = null;
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
