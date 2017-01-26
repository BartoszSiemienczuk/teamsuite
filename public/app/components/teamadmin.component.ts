import {Component, OnInit} from '@angular/core';
import {UserService} from '../services/user.service';
import {TeamService} from '../services/team.service';
import {ActivatedRoute} from "@angular/router";
import {User} from "../models/user.model";
import {Team} from "../models/team.model";

@Component({
    selector: 'teamsuite-teamadmin',
    templateUrl: '/app/views/admin/teams.html'
})

export class TeamAdminComponent implements OnInit {
    teams: Team[];
    edit:boolean = false;
    newTeam : Team;

    constructor(private userService: UserService, private teamService: TeamService, private route: ActivatedRoute){ }

    public addTeam(name: string){
        this.teamService.addTeam(name).subscribe();
        this.newTeam = {_id:"", name:"", users:[]};
        this.refreshTeams();
    }

    public deleteTeam(team: Team){
        if(team.users.length==0){
            this.teamService.deleteTeam(team._id).subscribe(res => {
                this.refreshTeams();
            });
        } else {
            alert("Can't delete non-empty teams.");
        }
    }

    private refreshTeams(){
        this.teamService.fetchAllTeams().subscribe(res => {
            this.teams = res;
        })
    }

    ngOnInit(){
        this.route.data.subscribe((data: any) => {
            this.teams = data.user;
        });

        this.newTeam = {_id:"", name:"", users:[]};
    }
}