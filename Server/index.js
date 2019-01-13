var gamelogic =require('./gamelogic');

let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);

var gameCollection=[];

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
    Message:"message",
    Connection:"connection",
    Disconnect:"disconnect",
    PlayMove:"playMove",
    JoinGame:"joinGame",
    CreateGame:"createGame",
    EndGame:"endGame",
    InitRooms:"initGameRooms",

};


const mmRoom="mmRoom";
let gameRooms=[];
let wow=0;

io.on(inMsgType.Connection, (socket) => {
    socket.username=wow;
    wow++;
    console.log("hello user "+socket.username);
    socket.join(mmRoom);

    socket.on(inMsgType.Disconnect, function(){
        console.log('user disconnected');
       Object.keys(io.sockets.adapter.rooms).forEach(function(room){
            io.to(room).emit(outMsgType.CancelGame,'a Player left');
        });
    });
    socket.on(inMsgType.Message, function(message) {
        console.log("Message Received: " + message);
        socket.emit(InMsgType.Message, message);    
    });
        
    socket.on(inMsgType.InitRooms, function() {
        console.log("Init Rooms");
        let tmpObj= new Object();
        tmpObj.command="init";
        tmpObj.room=gameRooms;       
        socket.emit(outMsgType.UpdateGameList, tmpObj);    
    });
    
    socket.on(inMsgType.JoinGame,function(newRoom){
        console.log("join game: "+newRoom);
        //Leave ALL rooms (except the standard room)
        leaveRooms(socket);
        //Join GameRoom (if 1 player is in it)
        if(Object.keys(io.sockets.adapter.rooms[newRoom].sockets).length==1){
            socket.join(newRoom);
            socket.playerid=2;
            console.log("gohard");
            socket.emit(outMsgType.GameRoom, newRoom);
            gameRooms.splice( gameRooms.indexOf(newRoom), 1 );
            updateGameListEmit('remove',newRoom)
            
        }else{
            socket.emit(outMsgType.ErrorMessage, 'invalidRoomSelected');
        }
    });
    socket.on(inMsgType.CreateGame,function(){   
        leaveRooms(socket);
        let newRoom=createUniqueRoom();
        gameRooms.push(newRoom);
        socket.join(newRoom);
        console.log("createGameRoom: "+newRoom);
        socket.playerid=1;
        socket.emit(outMsgType.GameRoom, newRoom);  
        gameCollection.push(new Game(newRoom,socket.username));
        updateGameListEmit('add',newRoom);
    });

    socket.on(inMsgType.EndGame,function(gRoom){
        console.log("Finishing Game"+gRoom);
        leaveRooms(socket);
        socket.join(mmRoom);
    });

    socket.on(inMsgType.InitPlayer, function(gRoom){
        console.log("Init Player for room "+gRoom);
        if(socket.rooms[gRoom]!==undefined){
            socket.emit(inMsgType.InitPlayer,socket.playerid);
        }else{
            //send wrong room request
        }
    });

    socket.on(inMsgType.PlayMove,function(msg){
        if(Object.keys(socket.rooms).includes(msg.room) && Object.keys(io.sockets.adapter.rooms[msg.room].sockets).length==2){
            gameIndex=getGameIndex(msg.room);
            
            if(socket.username!=gameCollection[gameIndex].lastPlayed){
                //GAMELOGIC
                let row=gamelogic.validateInput(gameCollection[gameIndex].gameboard,msg.col);
                if(row<0){
                    socket.emit(outMsgType.InvalidMove, 'WRONG MOVE');
                }else{ 
                    let tmp=gamelogic.checkForWin(gameCollection[gameIndex].gameboard,row,msg.col,socket.playerid);
                    if(tmp!=1){
                        console.log("VALID MOVE");
                        gameCollection[gameIndex].gameboard[row][msg.col]=socket.playerid;
                         let tmpObj={
                            lastPlayer:socket.playerid,
                            gameBoard:gameCollection[gameIndex].gameboard,
                        }
                        io.to(msg.room).emit(outMsgType.UpdateGameBoard,tmpObj);
                        gameCollection[gameIndex].lastPlayed=socket.username;
                    }else{
                        console.log("Game Won by:"+socket.username+" in room:"+msg.room);
                        io.to(msg.room).emit(outMsgType.Winner,socket.playerid);
                        leaveRooms(socket);
                        removeGame(msg.room);
                        socket.join(mmRoom);
                    }
                }
                
            }else{
                console.log("NOT YOUR TURN!");
                socket.emit(outMsgType.InvalidMove, 'notYourTurn');
            }
        }else{
            socket.emit(outMsgType.ErrorMessage, 'noProperGameroom');
        }

    });
    
});
http.listen(5000, () => {
    console.log('started on port 5000');
});
function createUniqueRoom(){
    let tmp=''+Math.floor(Math.random()*900+101);
    if(gameRooms.includes(tmp)){
        tmp=createUniqueRoom();
    }
    return tmp;
}

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
                io.to(room).emit(outMsgType.CancelGame,room);
            }
          });
    }
}


function updateGameListEmit(com,room){
    let tmpObj=new Object();
    tmpObj.command=com;
    tmpObj.room=room;
    io.to(mmRoom).emit(outMsgType.UpdateGameList,tmpObj);
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