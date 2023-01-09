var express=require("express");
var bodyParser=require('body-parser');
const {MongoClient} = require('mongodb');

//var connection = require('./config');
var app = express();
 
var authenticateController=require('./controllers/authenticate-controller');
var registerController=require('./controllers/register-controller');
 
/* Database functions */
async function listDatabases(client){
   const databasesList = await client.db().admin().listDatabases();
   console.log("Databases:");
   databasesList.databases.forEach(db=>{
      console.log(`- ${db.name}`);
   })
}

async function createListing(client, newListing){
   const result = await client.db("JSProject").collection("Users").insertOne(newListing);
   console.log(`New listing created with the following id: ${result.insertedId}`);
}

async function findOneListingByName(client, nameOfListing) {
   const result = await client.db("JSProject").collection("Users").findOne({ name: nameOfListing });

   if (result) {
       console.log(`Found a listing in the collection with the name '${nameOfListing}':`);
       console.log(result);
   } else {
       console.log(`No listings found with the name '${nameOfListing}'`);
   }
}

async function main() {
/**
 * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
 * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
 */
const uri = "mongodb+srv://Ethan:clientserver2023@cluster0.fnkzteb.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);
await client.connect();
try {
   await client.connect();

   await listDatabases(client);

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

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(express.static(__dirname + '/public'));
//app.use(express.static(__dirname + '/css'));
app.use(express.static('css'));

main().catch(console.error);

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