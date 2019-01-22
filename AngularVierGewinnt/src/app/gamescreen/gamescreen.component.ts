import { Component, OnInit, OnDestroy } from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router"
import { InMsgType, MessageObject, OutMsgType, MsgTypes } from 'src/environments/environment';
import {WebsocketService as wss} from '../web-socket.service';

@Component({
  selector: 'app-gamescreen',
  templateUrl: './gamescreen.component.html',
  styleUrls: ['./gamescreen.component.css']
})
export class GamescreenComponent implements OnInit, OnDestroy{
  gameRoom;
  gamemessage="";
  player={
    id: 0,
    colour:"unknown"
  }
  sub;
  gameBoard=[
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0]
    ];
    gms={
      fullColumn:"Chose another column, this one is full!",
      invalidMove:"This Move was NOT allowed! Try again!"
    }
  constructor(private webservice: wss, private router: Router,private route: ActivatedRoute) {
    this.sub=this.webservice.onEvent(MsgTypes.Game).subscribe((msg)=>{
      console.log(msg);
      switch(msg.type){
         case InMsgType.Winner:{
           //ALERT (PLAYER x WON!) POPUP MIT Ok-> zu Matchmaking
           this.gamemessage="Player "+ msg.playerid +" is the WINNER!";
           break;
         }case InMsgType.CancelGame:{
            //ALERT (ENEMY LEFT!)POPUP MIT Ok-> zu Matchmaking
            break;
         }
         case InMsgType.UpdateGameBoard:{
           this.gameBoard=msg.gameBoard;
           break;
         }
         case InMsgType.InvalidMove:{
           this.gamemessage=msg.msg;
           break;
         }
         case InMsgType.InitPlayer:{
           this.player.id=msg.playerid;
           if(this.player.id==1){
             this.player.colour="blue";
           }else{
             this.player.colour="red";
           }
           break;
         }case InMsgType.ErrorMessage:{
           this.gamemessage="Error: "+msg.msg;
         }
         default:{
           this.gamemessage="unknown command:"+msg.type;
         }
        }
    });
  }
  ngOnDestroy(){
    this.sub.unsubscribe();
    let tmpMsgObj={
      type:OutMsgType.EndGame,
      room:this.gameRoom
    }
    this.webservice.sendMsg(new MessageObject(MsgTypes.PlayerLeft,tmpMsgObj));
  }
  ngOnInit() {
    
    this.gameRoom=this.route.snapshot.paramMap.get('gameId');
    //send gameinit to request player number(1/2)
    let tmpMsgObj={
      type:InMsgType.InitPlayer,
      room:this.gameRoom
    }
    this.webservice.sendMsg(new MessageObject(MsgTypes.Game,tmpMsgObj));
  }
  public getColor(player: number): string{
    switch(player) { 
      case 1: { 
         return "blue";
      } 
      case 2: { 
         return "red";
      } 
      default: { 
         return "white";
      }
    }
  }
 
 public cellClicked(col){
   this.gamemessage="";
   for(let i=this.gameBoard.length-1;i>=0;i--){
    if(this.gameBoard[1][col] ==0){
      let tmpMsgObj={
        type:OutMsgType.PlayMove,
        room:this.gameRoom,
        col:col
      }
     this.webservice.sendMsg(new MessageObject(MsgTypes.Game,tmpMsgObj));
     break;
     }else{
       this.gamemessage=this.gms.fullColumn;
     }
   }
 }

}
