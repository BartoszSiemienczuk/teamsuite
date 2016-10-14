import { Component } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'teamsuite-menu',
  templateUrl: '/app/views/shared/menu.html'
})
export class MenuComponent {
  constructor(private userService: UserService){ };
  
  get user(){
    return this.userService.userData;
  }
  
}
