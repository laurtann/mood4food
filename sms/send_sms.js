// Download the helper library from https://www.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console
// and set the environment variables. See http://twil.io/secure
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
const accountSid = "AC74082a20169c8f3ee23fd7fd6a3574c9";
const authToken = "5c54cd8fcfeb75e236672ee9ea9aaaf3";
const client = require("twilio")(accountSid, authToken);

client.messages
  .create({
    body: "This is the ship that made the Kessel Run in fourteen parsecs?",
    from: "+12055966681",
    to: "+16473823731",
  })
  .then((message) => console.log(message.sid));
