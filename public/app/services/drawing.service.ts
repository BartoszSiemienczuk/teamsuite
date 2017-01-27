import {Injectable, AfterViewInit}     from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { UserService } from './user.service';

import * as ioClient from 'socket.io-client';

@Injectable()
export class DrawingService {
    private socket;
    private room:string;

    constructor(private userService: UserService) { }

    getObservable(){
        return new Observable(observer => {
            console.log("Connecting to drawing socket");
            this.socket = ioClient.connect("/sockets/drawing");
            var usr: any = this.userService.userData;
            usr.room = "room_" + this.userService.activeTeam._id;
            console.log("Emitting login with usr=", usr);
            this.socket.emit("login", usr);
            this.room = usr.room;

            this.socket.on('draw', (drawData: any) => {
                observer.next({messageType: "draw", messageObject: drawData});
            });

            this.socket.on('clear', (drawData: any) => {
                observer.next({messageType: "clear", messageObject: drawData});
            });

            this.socket.on('userlist', (messageObject: any) => {
                observer.next({messageType: "userlist", messageObject: messageObject});
            });

            return () => {
                this.socket.emit("logout", this.userService.userData);
                this.socket.disconnect();
            };
        });
    };

    public sendDrawing(fromx, fromy, tox, toy, color, thickness){
        this.socket.emit("drawing", {
            fromx:fromx,
            fromy:fromy,
            tox:tox,
            toy:toy,
            color:color,
            thickness:thickness,
            room:"room_" + this.userService.activeTeam._id
        });
    }

    public sendClear(){
        this.socket.emit("clear", {room:"room_" + this.userService.activeTeam._id});
    }
}