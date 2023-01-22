// const express = require("express");
// const router = express.Router();
// var generator = require('generate-password');
// const nodemailer = require("nodemailer");
// const mail_username = "car_maintanance_buddy@yahoo.com";
// const mail_password = "clientserver2023";

// //const { sendEmail } = require("../utils/sendEmail");

// const User = require("../models/userScheme.js");
  
// const sendEmail = async (email, text)=> 
// {
//     try {
//             const transporter = nodemailer.createTransport({
//                 service: "Yahoo",
//                 auth: {
//                     user: mail_username,
//                     pass: mail_password,
//                 },
//                 secure: false,
//             });
  
//             await transporter.sendMail({
//                 from: mail_username,
//                 to: email,
//                 subject: `Your Password in Car Maintenace Buddy website`,
//                 text: text,
//             });
  
//             console.log("email sent sucessfully");
//         } 
//         catch (error) 
//         {
//             console.log(error, "email not sent");
//         }
// };

// router.get("/forgot-password", (req, res)=> 
// { 
//     res.render("forgot-password") 
// });

// router.post('/forgot-password',(req, res)=>
// {
//     const {email} = req.body;
//     User.findOne({email: email})
//         .then(user=>
//         {
//             if(user)
//             {
//                 const new_password = generator.generate({
//                     length: 8,
//                     numbers: true,
//                     symbols: '!@#$%^&*()-_=+\\[]{};:/?/><',//! @ # \$ % ^ & * ( ) - _ = + \ | [ ] { } ; : / ? . > \<
//                     lowercase: true,
//                     uppercase: true,
//                     strict: true,
//                 });



//                 User.updateOne({userId: user._id}, {password: new_password});
//                 console.log('user password has been reset! new password:' + new_password);

//                 const text = `Hi ${user.firstName}!\n\
//                             We heard that you forgot your password to our site...\n\
//                             This is your new password: ${new_password}`;
//                 try
//                 {
//                     sendEmail(email, text);
//                 }
//                 catch(e)
//                 {
//                     console.log(e);
//                 }
                
//                 // TODO STAV *************************************************
//             }
//             else
//             {
//                 req.flash('error_msg', 'This username doesn\'t exist');
//                 res.render('forgot-password',{
//                     email: email
//                 });
//             }
//         });
// });

// module.exports = router;
