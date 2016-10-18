import { Component, Input } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';

@Component({
  selector: '<teamsuite-userprofile>',
  templateUrl: '/app/views/user/profile.html'
})
export class UserprofileComponent {
    private user : User; 
    constructor(private userService: UserService) { };
  
    get loggedIn(){
      return this.userService.loggedIn;
    }

    get loggedUser(){
      return this.userService.userData;
    }
}