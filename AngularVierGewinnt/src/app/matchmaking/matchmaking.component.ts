import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router"

import {SocketHelperService as SHS} from '../socket-helper.service';
import { InMsgType, MessageObject, OutMsgType } from 'src/environments/environment';

@Component({
  selector: 'app-matchmaking',
  templateUrl: './matchmaking.component.html',
  styleUrls: ['./matchmaking.component.css']
})
export class MatchmakingComponent implements OnInit {
  gameRooms=[];
  messages=[];
  constructor(private webservice: SHS, private router: Router){ }

  ngOnInit() {
    this.webservice.messages.subscribe(msg => {
      switch(msg.type){    
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
      case InMsgType.Message:{
        this.messages.push(msg.data);
        break;
      }
      case InMsgType.GameRoom:{
        console.log("wowowowow"+msg.data);
        this.router.navigate(['/Gamescreen',msg.data]);
        break;
      }
      default:{
        console.log(msg.type);
        console.log(msg.data);
        //do something to wrong messages
      }
     }
    });
    this.webservice.sendMsg(new MessageObject(OutMsgType.InitRooms,""));
  }

  joinGame(roomId){
    let tmpData= new MessageObject(OutMsgType.JoinGame,roomId);
    this.webservice.sendMsg(tmpData);
  }

  sendMessage() {
    let tmpData= new MessageObject(InMsgType.Message,"TESTMESSAGE");
    this.webservice.sendMsg(tmpData);
  }
  createGameRoom(){
    let tmpData=new MessageObject(OutMsgType.CreateGame,"");
    this.webservice.sendMsg(tmpData);
  }
 
}
