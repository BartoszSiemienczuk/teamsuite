import { Injectable }             from '@angular/core';
import { Router, Resolve,
         ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from '../user.service';
import { User } from '../../models/user.model';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class LoggedUserResolve implements Resolve<User> {
  constructor(private userService: UserService, private router: Router) {};
  
  resolve(route: ActivatedRouteSnapshot): Promise<User>|boolean {
    console.log("Resolving logged user from API");
    return this.userService.fetchUserData().toPromise().then(res => {
      return res.user;
    });
  }
}