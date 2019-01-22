import { Component, OnInit, OnDestroy } from '@angular/core';
import {Router} from "@angular/router"

import {SocketHelperService as SHS} from '../socket-helper.service';
import {WebsocketService as wss} from '../web-socket.service';
import { InMsgType, MessageObject, OutMsgType,MsgTypes } from 'src/environments/environment';
import { subscribeOn } from 'rxjs/operators';

@Component({
  selector: 'app-matchmaking',
  templateUrl: './matchmaking.component.html',
  styleUrls: ['./matchmaking.component.css']
})
export class MatchmakingComponent implements OnInit, OnDestroy {
  gameRooms=[];
  sub;
  constructor(private webservice: wss, private router: Router){
   // this.subscribeToSocket();
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

 /* Old Variant (caused multiple subscribtions)
  private subscribeToSocket(){
    if(true){
      this.webservice.messages.subscribe(msg=> {
        if(msg.type=MsgTypes.Matchmaking){
          switch(msg.data.type){
            case InMsgType.UpdateGameList:{
              if(msg.data.command=="add"){
                  this.gameRooms.push(msg.data.room);
              }else if(msg.data.command=="remove"){
                  this.gameRooms.splice( this.gameRooms.indexOf(msg.data.room), 1 );
              }else if(msg.data.command=="init"){
                  this.gameRooms=msg.data.room;
              }
              break;
            }
            case InMsgType.GameRoom:{
              this.webservice.messages.unsubscribe();
              this.router.navigate(['/Gamescreen',msg.data.room]);
              break;
            }
            case InMsgType.ErrorMessage:{
              this.sysmsg="Error: "+msg.data.msg;
            }
            default:{
              this.sysmsg="Invalid Message:"+msg.data.type;
            }
          }
        }else{
            this.sysmsg="Wrong Messagetype:"+msg.type;
        }
      });
    }
  }*/
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
