import {Injectable}             from '@angular/core';
import {
    Router, Resolve,
    ActivatedRouteSnapshot, RouterStateSnapshot
} from '@angular/router';
import {UserService} from '../user.service';
import {User} from '../../models/user.model';


@Injectable()
export class AllUsersResolve implements Resolve<User> {
    constructor(private userService: UserService, private router: Router) {
    };

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): User | Promise<User> {
        return this.userService.fetchAllUsers().toPromise().then(res => {
            return res;
        });
    }
}