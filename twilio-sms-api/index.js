// console.log(process.env.TWILIO_ACCOUNT_SID);
// console.log(process.env.TWILIO_AUTH_TOKEN);

const express = require("express");
const app = express();
const http = require("http");
const bodyParser = require("body-parser");
const MessagingResponse = require("twilio").twiml.MessagingResponse;
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/myorders", function (req, res) {
  console.log("in orders");
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = require("twilio")(accountSid, authToken);
  client.messages
    .create({
      body:
        "Order number 101 has been placed. Please update esimated pickup time.",
      from: "+12055966681",
      to: "+16473823731",
    })
    .then((message) =>
      res.send(
        `The message was sent to: ${message.to} and delivered sucessfully!`
      )
    );
});

app.post("/sms", (req, res) => {
  const twiml = new MessagingResponse();

  //sms response stored in req.body.Body
  twiml.message(
    `Thank you for updating us. The customer has been notified that the estimated pickup time is in ${req.body.Body} minutes.`
  );

  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
});

http.createServer(app).listen(3000, () => {
  console.log("Express server listening on port 3000");
});
