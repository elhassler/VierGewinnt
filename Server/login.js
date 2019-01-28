
let app = require('express')();
let passwordHash =require('password-hash'); 
const dbModule = require("./db");
let db;
const cors = require('cors');

var http = require('http').Server(app);

let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json()); 
app.use(cors());


app.post("/login", (req, res) => {
    console.log(req.body.username);

    let username = req.body.username;
    let pw = req.body.password;
    
    if(!/^[a-zA-Z0-9]+$/.test(username + "")) {
        res.status(401).json({ status:401, message: "invalid username" });
    }else {
        console.log("username check");

    db.query("SELECT passwort FROM logindaten where username='" + username + "';", function (err, result, fields) {
        
        if (err) {
            res.status(400).json({ status:400, message: "an error occured" });
        }else if( result === undefined  ) {
            res.status(401).json({ status:401, message: "login failed" });
        }else if( result.length == 0  ) {
            res.status(401).json({ status:401, message: "login failed" });
       } else if(passwordHash.verify(pw,result[0].passwort)){
            let token = Math.floor(Math.random() * 999999); 
            db.query("INSERT INTO token (username, token) VALUES('" + username + "','" + token + "') ON DUPLICATE KEY UPDATE token ='" + token + "' ", function (err, result) {
                if (err) { res.status(400).json({ status:400, message: "an error occured" });
                 }
            });
            res.status(200).json({ status:200, message: "login successful", "Data":{username: username, token:token}});
        } else {
            console.log(err);
            res.status(401).json({ status:401, message: "login failed" });
        }

    });
}   
});


app.post("/registration", (req, res) => {   
    
    let username = req.body.username;
    let firstname = req.body.firstname;
    let surname = req.body.surname;
    let pw1 = req.body.password1;
    let pw2 = req.body.password2;
    
    if(!/^[a-zA-Z]+$/.test(surname + "")) {
        res.status(401).json({ status:401, message: "invalid username" });
    if(!/^[a-zA-Z]+$/.test(firstname + "")) {
        res.status(401).json({ status:401, message: "invalid username" });
    if(!/^[a-zA-Z0-9]+$/.test(username + "")) {
        res.status(401).json({ status:401, message: "invalid username" });
    }else if (!/^[a-zA-Z]+$/.test(firstname + "") && !/^[a-zA-Z0-9]+$/.test(surname + "")){
        res.status(401).json({ status:401, message: "invalid username" });
    }else {
        console.log("username check"); 
    let pw=passwordHash.generate(pw1);
    let tmp="INSERT INTO `logindaten`(`username`, `vorname`, `nachname`, `passwort`) VALUES ('"+username+"','"+firstname+"','"+surname+"','"+pw+"')";
    console.log(tmp);
    db.query(tmp, function (err, result, fields) {
        if (err) { res.status(400).json({ status:400, message: err.message });
                 } else {
                     res.status(200).json({status:200, message: "user inserted"});
                 }
    });
}  } }
});

dbModule.initDb.then(() => {
    db=dbModule.getDb();
    http.listen(5000, () => {
        console.log("Listening on port " + 5000 + "...");
    });
}, () => {console.log("Failed to connect to DB!")});