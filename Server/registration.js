let app = require('express')();
const dbModule = require("./db");
let db;
const cors = require('cors');

var http = require('http').Server(app);

let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(bodyParser.json()); // support json encoded bodies
app.use(cors());


app.post("/registration", (req, res) => {   
    
    let username = req.body.username;
    let firstname = req.body.firstname;
    let surname = req.body.surname;
    let pw1 = req.body.password1;
    let pw2 = req.body.password2;
    /*
    * validierung
    */
    db.query("INSERT INTO `logindaten`(`username`, `vorname`, `nachname`, `passwort`) VALUES (["+username+"],["+firstname+"],["+surname+"],["+pw1+"])", function (err, result, fields) {
        console.log(result);
        
    });
      
});

dbModule.initDb.then(() => {
    db=dbModule.getDb();
    http.listen(5001, () => {
        console.log("Listening on port " + 5001 + "...");
    });
}, () => {console.log("Failed to connect to DB!")});