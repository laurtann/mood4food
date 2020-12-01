const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

client.messages
  .create({
    body: "This is the initial greeting message",
    from: "+12055966681",
    to: "+16473823731",
  })
  .then((message) => console.log(message.sid));

// console.log(process.env.TWILIO_ACCOUNT_SID);
// console.log(process.env.TWILIO_AUTH_TOKEN);
