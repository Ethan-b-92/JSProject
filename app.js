var express = require("express");
var bodyParser = require('body-parser');
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require('express-flash');
const passport = require("passport");
var path = require('path');
const request = require('request');

var app = express();

// DB Config
const db = require('./config/keys').MongoURI;
// Connect to Mongo
mongoose.connect(db, { useNewUrlParser: true})
.then(()=>console.log('MongoDB Connected...'))
.catch(err=>console.log(err));

require("./utils/passport")(passport);


app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(express.static(path.join(__dirname, 'public')));

app.post('/login', (req, res)=>
{
   if(req.body.captcha === undefined || req.body.captcha === '' || req.body.captcha === null) {
      return res.json({"success": false, "msg": "please select recaptcha"});
   }

   var secret_key = "6Lc37tYjAAAAAIvA_p5mO6RbN-8Y0q2f6YNb2A6X";
   var url = "https://www.google.com/recaptcha/api/siteverify?secret=" + secret_key + "&response=" + req.body.captcha + "&remoteip=" + req.connection.remoteAddress;

   request(url, (error, response, body)=> {
      body = JSON.parse(body);

      if(body.success !== undefined && !body.success) //unsuccessful
      {
            return res.json({"success": false, "msg": "failed captcha verification"}); 
      }
      return res.json({"success": true, "msg": "captcha passed"});   
   });
});
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));
app.use("/treatments", require("./routes/treatments"));

app.use(flash());
app.use(session({
   secret: 'secret',
   resave: false,
   saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Page Not Found
// app.get('*', (req, res)=> {
//    res.status(404).redirect('/404');
//  });
 

module.exports = app;

const PORT = 8012;

app.listen(PORT, ()=>
   {
      console.log('Server is listening to port ' + PORT)
   });