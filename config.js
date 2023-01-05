var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : "localhost",
  user     : "root",
  password : "38546785",
  database:  "jsclientserver"
});
connection.connect(function(err){
if(!err) {
    console.log("Database is connected");
} else {
    console.log("Error while connecting with database");
    console.log(err.message)
}
});
module.exports = connection; 
