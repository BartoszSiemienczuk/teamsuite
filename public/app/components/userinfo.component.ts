import { Component } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'teamsuite-userinfo',
  templateUrl: '/app/views/shared/userinfo.html'
})

export class UserinfoComponent {
  constructor(private userService: UserService){
    
  }
  
  submitLogout(){
    this.userService.sendLogout();
  }
  
  get loggedIn(){
    return this.userService.loggedIn;
  }
  
  get token(){
    return this.userService.token;
  }
  
  get user(){
    return this.userService.userData;
  }
}
