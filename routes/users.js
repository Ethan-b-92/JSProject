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
router.post("/login", (req, res, next) => {
  const res_key = req.body["g-recaptcha-response"];
  const secret_key = "6Lc37tYjAAAAAIvA_p5mO6RbN-8Y0q2f6YNb2A6X";
  const url = "https://www.google.com/recaptcha/api/siteverify?secret=" + secret_key + "&response=" + res_key + "&remoteip=" + req.socket.remoteAddress;

  request(url, (err, response, body) => {
    body = JSON.parse(body);
    // If not success
    //if (body.success !== undefined && !body.success) 
    if(false){
      //return res.json({"responseCode" : 1,"responseDesc" : "Failed captcha verification"});
      res.redirect('/login');
      console.log('failed');
    }
    else { // success
      passport.authenticate("local", {
        successRedirect: "/tables",
        failureRedirect: "/login",
        failureFlash: true,
      })(req, res, next);
      res.json({"responseCode" : 0,"responseDesc" : "Sucess"});
    }
  });
});


module.exports = router;

