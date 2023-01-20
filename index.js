var express = require("express");
var bodyParser = require('body-parser');
const {MongoClient} = require('mongodb');
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
var path = require('path');

var app = express();

require("./utils/passport")(passport);
 
// var authenticateController=require('./controllers/authenticate-controller');
// var registerController=require('./controllers/register-controller');

app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

async function main() {
/**
 * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
 * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
 */
const uri = "mongodb+srv://Ethan:clientserver2023@cluster0.fnkzteb.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);
try {
   await client.connect();

   //await listDatabases(client);

//    await createListing(client,
//       {
//           name: "Lovely Loft",
//           summary: "A charming loft in Paris",
//           bedrooms: 1,
//           bathrooms: 1
//       }
//   );

//   await findOneListingByName(client, "Lovely Loft");

} catch (e) {
console.error(e);
}
finally {
   await client.close();
}
}



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//app.use(bodyParser.urlencoded({ extended: true }));
//app.use(express.static(__dirname + '/public'));
//app.use(express.static(__dirname + '/css'));

//app.use(express.static('css'));
//app.use(express.static('html'));
app.use('/static', express.static('./'));


// app.get('/', function (req, res) {  
//    res.sendFile( __dirname + "/" + "login.html" );  
// })  

// app.get('/register', function (req, res) {  
//    res.sendFile( __dirname + "/" + "register.html" );  
// }) 

// app.get('/forgot-password', function (req, res) {  
//    res.sendFile( __dirname + "/" + "forgot-password.html" );  
// }) 

//Routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));
app.use("/treatments", require("./routes/treatments"));


app.use(session({
   secret: 'secret',
   resave: true,
   saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// Page Not Found
// app.get('*', (req, res)=> {
//    res.status(404).redirect('/404');
//  });
 
/* route to handle login and registration */
// app.post('/api/register',registerController.register);
// app.post('/api/authenticate',authenticateController.authenticate);
 
// console.log(authenticateController);
// app.post('/controllers/register-controller', registerController.register);
// app.post('/controllers/authenticate-controller', authenticateController.authenticate);


// Export the Express API
module.exports = app;

const PORT = 8012;

app.listen(PORT, ()=>
   {
      console.log('Server is listening to port ' + PORT)
   });