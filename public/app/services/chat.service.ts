import {Injectable}     from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {UserService} from './user.service';

import * as ioClient from 'socket.io-client';

@Injectable()
export class ChatService {
    private socket;
    private uploaderSocket;
    private room: string;

    constructor(private userService: UserService) {
    }

    sendMessage(messageObject) {
        messageObject.user = this.userService.userData._id;
        messageObject.room = this.room;
        this.socket.emit('message', messageObject);
    }

    getChatObservable() {
        this.userService.refreshUserData();
        let observe = new Observable(observer => {
            this.socket = ioClient.connect("/sockets/chat");
            var usr: any = this.userService.userData;
            if(this.userService.activeTeam==null){
                alert("You need to be assigned to a team to use chat service.");
                return null;
            }
            usr.room = "room_" + this.userService.activeTeam._id;
            this.socket.emit("login", usr);
            this.room = usr.room;

            this.socket.on('message', (messageObject: any) => {
                observer.next({messageType: "message", messageObject: messageObject});
            });

            this.socket.on('userlist', (messageObject: any) => {
                observer.next({messageType: "userlist", messageObject: messageObject});
            });

            return () => {
                this.socket.emit("logout", this.userService.userData);
                this.socket.disconnect();
            };
        });
        return observe;
    };

    public openUploaderSocket() {

    }

    public uploadFile(fileInput: any) {

    }

    getSocket() {
        return this.socket;
    }

}