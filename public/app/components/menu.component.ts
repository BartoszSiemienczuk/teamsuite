import { Component, AfterViewInit } from '@angular/core';
import { UserService } from '../services/user.service';

declare var $:any;

@Component({
  selector: 'teamsuite-menu',
  templateUrl: '/app/views/shared/menu.html'
})
export class MenuComponent implements AfterViewInit{
  constructor(private userService: UserService){ };
  
  get user(){
    return this.userService.userData;
  }
  
  ngAfterViewInit(){
    $.AdminBSB.leftSideBar.activate();
  }
  
}
