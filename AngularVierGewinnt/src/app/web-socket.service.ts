import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable} from 'rxjs';
import { environment, MsgTypes, MessageObject } from '../environments/environment';


@Injectable()
export class WebsocketService {

    private socket;

    constructor() {
        this.socket=io(environment.ws_url);
     }
     public onEvent(event: MsgTypes): Observable<any> {
        return new Observable<MsgTypes>(observer => {
            this.socket.on(event, (msg) => observer.next(msg));
        });
    }
    public sendMsg(msg: MessageObject): void {
        this.socket.emit(msg.type,msg.data);
    }
}
  