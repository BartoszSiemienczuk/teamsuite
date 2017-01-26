import {Component, OnInit} from '@angular/core';
import {UserService} from '../services/user.service';
import {TeamService} from '../services/team.service';
import {ActivatedRoute} from "@angular/router";
import {User} from "../models/user.model";
import {Team} from "../models/team.model";

@Component({
    selector: 'teamsuite-useradmin',
    templateUrl: '/app/views/admin/users.html'
})

export class UserAdminComponent implements OnInit {
    private users: User[];
    private teams: Team[];
    private selectedTeamId: string;
    private edit: boolean = false;
    private add: boolean = false;
    private editedUser: User;
    private editedLogin: string;


    constructor(private userService: UserService, private teamService: TeamService, private route: ActivatedRoute) {

    }

    protected addUser(): void {
        this.add = true;
        this.edit = false;
        this.editedUser = <User>{login: "", password: "", name: "", email: "", role: "USER"};
    }

    protected editUser(u: User): void {
        this.loadTeams();
        this.add = false;
        this.edit = true;
        this.editedUser = u;
        this.editedLogin = u.login;
    }

    protected cancelEdit(): void {
        this.add = false;
        this.edit = false;
        this.editedUser = null;
        this.editedLogin = null;
    }

    private loadTeams(): void {
        this.teamService.fetchAllTeams().toPromise().then(res => this.teams = res);
    }

    protected saveEdit(): void {
        //TODO implement request to change role
        this.userService.sendUserEdit(this.editedLogin, this.editedUser.name, this.editedUser.login, this.editedUser.email).subscribe((res) => {
        });
        this.cancelEdit();
        this.reloadUsers();
    }

    protected saveAdd(): void {
        this.userService.sendUserAdd(this.editedUser.name, this.editedUser.login, this.editedUser.email, this.editedUser.password, this.editedUser.role).subscribe((res) => {

        });
        //todo get actual inserted user entity
        console.log(this.editedUser);
        this.users.push(this.editedUser);
        this.cancelEdit();
        this.reloadUsers();
    }

    public deleteUser(user_id: string): void {
        if (confirm("Are you sure?")) {
            console.log("Sure");
            this.userService.deleteUser(user_id).subscribe();
        }
        this.cancelEdit();
        this.reloadUsers();
    }

    public addTeam(): void {
        this.teamService.assignTeam(this.editedUser._id, this.selectedTeamId).subscribe();
        console.log(this.teams);
        console.log("Searching for " + this.selectedTeamId);
        let team = this.teams.reduce((result, current)=>{
            console.log("Checking " + current._id);
            return current._id==this.selectedTeamId ? current : result
        });
        console.log(team);
        this.editedUser.teams.push(<Team>{_id:this.selectedTeamId, name:team.name});
    }

    public removeTeam(teamid: string): void {
        this.teamService.unassignTeam(this.editedUser._id, teamid).subscribe();
        this.editedUser.teams = this.editedUser.teams.filter((item) => {return item._id!=teamid;});
    }

    private reloadUsers() {
        this.userService.fetchAllUsers().toPromise().then(res => {
            this.users = res;
        });
    }

    ngOnInit(): void {
        this.route.data.subscribe((data: any) => {
            this.users = data.user;
        });
    };


}
