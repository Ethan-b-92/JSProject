require("dotenv").config();
const nodemailer = require("nodemailer");
// User model
//const User = require("../models/userScheme.js");

const transporter = nodemailer.createTransport({
  service: "Hotmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD
  },
});

// Send verification email
const sendEmail = async (email, text, res) => {
  // url to be used in the mail
  //const { email } = await User.findById({ _id: task.userId });
  // mail options
  const mailData = {
    from: process.env.MAIL_USER,
    to: email,
    subject: `Your Password in Car Maintenace Buddy website`,
    html: `<p>${text}.</p>`,
  };
  //Send mail
  transporter
    .sendMail(mailData)
    .then(() => {
      console.log(`Mail sent to: ${email}`);
      return true;
    })
    .catch((err) => {
      console.log(err);
      console.log(`Could not sent mail to: ${email}`);
      return false;
    });
};

module.exports = { sendEmail };
