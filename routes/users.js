const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const request = require('request');


const User = require("../models/userScheme.js");


router.get("/login", (req, res) => {
  res.render("login")
});

router.get("/register", (req, res) => {
  res.render("register")
});

router.get('/forget-password', (req, res) => {
  res.render('forget-password')
});

// Register handle
router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password, repassword } = req.body;
  User.findOne({ email: email })
    .then((user) => {
      if (user) //already exist
      {
        //req.flash('error_msg', 'This username already exists');
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

        // Hash Password
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
});

// Login handle
router.post('/login', async (req, res) => {
  if (req.body.captcha === undefined || req.body.captcha === '' || req.body.captcha === null) {
     return res.json({ "success": false, "msg": "please select recaptcha" });
  }

  var secret_key = "6Lc37tYjAAAAAIvA_p5mO6RbN-8Y0q2f6YNb2A6X";
  // var secret_key = "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe";
  var url = "https://www.google.com/recaptcha/api/siteverify?secret=" + secret_key + "&response=" + req.body.captcha + "&remoteip=" + req.connection.remoteAddress;

  request(url, (error, response, body) => {
     body = JSON.parse(body);

     if (body.success !== undefined && !body.success) //unsuccessful
     {
        console.log("did'nt success");
        res.redirect('/login');
        return res.json({ "success": false, "msg": "failed captcha verification" });
     }
     passport.authenticate('local', {
        successRedirect: '/tables',
        failureRedirect: '/login',
        failureFlash: true
     })(req, res, next);
     return res.json({ "success": true, "msg": "captcha passed" });
  });
});


module.exports = router;

