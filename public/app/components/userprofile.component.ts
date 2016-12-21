import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: '<teamsuite-userprofile>',
  templateUrl: '/app/views/user/profile.html'
})
export class UserprofileComponent implements OnInit {
    public user : User; 

    constructor(private userService: UserService, private router: Router, private route: ActivatedRoute) { };
  
    get loggedIn(){
      return this.userService.loggedIn;
    }

    get loggedUser(){
      return this.userService.userData;
    }

    ngOnInit() {
      this.route.data.subscribe((data: any) => {
        this.user = data.user;
        //filling missing fields
        if(!!this.user.name){
          this.user.name="";
        }
        if(!!this.user.email){
          this.user.email="";
        }
      });
    }
}