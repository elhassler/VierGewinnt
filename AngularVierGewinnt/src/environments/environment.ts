import { checkAndUpdateBinding } from '@angular/core/src/view/util';

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  ws_url: "http://localhost:5000",
};
export enum MsgTypes{
  Message="message",
  Game="game",
  Matchmaking="matchmaking",
  PlayerLeft="playerleft"
}
export enum InMsgType{
  ErrorMessage ="error",
  CancelGame ="cancel",
  UpdateGameList="updateGameList",
  GameRoom="gameRoom",
  InvalidMove="invalidMove",
  GameOver="gameOver",
  Winner="winner",
  UpdateGameBoard="updateGameBoard",
  InitPlayer="initPlayer",
}
export enum OutMsgType{
 
  PlayMove="playMove",
  JoinGame="joinGame",
  CreateGame="createGame",
  EndGame="endGame",
  InitRooms="initGameRooms",
  
}

export class MessageObject{
  type:String;
  data:Object;
  constructor(t,d){
    this.type=t;
    this.data=d;
  }
}

export function val(value){
  if (value.indexOf("<")==-1) {
    return false;
  }
  if (value.indexOf(">")==-1) {
    return false;
  }
  if (value.indexOf(";")==-1) {
    return false;
  }
  if (value.indexOf("'")==-1) {
    return false;
  }
  if (value.indexOf('"')==-1) {
    return false;
  }
  return true;
}

export var Globals = {
    loggedIn: false
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
