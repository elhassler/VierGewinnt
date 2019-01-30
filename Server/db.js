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
        */
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
