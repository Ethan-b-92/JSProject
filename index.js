var express = require("express");
var bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const path = require('path');

var app = express();

var authenticateController = require('./controllers/authenticate-controller');
var registerController = require('./controllers/register-controller');

/* Database functions */
async function listDatabases(client) {
   const databasesList = await client.db().admin().listDatabases();
   console.log("Databases:");
   databasesList.databases.forEach(db => {
      console.log(`- ${db.name}`);
   })
}

async function createListing(client, newListing) {
   const result = await client.db("JSProject").collection("Users").insertOne(newListing);
   console.log(`New listing created with the following id: ${result.insertedId}`);
}

async function findOneListingByName(client, nameOfListing) {
   const result = await client.db("JSProject").collection("Users").findOne({ username: nameOfListing });

   if (result) {
      console.log(`Found a listing in the collection with the name '${nameOfListing}':`);
      return result;
   } else {
      console.log(`No listings found with the name '${nameOfListing}'`);
   }
}

async function updateListingByUsername(client, nameOfListing, updatedListing) {
   const result = await client.db("JSProject").collection("Users")
                       .updateOne({ username: nameOfListing }, { $set: updatedListing });

   console.log(`${result.matchedCount} document(s) matched the query criteria.`);
   console.log(`${result.modifiedCount} document(s) was/were updated.`);
}

async function main() {
   /**
    * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
    * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
    */
   const uri = "mongodb+srv://Ethan:clientserver2023@cluster0.fnkzteb.mongodb.net/?retryWrites=true&w=majority";
   const client = new MongoClient(uri);
   try {
      await client.connect();

      var firstRes;
      const cursor = await client.db("JSProject").collection("Users").find(
         {password : { $exists: true, $nin: ["12345","55442"]}});
      //cursor.sort({age : -1});
      //cursor.limit(2);
      const results = await cursor.toArray();
      if (results.length == 0)
         console.log("no listings found.");
      results.forEach((result, i) => {
         console.log(result);
         firstRes = result;
      });
      await client.close();
      return firstRes;
      //console.log(s);
      //await client.db("JSProject").collection("Users").find($or [{ username: "Stav" }, {username: "Ethan"}]);
    


   } catch (e) {
      console.error(e);
   }
   finally {
      await client.close();
   }
}


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
console.log(main().catch(console.error));
main().catch(console.error);
 app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'public', "login.html"));
 })

app.get('/register', function (req, res) {
   res.sendFile(path.join(__dirname,'public', "register.html"));
})

app.get('/forgot-password', function (req, res) {
   res.sendFile(__dirname + "/" + "forgot-password.html");
})

/* route to handle login and registration */
app.post('/api/register', registerController.register);
app.post('/api/authenticate', authenticateController.authenticate);

console.log(authenticateController);
app.post('/controllers/register-controller', registerController.register);
app.post('/controllers/authenticate-controller', authenticateController.authenticate);

// Export the Express API
module.exports = app


app.listen(8012);