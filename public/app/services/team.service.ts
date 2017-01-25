import {Injectable} from "@angular/core";
import {HttpClient} from './httpClient.service';
import {NotificationsService} from './notifications.service';
import {User} from '../models/user.model';
import {Team} from '../models/team.model';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class TeamService {
    constructor(private httpClient: HttpClient, private notifications: NotificationsService) {

    }

    fetchAllTeams(): Observable<any> {
        return this.httpClient.get('/api/v1/teams').map((res) => res.json());
    }

    assignTeam(user_id: string, team_id: string): Observable<any> {
        return this.httpClient.post('/api/v1/teams/assign', {
            user_id: user_id,
            team_id: team_id
        }).map(res => res.json()).map(res => {
            if (res.success) {
                this.notifications.add("success", "User " + res.login + " was assigned successfully to team " + res.team + ".");
            } else {
                this.notifications.add("danger", "There was an error assigning user: " + res.error + ". Please try again.");
            }
        });
    }

    unassignTeam(user_id: string, team_id: string): Observable<any> {
        return this.httpClient.post('/api/v1/teams/unassign', {
            user_id: user_id,
            team_id: team_id
        }).map(res => res.json()).map(res => {
            if (res.success) {
                this.notifications.add("success", "User was unassigned successfully.");
            } else {
                this.notifications.add("danger", "There was an error unassigning user: " + res.error + ". Please try again.");
            }
        });
    }

    addTeam(teamname: string) {
        return this.httpClient.post('/api/v1/teams/', {name: teamname}).map(res=>res.json()).map(res => {
            if (res.success) {
                this.notifications.add("success", "Team was created successfully.");
            } else {
                this.notifications.add("danger", "There was an error creating team: " + res.error + ". Please try again.");
            }
        });
    }

    deleteTeam(team_id: string){
        return this.httpClient.post('/api/v1/teams/delete', {team_id: team_id}).map(res=>res.json()).map(res => {
            if (res.success) {
                this.notifications.add("success", "Team was deleted successfully.");
            } else {
                this.notifications.add("danger", "There was an error deleting team: " + res.error + ". Please try again.");
            }
        });
    }
}