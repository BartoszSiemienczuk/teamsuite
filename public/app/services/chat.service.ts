import { Injectable }     from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { UserService } from './user.service';

import * as ioClient from 'socket.io-client';

@Injectable()
export class ChatService {
  private socket;
  private room:string;
  
  constructor(private userService: UserService) { }
  
  sendMessage(messageObject){
    messageObject.user = this.userService.userData._id;
    messageObject.room = this.room;
    this.socket.emit('message', messageObject);    
  }
  
  getMessages(){
    let observe = new Observable( observer => {
      this.socket = ioClient.connect("http://port-8080.teamsuite-mean--siemienczukbartosz645538.codeanyapp.com/sockets/chat");
      var usr : any = this.userService.userData;
      usr.room = "room_"+this.userService.activeTeam._id;
      this.socket.emit("login", usr);
      this.room = usr.room;
      
      this.socket.on('message', (messageObject: any)=> {
        observer.next({messageType: "message", messageObject: messageObject});
      });
      
      this.socket.on('userlist', (messageObject: any)=> {
        observer.next({messageType: "userlist", messageObject: messageObject});
      });
      
      this.socket.on('debug', (obj: any)=> {
        observer.next({messageType: "debug", messageObject: obj});
      });
      
      return () => {
        this.socket.emit("logout", this.userService.userData);
        this.socket.disconnect();
      };
    })
    return observe;
  }
  
  
  
}