import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router"

import {SocketHelperService as SHS} from '../socket-helper.service';
import { InMsgType, MessageObject, OutMsgType } from 'src/environments/environment';


@Component({
  selector: 'app-gamescreen',
  templateUrl: './gamescreen.component.html',
  styleUrls: ['./gamescreen.component.css']
})
export class GamescreenComponent implements OnInit {
  gameRoom;
  gamemessage="";
  player={
    id: 0,
    colour:"unknown"
  }
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
  constructor(private webservice: SHS, private router: Router,private route: ActivatedRoute) {
    
  }
  ngOnInit() {
    this.gameRoom=this.route.snapshot.paramMap.get('gameId');
    this.webservice.messages.subscribe(msg => {
      switch(msg.type){
        case InMsgType.Winner:{
          this.gamemessage="Player "+ msg.data +" is the WINNER!";
        }
        case InMsgType.UpdateGameBoard:{
          this.gameBoard=msg.data.gameBoard;
        }
        case InMsgType.InvalidMove:{
          this.gamemessage=msg.data;
          break
        }
        case InMsgType.InitPlayer:{
          this.player.id=msg.data;
          console.log(this.player.id);
          if(this.player.id==1){
            this.player.colour="blue";
          }else{
            this.player.colour="red";
          }
          break;
        }
        default:{
          console.log(msg.type);
          console.log(msg.data);
          //do something to wrong messages
        }
     } 
    });
    //send gameinit to request player number(1/2)
    this.webservice.sendMsg(new MessageObject(InMsgType.InitPlayer,this.gameRoom));
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
   console.log(this.gameBoard[1][col]);
   for(let i=this.gameBoard.length-1;i>=0;i--){
    if(this.gameBoard[1][col] ==0){
      let tmpObj={
        room:this.gameRoom,
        col:col
      }
     this.webservice.sendMsg(new MessageObject(OutMsgType.PlayMove,tmpObj));
     break;
     }else{
       this.gamemessage=this.gms.fullColumn;
     }
   }
 }

}
