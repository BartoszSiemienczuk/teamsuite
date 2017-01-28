import { Component } from '@angular/core';
import {UserService} from "../services/user.service";

@Component({
  selector: 'home-content',
  templateUrl: '/app/views/home/home.html'
})

export class HomeComponent {
  constructor(private userService: UserService) {}

  isAdmin(){
    return this.userService.isAdmin();
  }

  get user(){
    return this.userService.userData;
  }

}
