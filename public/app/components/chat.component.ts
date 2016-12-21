import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../services/user.service';


@Component({
  selector: 'teamsuite-chat',
  templateUrl: '/app/views/chat/main.html'
})
export class ChatComponent implements OnInit { 
  constructor(private userService: UserService, private Router: Router){
    
  }
  
  ngOnInit(){
    //blank
  }
}