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
mongoose.connect(db, { useNewUrlParser: true })
   .then(() => console.log('MongoDB Connected...'))
   .catch(err => console.log(err));

require("./config/passport")(passport);


app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(express.static(path.join(__dirname, 'public')));


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


module.exports = app;

const PORT = 8012;

app.listen(PORT, () => {
   console.log('Server is listening to port ' + PORT)
});