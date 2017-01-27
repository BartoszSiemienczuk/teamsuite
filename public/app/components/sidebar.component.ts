import {Component, AfterViewInit} from '@angular/core';
import {UserService} from '../services/user.service';
import {Router} from "@angular/router";
declare var $: any;

@Component({
    selector: 'teamsuite-sidebar',
    templateUrl: '/app/views/shared/sidebar.html'
})

export class SidebarComponent implements AfterViewInit {

    constructor(private userService: UserService, private router: Router) {
    }

    ngAfterViewInit() {

    }

    setSelectedTeam(team) {
        this.userService.setActiveTeam(team);
        this.router.navigate(['/']);
    }

    get userTeams() {
        return this.userService.teams;
    }

    get selectedTeam() {
        return this.userService.activeTeam;
    }


}
