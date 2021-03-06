import { Component, OnInit, OnDestroy } from '@angular/core';
import {Router} from "@angular/router"
import {WebsocketService as wss} from '../web-socket.service';
import { InMsgType, MessageObject, OutMsgType,MsgTypes } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { MyDialogService } from '../my-dialog.service';
@Component({
  selector: 'app-matchmaking',
  templateUrl: './matchmaking.component.html',
  styleUrls: ['./matchmaking.component.css']
})
export class MatchmakingComponent implements OnInit, OnDestroy {
  gameRooms=[];
  sub;
  auth;
  constructor(private webservice: wss, private router: Router, private cookieService:CookieService,private dialog:MyDialogService){
    
   }
  
  ngOnDestroy(){
    this.sub.unsubscribe();
  }
  ngOnInit() {
    this.subToSocket();
    this.auth=JSON.parse(this.cookieService.get('auth'));
    this.webservice.sendMsg(new MessageObject(MsgTypes.Auth,this.auth));
    let tmpObj={
      auth:this.auth,
      type:OutMsgType.InitRooms
    };
    this.webservice.sendMsg(new MessageObject(MsgTypes.Matchmaking,tmpObj));
  }

  subToSocket(){
    this.sub=this.webservice.onEvent(MsgTypes.Matchmaking).subscribe((msg)=>{
      console.log(msg);
      switch(msg.type){
       case InMsgType.UpdateGameList:{
         if(msg.command=="add"){
             this.gameRooms.push(msg.room);
         }else if(msg.command=="remove"){
             this.gameRooms.splice( this.gameRooms.indexOf(msg.room), 1 );
         }else if(msg.command=="init"){
             this.gameRooms=msg.room;
         }
         break;
       }
       case InMsgType.GameRoom:{
         this.router.navigate(['/Gamescreen',msg.room]);
         break;
       }
       case InMsgType.ErrorMessage:{
         this.dialog.openInfoDialog("Error",msg.msg);
       }
       default:{
         this.dialog.openInfoDialog("Recieved Invalid Message",msg.type);
       }
     }}
     );
  }

  joinGame(roomId){
    let tmpMsgObj={
      auth:this.auth,
      type:OutMsgType.JoinGame,
      room:roomId
  }
    let tmpData= new MessageObject(MsgTypes.Matchmaking,tmpMsgObj);
    this.webservice.sendMsg(tmpData);
  }

  createGameRoom(){
    let tmpObj={
      auth:this.auth,
      type:OutMsgType.CreateGame,
    };
    let tmpData=new MessageObject(MsgTypes.Matchmaking,tmpObj);
    this.webservice.sendMsg(tmpData);
  }
 

}
