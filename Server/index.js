var gamelogic =require('./gamelogic');
let passwordHash =require('password-hash'); 
const dbModule = require("./db");
let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let bodyParser = require('body-parser');
const cors = require('cors');


app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json()); 
app.use(cors());

let db;

var gameCollection=[];

const msgTypes={
    Message:"message",
    Connection:"connection",
    Disconnect:"disconnect",
    Game:"game",
    Matchmaking:"matchmaking",
    PlayerLeft:"playerleft",
    Auth:"auth"
}
const outMsgType={
    ErrorMessage :"error",
    CancelGame :"cancel",
    UpdateGameList:"updateGameList",
    GameRoom:"gameRoom",
    InvalidMove:"invalidMove",
    GameOver:"gameOver",
    UpdateGameBoard:"updateGameBoard",
    Winner:"winner"
};
const inMsgType={
    InitPlayer:"initPlayer",
    PlayMove:"playMove",
    JoinGame:"joinGame",
    CreateGame:"createGame",
    EndGame:"endGame",
    InitRooms:"initGameRooms",

};
const mmRoom="mmRoom";
let gameRooms=[];

dbModule.initDb.then(() => {
    db=dbModule.getDb();
    http.listen(5000, () => {
        console.log("Listening on port " + 5000 + "...");
    });
}, () => {console.log("Failed to connect to DB!")});

//LOGIN

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
    console.log(req.body);
    let username = req.body.username;
    let firstname = req.body.firstname;
    let surname = req.body.surname;
    let pw1 = req.body.password1;
  
    if(!username.match("^[A-z0-9]+$")) {
        res.status(401).json({ status:401, message: "invalid username" });
    }else if (!firstname.match("^[A-z]+$") ||!surname.match("^[A-z]+$")){
        res.status(401).json({ status:401, message: "invalid name" });
    }else {
    console.log("Valid Inputs!"); 
    let pw=passwordHash.generate(pw1);
    console.log(pw);
    let tmp="INSERT INTO `logindaten`(`username`, `vorname`, `nachname`, `passwort`) VALUES ('"+username+"','"+firstname+"','"+surname+"','"+pw+"')";
    console.log(tmp);
    db.query(tmp, function (err, result, fields) {
        if (err) { res.status(400).json({ status:400, message: err.message });
                 } else {
                     res.status(200).json({status:200, message: "user inserted"});
                 }
    });
}  //} }
}
);


//SOCKET

io.on(msgTypes.Connection, (socket) => {
    console.log("User connected");
    socket.join(mmRoom);
    socket.username="";
    socket.on(msgTypes.Disconnect, function(){
        console.log('user disconnected'+socket.username);
       Object.keys(io.sockets.adapter.rooms).forEach(function(room){
            if(room!=mmRoom)io.to(room).emit(outMsgType.CancelGame,'a Player left');
        });
    });
    /*
    socket.on(msgTypes.Message, function(message) {
        console.log("Message Received: " + message);
        socket.emit(InMsgType.Message, message);    
    });*/

    socket.on(msgTypes.PlayerLeft,function(msg){
        console.log("PlayerLeft:"+msg.room);
        let index=getGameIndex(msg.room);
        if(index!==null){
          gameRooms.splice(index,1);
          updateGameListEmit('remove',msg.room);
        }
        leaveRooms(socket);  
        socket.join(mmRoom);
    });
    socket.on(msgTypes.Matchmaking, function(msg){
        checkAuth(socket,msg.auth).then(function resolve(){
            console.log(msg);
            if(msg.type===inMsgType.InitRooms){
                initRooms(socket);
            }else if(msg.type===inMsgType.CreateGame){
                createGame(socket);
            }else if(msg.type===inMsgType.JoinGame){
                joinGame(socket,msg.room);
            }else{
                console.log("Matchmaking:Unknown Command Type");
                    let tmpMsgObj={
                        type:outMsgType.ErrorMessage,
                        msg:"unknown matchmaking command: "+msg.type
                    }
                    socket.emit(msgTypes.Matchmaking,tmpMsgObj);
            }
        },function reject(result){
            console.log(result);
            socket.disconnect();
        });
    });
    socket.on(msgTypes.Game, function(msg){    
        checkAuth(socket,msg.auth).then(function resolve(){
            console.log(msg);
            if(msg.type===inMsgType.InitPlayer){
                initPlayer(socket,msg.room);
            }else if(msg.type===inMsgType.EndGame){
                endGame(socket);
            }else if(msg.type===inMsgType.PlayMove){
                playMove(socket,msg);
            }else{
                console.log("Game:Unknown Command Type");
                let tmpMsgObj={
                    type:outMsgType.ErrorMessage,
                    msg:"unknown game command: "+msg.type
                }
                socket.emit(msgTypes.Game,tmpMsgObj);
            }
        },function reject(result){
            console.log(result);
            socket.disconnect();
        });
    }); 
});


//Auth-Function
function checkAuth(socket,authJSON){
    return new Promise(function(resolve,reject){
        let auth=JSON.parse(authJSON);
        if(!/^[a-zA-Z0-9]+$/.test(auth.username + "")) {
            reject("Invalid Input");
        }else {
            let tmp="SELECT token FROM token where username='" + auth.username + "';";
            console.log(tmp);
            db.query(tmp, function (err, result) {
                if (err || result === undefined) {
                    reject("Not Found in DB");
                }else if( result.length == 0  ) {
                    reject("No result");
            } else if(result[0].token===auth.token){
                    socket.username=auth.username;
                    resolve();
            }else{
                reject("Unknown Error");
            }
            });  
        }
    });
}

//Matchmaking Message Functions
function initRooms(socket){
    console.log("Init Rooms");
    let tmpMsgObj= {
        type:outMsgType.UpdateGameList,
        command:"init",
        room:gameRooms  
    }    
    socket.emit(msgTypes.Matchmaking,tmpMsgObj); 
}

function createGame(socket){
    leaveRooms(socket);
    let newRoom=socket.username;
    gameRooms.push(newRoom);
    socket.join(newRoom);
    console.log("createGameRoom: "+newRoom);
    socket.playerid=1;
    let tmpMsgObj= {
        type:outMsgType.GameRoom,
        room:newRoom
    }
    socket.emit(msgTypes.Matchmaking,tmpMsgObj);  
    gameCollection.push(new Game(newRoom,socket.username));
    updateGameListEmit('add',newRoom);
}
function joinGame(socket,room){
    console.log("join gameroom: "+room);
    //Join GameRoom (if 1 player is in it)
    console.log(io.sockets.adapter.rooms[room]);
    if(io.sockets.adapter.rooms[room]===undefined){
        gameRooms.splice(getGameIndex(room),1);
        updateGameListEmit('remove',room);
    }else if(Object.keys(io.sockets.adapter.rooms[room].sockets).length==1){
        //Leave ALL rooms (except the standard room)
        leaveRooms(socket);
        socket.join(room);
        socket.playerid=2;
        let tmpMsgObj={
            type:outMsgType.GameRoom,
            room: room
        };
        socket.emit(msgTypes.Matchmaking,tmpMsgObj);
        gameRooms.splice( gameRooms.indexOf(room), 1 );
        updateGameListEmit('remove',room)
        
    }else{
        let tmpMsgObj={
            type:outMsgType.ErrorMessage,
            msg: "invalidRoomSelected"
        };
        socket.emit(msgTypes.Matchmaking,tmpMsgObj);
    }
}

//Game Message Functions
function initPlayer(socket,room){
    console.log("Init Player for room "+room);
    if(socket.rooms[room]!==undefined){
        let tmpMsgObj={
            type:inMsgType.InitPlayer,
            playerid:socket.playerid 
        };
        socket.emit(msgTypes.Game,tmpMsgObj);
    }else{
        let tmpMsgObj={
            type:outMsgType.ErrorMessage,
            msg:"Failed to InitPlayer"
        };
        socket.emit(msgTypes.Game,tmpMsgObj);
    }
}
function endGame(socket,room){
    console.log("Finishing Game"+room);
    leaveRooms(socket);
    socket.join(mmRoom);
}
function playMove(socket,msg){
    if(Object.keys(socket.rooms).includes(msg.room) && Object.keys(io.sockets.adapter.rooms[msg.room].sockets).length==2){
        gameIndex=getGameIndex(msg.room);
        if(socket.username!=gameCollection[gameIndex].lastPlayed){
            //GAMELOGIC
            let row=gamelogic.validateInput(gameCollection[gameIndex].gameboard,msg.col);
            if(row<0){
                let tmpMsgObj={
                    type:outMsgType.InvalidMove,
                    msg:'invalid move'
                }
                socket.emit(msgTypes.Game,tmpMsgObj);
            }else{ 
                let tmp=gamelogic.checkForWin(gameCollection[gameIndex].gameboard,row,msg.col,socket.playerid);
                if(tmp!=1){
                    console.log("VALID MOVE");
                    gameCollection[gameIndex].gameboard[row][msg.col]=socket.playerid;
                    let tmpMsgObj={
                        type:outMsgType.UpdateGameBoard,
                        lastPlayer:socket.playerid,
                        gameBoard:gameCollection[gameIndex].gameboard
                    }
                    io.to(msg.room).emit(msgTypes.Game,tmpMsgObj);
                    gameCollection[gameIndex].lastPlayed=socket.username;
                }else{
                    console.log("Game Won by:"+socket.username+" in room:"+msg.room);
                    let tmpMsgObj={
                        type:outMsgType.Winner,
                        playerid:socket.playerid
                    }
                    io.to(msg.room).emit(msgTypes.Game,tmpMsgObj);
                    socket.leave(msg.room);
                    removeGame(msg.room);
                    socket.join(mmRoom);
                }
            }
            
        }else{
            console.log("NOT YOUR TURN!");
            let tmpMsgObj={
                type:outMsgType.InvalidMove,
                msg:'not your turn'
            }
            socket.emit(msgTypes.Game,tmpMsgObj);
        }
    }else{
        let tmpMsgObj={
            type:outMsgType.ErrorMessage,
            msg:'not a proper gameroom'
        }
        socket.emit(msgTypes.Game,tmpMsgObj);
    }

}

//GameHelper Functions and Class
/*function createUniqueRoom(){
    let tmp=''+Math.floor(Math.random()*900+101);
    if(gameRooms.includes(tmp)){
        tmp=createUniqueRoom();
    }
    return tmp;
}*/
function leaveRooms(socket){
    tmp=Object.values(socket.rooms);
    if(tmp.length> 1){
        tmp.forEach(function(room){
            // For each room the user is in (-standard)
            if(room== mmRoom){
                socket.leave(mmRoom);
            } if(room != socket.id){
                socket.leave(room);
                removeGame(room);
                let tmpMsgObj= {
                    type:outMsgType.CancelGame,
                    msg:"Enemy left"
                }
                io.to(room).emit(msgTypes.Game,tmpMsgObj);
            }
          });
    }
}
function updateGameListEmit(com,room){
    console.log("updategamelist: "+com+" "+room);
    let tmpMsgObj={
        type:outMsgType.UpdateGameList,
        command:com,
        room:room
    }
    io.to(mmRoom).emit(msgTypes.Matchmaking,tmpMsgObj);
}
function removeGame(room){
    for(g of gameCollection){
        if(g.roomid==room){
            gameCollection.splice(gameCollection.indexOf(g), 1);
            break;
        }
    }
}
function getGameIndex(room){
    for(let i=0;i<gameCollection.length;i++){
        if(gameCollection[i].roomid==room){
            return i;
        }
    }
    return null;
}
class Game{
    constructor(rid,lp){
        this.roomid=rid;
        this.gameboard=[
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0]];
        this.lastPlayed=lp;
    }
}