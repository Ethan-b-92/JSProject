const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

const Treatment = require('../models/Treatment');
const User = require('../models/User');

const path = require('path');
// Welcome page
router.get('/',(req, res)=>{
    res.sendFile('login.html', {root: './public'});
});

router.get('/forgot-password',(req, res)=>{
    res.sendFile('forgot-password.html', {root: './public'});
});

router.get('/register',(req, res)=>{
    res.sendFile('register.html', {root: './public'});
});

// Dashbord page
router.get('/dashboard', ensureAuthenticated, (req, res)=>{
    Treatment.find({}, (err, treatments) =>{
        res.render('tables',{
            treatmentList: treatments
        })
    })
    
});

module.exports = router;