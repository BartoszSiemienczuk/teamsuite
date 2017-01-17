import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router'; 

import { ChatService } from '../services/chat.service'; 
import { UserService } from '../services/user.service';


@Component({
  selector: 'teamsuite-chat',
  templateUrl: '/app/views/chat/main.html'
})
export class ChatComponent implements OnInit { 
  private chat;
  private messageText:String = "";
  private messages = [];
  private userList = [];
  public showServerMessages: boolean = true;
  
  constructor(private userService: UserService, private Router: Router, private chatService: ChatService) { }
  
  sendMessage(){ 
    this.chatService.sendMessage({text:this.messageText});
    this.messageText = "";
  }
  
  ngOnInit(){
    this.chat = this.chatService.getMessages().subscribe((message: any) => {
      console.log(message);
      if(message.messageType=="message"){
        this.messages.push(message.messageObject);
      }
      else if(message.messageType=="userlist"){
        this.userList = message.messageObject;
      }
      else if(message.messageType=="debug"){
        console.log("debug");
        console.log(message.messageObject);
      }
    });
  }
  
  ngOnDestroy(){
    this.chat.unsubscribe();
  }
  
  get userData(){
    return this.userService.userData;
  }
  
  get activeTeam(){
    return this.userService.activeTeam;
  }
}