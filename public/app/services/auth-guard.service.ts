import { Injectable }     from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
}                           from '@angular/router';
import { UserService }    from './user.service';
import { NotificationsService } from './notifications.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService, private router:Router, private notifications: NotificationsService) { };
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if(this.userService.loggedIn){
      return true;
    } else {
      this.userService.redirectUrl = state.url;
      
      this.notifications.add("warning", "You must log in to see this page!");
      this.router.navigate(['/login']);
      return false;
    }
  }
}