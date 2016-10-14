//https://medium.com/@blacksonic86/angular-2-authentication-revisited-611bf7373bf9#.dt6cdnhki
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../services/user.service';


@Component({
  selector: 'login',
  templateUrl: '/app/views/shared/login.html'
})
export class LoginComponent { 
  constructor(private userService: UserService, private Router: Router){
    
  }
  
  submitLogin(login, password){
    this.userService.sendLogin(login, password).subscribe( (result) => {
      
    });
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
