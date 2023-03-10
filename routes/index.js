const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const request = require('request');
const generatorNumber = require('generate-serial-number');
const { checkAuthenticated } = require("../utils/authenticat");
const generator = require('generate-password');
const { sendEmail } = require("../utils/sendEmail");

const User = require("../models/userScheme.js");
const Treatment = require("../models/treatmentScheme");


router.get('/', checkAuthenticated, (req, res) => {
  const user = req.user;
  Treatment.find({ userId: user._id }, (err, treatments) => {
    res.redirect("/tables");
  });
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
  // var secret_key = "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe"; //test recaptcha secret key
  var url = "https://www.google.com/recaptcha/api/siteverify?secret=" + secret_key + "&response=" + req.body.captcha + "&remoteip=" + req.connection.remoteAddress;

  request(url, async(error, response, body) => {
    body = JSON.parse(body);
    console.log("checking recaptcha");
    if (body.success !== undefined && !body.success) //unsuccessful
    {
      console.log("unsuccessful recaptha");
      res.redirect('/login');
    }
    else {
      User.findOne({ email: email })
        .then((user) => {
          if (user) //already exist
          {
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
                    console.log('user created');
                    try {
                      console.log("try block entered.")
                      var subject = "Welcome to Car-Maintenance-Buddy!";
                      var text = "Your account has been successfuly set. You may now log into your dashboard.";
                      if (!sendEmail(email, subject, text)) {
                        throw new Error;
                      }
                    }
                    catch (e) {
                      console.log(e);
                    }
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
    }
    else {
      console.log("checking user");
      passport.authenticate('local', {
        successRedirect: '/tables',
        failureRedirect: '/login',
        failureFlash: true,
        rememberMe: true
      })(req, res, next);
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


// sending email to forget-password page 
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

        var subject = `Your Password in Car Maintenace Buddy website`;
        const text = `Hi ${user.firstName}!\n\
                            We heard that you forgot your password to our site...\n\
                            This is your new password: ${new_password}`;
        try {
          if (sendEmail(email, subject, text)) {
            res.json({
              status: 'success',
              msg: 'The new password is in your email'
            });
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
      else { //user is not registered
        res.json({
          status: 'error',
          msg: 'Unknown email'
        });
      }
    });
});

module.exports = router;
