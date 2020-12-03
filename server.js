// load .env data into process.env
require("dotenv").config();

// hide the query in a textarea and populate w jQ then grab it

// Web server config
const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const sass = require("node-sass-middleware");
const app = express();
const morgan = require("morgan");

const cookieSession = require("cookie-session");
const bcrypt = require("bcrypt");

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

//psql database helper functions

const dbHelpers = require("./queryDatabase");
const { getAllMenuItems } = dbHelpers(db);

// const getUserFromEmail = require("./fetchUserFromEmail.js");

const orderDb = require("./addOrderToDb.js");
const updateOrderStatus = require("./updateOrderStatus.js");

//twilio confi
const http = require("http");
const MessagingResponse = require("twilio").twiml.MessagingResponse;
app.use(bodyParser.urlencoded({ extended: false }));

const getUser = require("./getPhoneNum.js");
const { getPhoneNumFromId } = getUser(db);
const addUser = require("./3_add_user_details_reg");
const verifyUserCreds = require("./4_match_login_creds_post");

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
};

//Get Time
const getTime = () => {
  const currentdate = new Date();
  const datetime = currentdate.getHours();
  return datetime;
};

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).
app.get("/", (req, res) => {
  console.log("this is a cookie", req.session.userId);
  getAllMenuItems().then((rows) => {
    let userId = req.session.userId;
    // time is +4
    const currentdate = new Date();
    const datetime = currentdate.getHours();
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
  let userId = req.session.userId;
  if (userId) {
    res.redirect("/");
  } else {
    res.render("registration", { userId: null });
  }
});

app.post("/registration", (req, res) => {
  const user = req.body;
  console.log("****** typeof user is : ****  ", typeof user.phone);
  user.password = bcrypt.hashSync(user.password, 12);
  console.log("user pwd in registeration  : ", user.password);
  addUser
    .addUserDetails(user)
    .then((user) => {
      if (!user.id) {
        console.log(" >>>>>>> On absence of users <<<<<<<");
        res.send({ error: "error" });
        return;
      }
      req.session.userId = user.id;
      res.redirect("/");
    })
    .catch((e) => res.send(e));
});

//This works

// // event listener for the click on checkout
// checkout.onclick = function() {
//   // console.log("working");
//   // orderNotes from text area
//   addOrderToDbVar.addOrderToDb(orderNotes, req.session.userId)
//     .then(row => console.log('incoming form db as response : ',row))
//     .catch(e => res.send(e))
// }

// let checkout = document.getElementById("confirm");
// //TWILIO - don't touch
app.post("/confirm", function (req, res) {
  req.session.orderId = generateRandomNumber();
  const orderId = req.session.orderId;
  const orderNotes = req.body.orderNotes;
  const nameAndQty = req.body.foodQty;
  const orderTotal = req.body.orderTotal;
  const userId = req.session.userId;
  let orderStatus = "ip";

  const templateVars = {
    orderNotes: orderNotes,
    nameAndQty: nameAndQty,
    orderTotal: orderTotal,
    userId: userId,
    orderStatus: orderStatus,
  };
  // const orderNotes =
  orderDb
    .addToOrderDb(nameAndQty, orderNotes, orderTotal, orderStatus, userId)
    .then((row) => console.log("incoming form db as response : ", row))
    .catch((e) => res.send(e));

  console.log("in orders");
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  //first number is customer, second number is restaurant
  const numbers = ["", "+16473823731"];
  const client = require("twilio")(accountSid, authToken);

  numbers.forEach(async (number) => {
    client.messages
      .create({
        body: `Thank you for your order of: ${nameAndQty}. Your total comes to ${orderTotal}. The restaurant will be notified of your special notes: ${orderNotes}. Delivery time will be updated shortly.`,
        from: "+12055966681",
        to: number,
      })
      .then((message) => {
        templateVars.message = message;
        res.render("confirmation", templateVars);
      })
      .catch((err) => console.log("error: ", err));
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
  const user = req.body;
  console.log("user pwd in login  : ", user.password);
  console.log("000 202 ----> ", verifyUserCreds);
  verifyUserCreds
    .fetchUserDetails(user)
    .then((userId) => {
      console.log("user values on server,js : ", userId);
      if (!userId) {
        console.log(" >>>>>>> On absence of users <<<<<<<");
        res.send({ error: "error" });
        return;
      }
      req.session.userId = userId;
      res.redirect("/");
    })
    .catch((e) => res.send(e));
});

app.get("/logout", (req, res) => {
  req.session = null;
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

// get phoneNum - user on checkout pg
// getPhoneNumFromId().then((rows) => {
//   let userPhoneNumber = rows.phone_num;
//   return userPhoneNumber;
// });

app.get("/checkout", (req, res) => {
  res.render("checkout");
});
