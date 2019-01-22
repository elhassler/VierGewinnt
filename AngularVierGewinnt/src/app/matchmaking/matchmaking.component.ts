import { Component, OnInit, OnDestroy } from '@angular/core';
import {Router} from "@angular/router"
import {WebsocketService as wss} from '../web-socket.service';
import { InMsgType, MessageObject, OutMsgType,MsgTypes } from 'src/environments/environment';

@Component({
  selector: 'app-matchmaking',
  templateUrl: './matchmaking.component.html',
  styleUrls: ['./matchmaking.component.css']
})
export class MatchmakingComponent implements OnInit, OnDestroy {
  gameRooms=[];
  sub;
  constructor(private webservice: wss, private router: Router){
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
        this.sysmsg="Error: "+msg.msg;
      }
      default:{
        this.sysmsg="Invalid Message:"+msg.type;
      }
    }}
    );
   }
 
  sysmsg="";
  ngOnDestroy(){
    this.sub.unsubscribe();
  }
  ngOnInit() {
    
    let tmpObj={
      type:OutMsgType.InitRooms
    };
    this.webservice.sendMsg(new MessageObject(MsgTypes.Matchmaking,tmpObj));
  }

  joinGame(roomId){
    let tmpMsgObj={
      type:OutMsgType.JoinGame,
      room:roomId
  }
    let tmpData= new MessageObject(MsgTypes.Matchmaking,tmpMsgObj);
    this.webservice.sendMsg(tmpData);
  }

  createGameRoom(){
    let tmpObj={
      type:OutMsgType.CreateGame,
    };
    let tmpData=new MessageObject(MsgTypes.Matchmaking,tmpObj);
    this.webservice.sendMsg(tmpData);
  }
 
}
