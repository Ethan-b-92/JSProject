// const express = require("express");
// const router = express.Router();
// const { checkAuthenticated } = require("../utils/authenticat");

// const User = require("../models/userScheme");

// const Treatment = require("../models/treatmentScheme");

// // Show treatments
// router.get("/tables", checkAuthenticated, (req, res) => {
//   const user = req.user;
//   Treatment.find({ userId: user._id }, (err, treatments) => {
//     res.render("tables", {
//       name: req.user.firstName,
//       treatmentList: treatments,
//     });
//   });
// });

// router.post("/tables", checkAuthenticated, (req, res) => { //*************** */
//   Treatments.find({}, (err, treatments) => {
//     res.render('tables', {
//       treatmentList: treatments,
//     });
//   });
// });


// module.exports = router;