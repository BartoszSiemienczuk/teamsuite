import { Component, AfterViewInit } from '@angular/core';
import { UserService } from '../services/user.service';
declare var $:any;

@Component({
  selector: 'teamsuite-topbar',
  templateUrl: '/app/views/shared/topbar.html'
})
export class TopbarComponent implements AfterViewInit {
  constructor (private userService: UserService) { }
  
  ngAfterViewInit(){
    $.AdminBSB.search.activate();
  }
  
  get loggedIn(){
    return this.userService.loggedIn;
  }
  
  get user(){
    return this.userService.userData;
  }
}
