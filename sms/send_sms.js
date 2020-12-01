// Download the helper library from https://www.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console
// and set the environment variables. See http://twil.io/secure

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
// const accountSid = "AC74082a20169c8f3ee23fd7fd6a3574c9";
// const authToken = "5c54cd8fcfeb75e236672ee9ea9aaaf3";
const client = require("twilio")(accountSid, authToken);

const myName = "Julia";
const myOrderNumber = 101;
const myPhoneNumber = "+16473823731";
const sendMessage = function (name, phoneNumber, orderNumber) {
  client.messages
    .create({
      body: `Dear ${name}, Thank you for placing your order. Your order number is ${orderNumber}. We will notify you when it is ready for pickup shortly.`,
      from: "+12055966681",
      to: phoneNumber,
    })
    .then((message) => console.log(message.sid));
};

sendMessage(myName, myPhoneNumber, myOrderNumber);
