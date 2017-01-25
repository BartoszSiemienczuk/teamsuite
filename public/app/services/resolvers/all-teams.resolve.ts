import {Injectable} from '@angular/core';
import {
    Router, Resolve,
    ActivatedRouteSnapshot, RouterStateSnapshot
} from '@angular/router';
import {TeamService} from '../team.service';
import {User} from '../../models/user.model';
import {Team} from "../../models/team.model";


@Injectable()
export class AllTeamsResolve implements Resolve<Team> {
    constructor(private teamService: TeamService, private router: Router) {
    };

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.teamService.fetchAllTeams().toPromise().then(res => {
            return res;
        });
    }
}