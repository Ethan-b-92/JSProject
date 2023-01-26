var express = require("express");
var bodyParser = require('body-parser');
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require('express-flash');
const passport = require("passport");
var path = require('path');
const request = require('request');

var app = express();

const db = require('./utils/keys').MongoURI;

mongoose.connect(db, { useNewUrlParser: true })
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err));

require('./utils/passport')(passport);

app.all('/', function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "X-Requested-With");
   next()
 });

app.use(session({
   secret: 'secret',
   resave: false,
   saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.set('views', path.join(__dirname, 'public'));
//app.set('view engine', 'ejs');
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());


app.use("/", require("./routes/index"));


module.exports = app;

const PORT = 8012;

app.listen(PORT, () => {
   console.log('Server is listening to port ' + PORT)
});