const nodemailer = require("nodemailer");
const sendgridTransport = require('nodemailer-sendgrid-transport');

async function sendEmail(email, subject, text) {
  // using sendgrid
  const transport = nodemailer.createTransport(sendgridTransport({
    auth: {
      api_key: process.env.API_KEY
    }
  }))
  transport.sendMail({
    to: email,
    from: `car-maintenance-buddy@outlook.com`,
    subject: subject,
    text: text
  }).then(() => {
    console.log("mail sent.");
    return true;
  }).catch(err => {
    console.log(err);
    return false;
  });
};

module.exports = { sendEmail };
