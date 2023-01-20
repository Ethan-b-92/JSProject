const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../utils/authenticat");

const User = require("../models/userScheme");

const Treatment = require("../models/treatmentScheme");

// Show treatments
router.get("/tables", ensureAuthenticated, (req, res) => {
  const user = req.user;
  Treatment.find({ userId: user._id }, (err, treatments) => {
    res.render("tables", {
      name: req.user.firstName,
      treatmentList: treatments,
    });
  });
});


module.exports = router;