const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const request = require('request');
const { checkAuthenticated } = require("../utils/authenticat");

const User = require("../models/userScheme.js");
const Treatment = require("../models/treatmentScheme");

router.get('/', (req, res) => {
  res.render('login.ejs');
});

router.get("/login", (req, res) => {
  res.render("login.ejs")
});

router.get("/register", (req, res) => {
  res.render("register.ejs")
});

router.get("/forget-password", (req, res) => {
  res.render("forget-password.html")
});

router.get('/aboutUs', checkAuthenticated, (req, res) => {
  res.render('aboutUs', {
    name: req.user.firstName
  });
});


// Show treatments
router.get("/tables", checkAuthenticated, (req, res) => {
  const user = req.user;
  Treatment.find({ userId: user._id }, (err, treatments) => {
    res.render("tables.ejs", {
      //name: req.user.firstName,
      treatmentList: treatments,
    });
  });
});

router.get('/PageNotFound', (req, res) => {
  res.render('404');
});

// router.get("*", (req, res)=>
// {
//   res.render('404');
// });

router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password, recaptcha } = req.body;
  var secret_key = "6Lc37tYjAAAAAIvA_p5mO6RbN-8Y0q2f6YNb2A6X"; // real secret key
  //var secret_key = "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe"; //test recaptcha secret key
  var url = "https://www.google.com/recaptcha/api/siteverify?secret=" + secret_key + "&response=" + req.body.captcha + "&remoteip=" + req.connection.remoteAddress;

  request(url, (error, response, body) => {
    //body = JSON.parse(body);
    console.log("checking recaptcha");
    if (body.success !== undefined && !body.success) //unsuccessful
    {
      console.log("did'nt success");
      res.redirect('/login');
      //return res.json({ "success": false, "msg": "failed captcha verification" });
    }
    else {
      User.findOne({ email: email })
        .then((user) => {
          if (user) //already exist
          {
            req.flash('error_msg', 'This username already exists');
            console.log('user exists');
            res.redirect('/register');
          }
          else {
            const newUser = new User({
              firstName,
              lastName,
              email,
              password,
            });

            bcrypt.genSalt(10, (err, salt) =>
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser.save()
                  .then((user) => {
                    req.flash("success_msg", "You are now registered");
                    console.log('success');
                    res.redirect("/login");
                  })
                  .catch((err) => console.log(err));
              })
            );
          }
        })
        .catch();
    }
  });
});

router.post('/login', async (req, res, next) => {
  var secret_key = "6Lc37tYjAAAAAIvA_p5mO6RbN-8Y0q2f6YNb2A6X"; // real secret key
  //var secret_key = "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe"; //test recaptcha secret key
  var url = "https://www.google.com/recaptcha/api/siteverify?secret=" + secret_key + "&response=" + req.body.captcha + "&remoteip=" + req.connection.remoteAddress;

  request(url, (error, response, body) => {
    body = JSON.parse(body);
    console.log("checking recaptcha");
    if (body.success !== undefined && !body.success) //unsuccessful
    {
      console.log("did'nt success");
      res.redirect('/login');
      //return res.json({ "success": false, "msg": "failed captcha verification" });
    }
    else {
      console.log("checking user");
      passport.authenticate('local', {
        successRedirect: '/tables',
        failureRedirect: '/login',
        failureFlash: true
      })(req, res, next);
      //return res.json({ "success": true, "msg": "captcha passed" });
    }
  });
});

router.get("/logout", (req, res) => {
  req.logOut();
  req.flash("success_msg", "You are logged out");
  res.redirect("/users/login");
});

// router.post("/tables", checkAuthenticated, (req, res) => { //*************** */
//   Treatments.find({}, (err, treatments) => {
//     res.render('tables', {
//       treatmentList: treatments,
//     });
//   });
// });


// sending email to forger-password page
var generator = require('generate-password');
const nodemailer = require("nodemailer");
const mail_username = "car_maintanance_buddy@yahoo.com";
const mail_password = "clientserver2023";

async function sendEmail(email, text) {
  try {
    const transporter = nodemailer.createTransport({
      service: "Yahoo",
      auth: {
        user: mail_username,
        pass: mail_password,
      },
      secure: false,
    });
    await transporter.sendMail({
      from: mail_username,
      to: email,
      subject: `Your Password in Car Maintenace Buddy website`,
      text: text,
    });
    console.log("email sent sucessfully");
  }
  catch (error) {
    console.log(error, "email not sent");
  }
};

router.post('/forgot-password', (req, res) => {
  const email = req.body.email;
  User.findOne({ email: email })
    .then(user => {
      if (user) {
        const new_password = generator.generate({
          length: 8,
          numbers: true,
          symbols: '!@#$%^&*()-_=+\\[]{};:/?/><',//! @ # \$ % ^ & * ( ) - _ = + \ | [ ] { } ; : / ? . > \<
          lowercase: true,
          uppercase: true,
          strict: true,
        });

        //encrypt password

        User.updateOne({ userId: user._id }, { password: new_password });
        console.log('user password has been reset! new password:' + new_password);

        const text = `Hi ${user.firstName}!\n\
                            We heard that you forgot your password to our site...\n\
                            This is your new password: ${new_password}`;
        try {
          /*await*/ sendEmail(email, text);
          res.json({
            status: 'success',
            msg: 'The new password is in your email'
          });
        }
        catch (e) {
          console.log(e);
          res.json({
            status: 'error',
            msg: 'failed to send email'
          });
        }

        // TODO STAV *************************************************
      }
      else {
        //req.flash('error_msg', 'Unknown email');
        res.json({
          status: 'error',
          msg: 'Unknown email'
        });
        res.render('forgot-password', {
          email: email
        });
      }
    });
});

module.exports = router;
