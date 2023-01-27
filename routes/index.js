const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const request = require('request');
const generatorNumber = require('generate-serial-number');
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

router.get("/forgot-password", (req, res) => {
  res.render("forgot-password.ejs")
});

router.get('/about-us', checkAuthenticated, (req, res) => {
  res.render('about-us.ejs', {
    name: req.user.firstName
  });
});

router.get("/tables", checkAuthenticated, (req, res) => {
  const user = req.user;
  Treatment.find({ userId: user._id }, (err, treatments) => {
    res.render("tables.ejs", {
      name: req.user.firstName,
      treatmentList: treatments,
    });
  });
});

router.get("*", (req, res) => {
  res.render('404.ejs');
});

router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password, recaptcha } = req.body;
  var secret_key = "6Lc37tYjAAAAAIvA_p5mO6RbN-8Y0q2f6YNb2A6X"; // real secret key
  //var secret_key = "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe"; //test recaptcha secret key
  var url = "https://www.google.com/recaptcha/api/siteverify?secret=" + secret_key + "&response=" + req.body.captcha + "&remoteip=" + req.connection.remoteAddress;

  request(url, (error, response, body) => {
    body = JSON.parse(body);
    console.log("checking recaptcha");
    if (body.success !== undefined && !body.success) //unsuccessful
    {
      console.log("unsuccessful recaptha");
      res.redirect('/login');
      //return res.json({ "success": false, "msg": "failed captcha verification" });
    }
    else {
      User.findOne({ email: email })
        .then((user) => {
          if (user) //already exist
          {
            //req.flash('error_msg', 'This email already exists');
            //res.text( 'This username already exists' );
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
                    //req.flash("success_msg", "You are now registered");
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
  // var secret_key = "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe"; //test recaptcha secret key
  var url = "https://www.google.com/recaptcha/api/siteverify?secret=" + secret_key + "&response=" + req.body.captcha + "&remoteip=" + req.connection.remoteAddress;

  request(url, (error, response, body) => {
    body = JSON.parse(body);
    console.log("checking recaptcha");
    if (body.success !== undefined && !body.success) //unsuccessful
    {
      console.log("unsuccessful recaptha");
      res.redirect('/login');
      //return res.json({ "success": false, "msg": "failed captcha verification" });
    }
    else {
      console.log("checking user");
      passport.authenticate('local', {
        successRedirect: '/tables',
        failureRedirect: '/login',
        failureFlash: true,
        rememberMe: true
      })(req, res, next);
      //return res.json({ "success": true, "msg": "captcha passed" });
    }
  });
});

router.post("/logout", (req, res, next) => {
  req.logOut((err) => {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

router.post("/addTreatment", (req, res) => {
  const { treatmentID, treatmentInfo, treatmentDate, workerEmail, carNumber } = req.body;
  const user = req.user;
  var id = generatorNumber.generate(4);

  const treatment = new Treatment({
    treatmentNumber: id,
    treatmentInfo: treatmentInfo,
    treatmentDate: treatmentDate.replace('T', ' '),
    workerEmail: workerEmail,
    carNumber: carNumber,
    userId: user._id,
  });

  treatment.save()
    .then(() => {
      res.redirect('/tables');
    })
    .catch(err => {
      console.log(err)
    });
});

router.post("/removeTreatment", (req, res) => {
  const id = req.body.treatmentID;
  Treatment.findByIdAndDelete(id)
    .then(() => {
      res.redirect('/tables');
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/editTreatment", (req, res) => {
  const { treatmentID, treatmentInfo, treatmentDate, workerEmail, carNumber } = req.body;
  const data = { treatmentInfo: treatmentInfo, treatmentDate: treatmentDate, workerEmail: workerEmail, carNumber: carNumber };
  Treatment.findByIdAndUpdate(treatmentID, data, { useFindAndModify: false })
    .then(() => {
      res.redirect('/tables');
    })
    .catch((err) => {
      console.log(err);
    });
});


// sending email to forger-password page
const dotenv = require("dotenv");
var generator = require('generate-password');
const nodemailer = require("nodemailer");
const { emit } = require("../models/userScheme.js");
dotenv.config();
const mail_username = "car-maintenance-buddy@outlook.com";
const mail_password = "clientserver2023";

async function sendEmail(email, text) {
  try {
    const transporter = await nodemailer.createTransport({
      service: "outlook",
      host: 'smtp.office365.com',
      port: 587,
      auth: {
        user: mail_username,
        pass: mail_password
      },
      secure: false,
      logger: false
    });

    await new Promise((resolve, reject) => {
      // verify connection configuration
      transporter.verify(function (error, success) {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          console.log("Server is ready to take our messages");
          resolve(success);
        }
      });
    });

    const mailData = {
      from: {
        name: 'Car Maintenance Buddy',
        address: mail_username,
      },
      replyTo: email,
      to: email,
      subject: `form message`,
      text: text,
      html: `${text}`,
    };

    await new Promise((resolve, reject) => {
      // send mail
      transporter.sendMail(mailData, (err, info) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          console.log(info);
          resolve(info);
        }
      });
    });

    // transporter.sendMail({
    //   from: '"Car Maintenance Buddy" <' + mail_username + '>',
    //   to: email,
    //   subject: `Your Password in Car Maintenace Buddy website`,
    //   text: text,
    //   html: '<b>Hello world </b><br> This is the first email sent with Nodemailer in Node.js' // html body
    // });
    console.log("email sent sucessfully");
    return true;
  }
  catch (error) {
    console.log(error, "email not sent");
    return false;
  }
};

function validatePassword(password) {
  var passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,})");
  return passwordRegex.test(password);
}

router.post('/forgot-password', async (req, res) => {
  const email = req.body.email;
  User.findOne({ email: email })
    .then(user => {
      let new_password;
      if (user) {
        do {
          new_password = generator.generate({
            length: 8,
            numbers: true,
            symbols: '!@#$%^&*()-_=+\\[]{};:/?/><',//! @ # \$ % ^ & * ( ) - _ = + \ | [ ] { } ; : / ? . > \<
            lowercase: true,
            uppercase: true,
          });
        } while (!validatePassword(new_password));

        //encrypt password
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(new_password, salt);

        //update new password
        User.updateOne({ _id: user._id }, { password: hash }, function (err, docs) {
          if (err) {
            console.log(err)
          }
          else {
            console.log("Updated Docs : ", docs);
          }
        });
        console.log('user password has been reset! new password:' + new_password);

        const text = `Hi ${user.firstName}!\n\
                            We heard that you forgot your password to our site...\n\
                            This is your new password: ${new_password}`;
        try {
          if (sendEmail(email, text)) {
            res.json({
              status: 'success',
              msg: 'The new password is in your email'
            });
            //res.redirect('/login');
          }
          else {
            throw new Error;
          }
        }
        catch (e) {
          console.log(e);
          res.json({
            status: 'error',
            msg: 'failed to send email'
          });
        }
      }
      else {
        //req.flash('error_msg', 'Unknown email');
        res.json({
          status: 'error',
          msg: 'Unknown email'
        });
        // res.render('forgot-password', {
        //   email: email
        // });
      }
    });
});

module.exports = router;
