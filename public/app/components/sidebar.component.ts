import { Component, AfterViewInit } from '@angular/core';
import { UserService } from '../services/user.service';
declare var $:any;

@Component({
  selector: 'teamsuite-sidebar',
  templateUrl: '/app/views/shared/sidebar.html'
})

export class SidebarComponent implements AfterViewInit{
  
  constructor (private userService: UserService ) { }

  ngAfterViewInit(){
  
  }
  
  setSelectedTeam(team){
    this.userService.setActiveTeam(team);
  }
  
  get userTeams(){
    return this.userService.teams;
  }
  
  get selectedTeam(){
    return this.userService.activeTeam;
  }
  
  
}
