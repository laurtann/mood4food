const http = require("http");
const express = require("express");
const MessagingResponse = require("twilio").twiml.MessagingResponse;
const accountSid = "AC74082a20169c8f3ee23fd7fd6a3574c9";
const authToken = "22e3918b23911cd8ceccaa1182ce0225";
const twiml = require("twilio")(accountSid, authToken);

const app = express();

app.post("/sms", (req, res) => {
  const twiml = new MessagingResponse();

  twiml.message("The Robots are coming! Head for the hills!");

  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
});

http.createServer(app).listen(1337, () => {
  console.log("Express server listening on port 1337");
});
