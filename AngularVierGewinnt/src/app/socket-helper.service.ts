import { Injectable } from '@angular/core';
import {WebsocketService} from './web-socket.service';
import { map } from 'rxjs/operators';
import { Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketHelperService {
  messages: Subject<any>;
  
  constructor(private wsService: WebsocketService) {
    this.messages = <Subject<any>>wsService
      .connect()
      .pipe(map((response: any): any => {
        return response;
      }));
   }
   sendMsg(msg) {
    this.messages.next(msg);
  }
}
