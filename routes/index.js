const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../utils/authenticat");

const Treatments = require("../models/treatmentScheme");

router.get('/', (req, res) => {
    res.render('login');
});

router.post("/tables", ensureAuthenticated, (req, res) => {
  Treatments.find({}, (err, treatments) => {
    res.render('tables', {
      treatmentList: treatments,
    });
  });
});

router.get('/aboutUs', ensureAuthenticated, (req, res)=>{ //******* */
  res.render('aboutUs')
});

router.get('/PageNotFound', (req, res)=>{
  res.render('404');
});

// router.get("*", (req, res)=>
// {
//   res.render('404');
// });


module.exports = router;
