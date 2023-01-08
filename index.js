var express=require("express");
var bodyParser=require('body-parser');
 
//var connection = require('./config');
var app = express();
 
var authenticateController=require('./controllers/authenticate-controller');
var registerController=require('./controllers/register-controller');
 
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
 
app.get('/', function (req, res) {  
   res.sendFile( __dirname + "/" + "login.html" );  
})  

app.get('/register', function (req, res) {  
   res.sendFile( __dirname + "/" + "register.html" );  
}) 

app.get('/forgot-password', function (req, res) {  
   res.sendFile( __dirname + "/" + "forgot-password.html" );  
}) 
 
/* route to handle login and registration */
app.post('/api/register',registerController.register);
app.post('/api/authenticate',authenticateController.authenticate);
 
console.log(authenticateController);
app.post('/controllers/register-controller', registerController.register);
app.post('/controllers/authenticate-controller', authenticateController.authenticate);

// Export the Express API
module.exports = app


app.listen(8012);