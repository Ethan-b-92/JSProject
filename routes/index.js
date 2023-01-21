const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../utils/authenticat");

const Treatments = require("../models/treatmentScheme");

router.get('/', (req, res)=> {
    res.render('login.ejs');
});

router.get("/login", (req, res)=> {
  res.render("login.ejs")
});

router.get("/register", (req, res)=>
{ 
  res.render("register.ejs")
});

router.get("/forget-password", (req, res)=> 
{
  res.render("forget-password")
});

router.post("/tables", checkAuthenticated, (req, res) => { //*************** */
  Treatments.find({}, (err, treatments) => {
    res.render('tables', {
      treatmentList: treatments,
    });
  });
});

router.get('/aboutUs', checkAuthenticated, (req, res)=>{ 
  res.render('aboutUs')
});

router.get('/PageNotFound', (req, res)=>{
  res.render('404');
});

// router.get("*", (req, res)=>
// {
//   res.render('404');
// });

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

module.exports = router;
