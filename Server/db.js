let mysql = require('mysql');

let _db;

let initDb = new Promise((resolve, reject) => {

    // make sure to import 'db_import/galleryDB.sql' into your MySQL database first
    _db = mysql.createConnection({
        host     : "localhost",
        user     : "admin",
        password : "Webtech1234@",
        database : "login"
    });

    /*
    * EX01:
    * 
    * Um die DB-Verbindung aufzustellen muss <mysql import name>.connect(...) aufgerufen werden.
    * die connect-Methode bekommt eine Methode übergeben, die im Fehlerfall die verbindung rejected (reject) und ansonsten eine Verbindung aufbaut (resolve)
    */
    _db.connect(function(err) {
        if (err) {
            /*
            * Wenn ein Fehler auftritt, wird die Verbindungsanfrage abgelehnt.
            * (Testen durch Ändern des Passwortes)
            */
           console.log("Error:"+err);
            reject();
            return;
        }
        console.log("Database is connected...");
        /*
        * Wenn kein fehler auftritt, resolven wir die Verbindungsanfrage.
        
        
        _db.query("SELECT * FROM logindaten", function(err, result){
            if(err) throw err;
            console.log(result);
        })*/
        resolve();
      });
});
   
function getDb() {
    if (!_db) {
        console.log("Db has not been initialized. Please call init first.");
        return;
    }
    return _db;
}

module.exports = {
    getDb,
    initDb
};
