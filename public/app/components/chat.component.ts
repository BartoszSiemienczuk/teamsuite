import {Component, OnInit, OnDestroy, AfterViewInit} from '@angular/core';
import {Router} from '@angular/router';

import {ChatService} from '../services/chat.service';
import {UserService} from '../services/user.service';

@Component({
    selector: 'teamsuite-chat',
    templateUrl: '/app/views/chat/main.html'
})
export class ChatComponent implements OnInit, AfterViewInit {
    private chat;
    private socket;
    private uploader;
    private messageText: String = "";
    private messages = [];
    private userList = [];
    public showServerMessages: boolean = true;
    public uploaderEnabled = true;

    constructor(private userService: UserService, private Router: Router, private chatService: ChatService) {
    }

    sendMessage() {
        this.chatService.sendMessage({text: this.messageText});
        this.messageText = "";
    }

    ngOnInit() {
        this.chat = this.chatService.getChatObservable().subscribe((message: any) => {
            if (message.messageType == "message") {
                this.messages.push(message.messageObject);
            }
            else if (message.messageType == "userlist") {
                this.userList = message.messageObject;
            }
        });
    }

    ngAfterViewInit(): void {
        this.uploaderEnabled = false;
        this.chatService.openUploaderSocket();
    }

    switchUploader() {
        this.uploaderEnabled = !this.uploaderEnabled;
    }

    uploadFile() {
        let inputelem = document.getElementById("chat-file-upload");
        this.chatService.uploadFile(inputelem);
    }

    ngOnDestroy() {
        this.chat.unsubscribe();
    }

    get userData() {
        return this.userService.userData;
    }

    get activeTeam() {
        return this.userService.activeTeam;
    }
}