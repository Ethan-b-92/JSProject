// const nodemailer = require("nodemailer");
// const mail_username = "car_maintanance_buddy@yahoo.com";
// const mail_password = "clientserver2023";

// // User model
// //const Users = client.db("JSProject").collection("Users");

// const sendEmail = async (email, text)=> {
//     try {
//         const transporter = nodemailer.createTransport({
//             service: "Yahoo",
//             auth: {
//                 user: mail_username,
//                 pass: mail_password,
//             },
//         });

//         await transporter.sendMail({
//             from: mail_username,
//             to: email,
//             subject: `Your Password in Car Maintenace Buddy website`,
//             text: text,
//         });

//         console.log("email sent sucessfully");
//     } catch (error) {
//         console.log(error, "email not sent");
//     }
// };

// module.exports = sendEmail;

//     //html: `Hi ${user.name}! Here's a reminder to your password in our site... Password: ${password}`,