import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable} from 'rxjs';
import * as Rx from 'rxjs';
import { environment, InMsgType, MessageObject } from '../environments/environment';


@Injectable()
export class WebsocketService {

    private socket;

    constructor() { }
  
    connect(): Rx.Subject<MessageEvent> {

      this.socket = io(environment.ws_url);
  

      let observable = new Observable(observer => {
          //create Observers for all messageTypes
          for(let msgType of Object.values(InMsgType)){
                this.socket.on(msgType, (data) => {
                let tmpData=new MessageObject(msgType,data);
                observer.next(tmpData);
            })
            }
          return () => {
            this.socket.disconnect();
          }
      });
      
      let observer = {
          next: (msg :MessageObject) => {
              this.socket.emit(msg.type,msg.data);
          },
      };

      return Rx.Subject.create(observer, observable);
    }
  
}
  