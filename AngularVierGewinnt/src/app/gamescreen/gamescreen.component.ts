import { Component, OnInit, OnDestroy } from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router"
import { InMsgType, MessageObject, OutMsgType, MsgTypes } from 'src/environments/environment';
import {WebsocketService as wss} from '../web-socket.service';
import { CookieService } from 'ngx-cookie-service';
import { MyDialogService } from '../my-dialog.service';

@Component({
  selector: 'app-gamescreen',
  templateUrl: './gamescreen.component.html',
  styleUrls: ['./gamescreen.component.css']
})
export class GamescreenComponent implements OnInit, OnDestroy{
  gameRoom;
  player={
    id: 0,
    colour:"unknown"
  }
  auth;
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
  constructor(private webservice: wss, private router: Router,private route: ActivatedRoute,private cookieService: CookieService,private dialog:MyDialogService ) {
   
    this.sub=this.webservice.onEvent(MsgTypes.Game).subscribe((msg)=>{
      console.log(msg);
      switch(msg.type){
         case InMsgType.Winner:{
           //ALERT (PLAYER x WON!) POPUP MIT Ok-> zu Matchmaking
           console.log(this.player.id);
           if(msg.playerid===this.player.id){
             this.dialog.gameEndDialog("Congratulation!","You won the game!");
           }else{
            this.dialog.gameEndDialog("Sorry!","You lost the game!");
           }
           
           break;
         }case InMsgType.CancelGame:{
          this.dialog.gameEndDialog("Game Over!","Your Enemy decided to quit!");
            break;
         }
         case InMsgType.UpdateGameBoard:{
           this.gameBoard=msg.gameBoard;
           break;
         }
         case InMsgType.InvalidMove:{
          this.dialog.openInfoDialog("Invalid Move!",msg.msg);
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
          this.dialog.openInfoDialog("Error:",msg.msg);
         }
         default:{
          this.dialog.openInfoDialog("Unknown command:",msg.msg);
         }
        }
    });
  }
  ngOnDestroy(){
    let tmpMsgObj={
      auth:this.auth,
      type:OutMsgType.EndGame,
      room:this.gameRoom
    }
    this.webservice.sendMsg(new MessageObject(MsgTypes.PlayerLeft,tmpMsgObj));
    this.sub.unsubscribe();
  }
  ngOnInit() {
    this.auth=JSON.parse(this.cookieService.get('auth'));
    this.gameRoom=this.route.snapshot.paramMap.get('gameId');
    //send gameinit to request player number(1/2)
    let tmpMsgObj={
      auth:this.auth,
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
    if(this.gameBoard[0][col] ==0){
      let tmpMsgObj={
        auth:this.auth,
        type:OutMsgType.PlayMove,
        room:this.gameRoom,
        col:col
      }
     this.webservice.sendMsg(new MessageObject(MsgTypes.Game,tmpMsgObj));
     }else{
      this.dialog.openInfoDialog("Invalid Move!","Column is full!");
     }
   
 }

}
