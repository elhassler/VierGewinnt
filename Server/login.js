
let app = require('express')();
let passwordHash =require('password-hash'); 
const dbModule = require("./db");
let db;
const cors = require('cors');

var http = require('http').Server(app);

let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(bodyParser.json()); // support json encoded bodies
app.use(cors());


app.post("/login", (req, res) => {
    console.log(req.body.username);
    
    
    let username = req.body.username;
    let pw = req.body.password;
    /*
    * validierung
    */
    db.query("SELECT passwort FROM logindaten where username='" + username + "';", function (err, result, fields) {
        console.log(result);
        if (err) {
            console.log(err);
            res.status(400).json({ status:400, message: "an error occured" });
        }else if( result === undefined  ) {
            res.status(401).json({ status:401, message: "login failed" });
        }else if( result.length == 0  ) {
            res.status(401).json({ status:401, message: "login failed" });
        }else if (pw == result[0].passwort) {
            //}else if(passwordHash.verify(pw,result[0].passwort)){
                //registrieren pw speichern:passwordHash.generate(pw);
            /* 
            * Wenn der login erfolgreich war
            * erzeugen wir eine Zufallszahl (0-999998)
            */
            let token = Math.floor(Math.random() * 999999); 
            /*
            * Diese Zufallszahl setzen wir dann als token für den user,
            * indem wir ein UPDATE-Statement auf unsere DB ausführen
            */
            db.query("INSERT INTO token (username, token) VALUES('" + username + "','" + token + "') ON DUPLICATE KEY UPDATE token ='" + token + "' ", function (err, result) {
                if (err) { res.status(400).json({ status:400, message: "an error occured" });
                 }
            });
            /*
            * schlussendlich werden Vor- und Nachname sowie token zurückgegeben
            */
            res.status(200).json({ status:200, message: "login successful", "Data":{token:token}});
        } else {
            res.status(401).json({ status:401, message: "login failed" });
        }
    });
      
});

dbModule.initDb.then(() => {
    db=dbModule.getDb();
    http.listen(5001, () => {
        console.log("Listening on port " + 5001 + "...");
    });
}, () => {console.log("Failed to connect to DB!")});