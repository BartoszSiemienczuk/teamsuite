//https://medium.com/@blacksonic86/angular-2-authentication-revisited-611bf7373bf9#.dt6cdnhki
import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {HttpClient} from './httpClient.service';
import {Router} from '@angular/router';
import {LocalStorage} from './localStorage.service';
import {NotificationsService} from './notifications.service';
import {User} from '../models/user.model';
import {Team} from '../models/team.model';
import {Observable} from 'rxjs/Observable';

declare var $: any;

@Injectable()
export class UserService {
    private token_name = 'teamsuite_token';
    private isLogged: Boolean = false;
    private user: User;
    private selectedTeam: Team = null;
    public redirectUrl: string = "";

    constructor(private http: Http, private localStorage: LocalStorage, private httpClient: HttpClient, private notifications: NotificationsService, private router: Router) {
        let logged = !!localStorage.get(this.token_name);
        if (logged) {
            this.refreshUserData();
        }
    }

    sendLogin(login: string, password: string) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.http.post('/auth/login', JSON.stringify({login, password}), {headers})
            .map(res => res.json()).map((res) => {
                if (res.success) {
                    this.localStorage.set(this.token_name, res.token);
                    this.refreshUserData();
                    this.notifications.add("success", "You have been logged in correctly.");
                } else {
                    this.notifications.add("danger", "There was an error while logging you in. Check your login data and try again.");
                }
                return res.success;
            });
    }

    sendProfileUpdate(name: string, email: string): any {
        if (this.isLogged) {
            return this.httpClient.post('/auth/user', {name: name, email: email}).map(res => res.json()).map((res) => {
                if (res.success) {
                    this.refreshUserData();
                    this.notifications.add("success", "Your data was updated successfully.");
                } else {
                    this.notifications.add("danger", "There was an error updating your data : " + res.error + ". Please try again.");
                }
                console.log(res);
                return res;
            });
        } else {
            console.log("Not logged");
            return {success: false, error: 'Not logged in.'};
        }
    }

    sendUserEdit(old_login: string, name: string, login: string, email: string): any {
        if (this.isLogged && this.isAdmin()) {
            return this.httpClient.patch('/api/v1/users/' + old_login, {
                name: name,
                email: email,
                login: login
            }).map(res => res.json()).map(res => {
                if (res.success) {
                    this.notifications.add("success", "User data was updated successfully.");
                } else {
                    this.notifications.add("danger", "There was an error updating user data : " + res.error + ". Please try again.");
                }
            });
        } else {
            this.notifications.add("danger", "Insufficient permissions.")
        }
    }


    sendUserAdd(name: string, login: string, email: string, password: string, role: string) {
        if (this.isLogged && this.isAdmin()) {
            return this.httpClient.post('/api/v1/users/', {
                name: name,
                email: email,
                login: login,
                password: password,
                role: role
            }).map(res => res.json()).map(res => {
                if (res.success) {
                    this.notifications.add("success", "User was created successfully.");
                } else {
                    this.notifications.add("danger", "There was an error creating user: " + res.error + ". Please try again.");
                }
            });
        } else {
            this.notifications.add("danger", "Insufficient permissions.")
        }
    }

    deleteUser(user_id: string) {
        if (this.isLogged && this.isAdmin()) {
            return this.httpClient.post('/api/v1/users/delete', {user_id: user_id}).map(res => res.json()).map(res => {
                if (res.success) {
                    this.notifications.add("success", "User was deleted successfully.");
                } else {
                    this.notifications.add("danger", "Error deleting user : " + res.error + ". Try again later.");
                }
            });
        }
    }

    getNotes() {
        if (!this.isLogged) {
            this.notifications.add("danger", "You must be logged in.");
            return;
        } else {
            return this.httpClient.get('/api/v1/users/notes').map(res => res.json());
        }
    }

    addNote(text: string) {
        if (!this.isLogged) {
            this.notifications.add("danger", "You must be logged in.");
            return;
        } else {
            return this.httpClient.post('/api/v1/users/notes', {note: text}).map(res => res.json()).map(res => {
                if (res.success) {
                    this.notifications.add("success", "Note was created successfully.");
                } else {
                    this.notifications.add("danger", "Error adding note: " + res.error + ". Try again later.");
                }
            });
        }
    }

    deleteNote(text: string) {
        if (!this.isLogged) {
            this.notifications.add("danger", "You must be logged in.");
            return;
        } else {
            return this.httpClient.post('/api/v1/users/notes/delete', {note: text}).map(res => res.json()).map(res => {
                if (res.success) {
                    this.notifications.add("success", "Note was deleted successfully.");
                } else {
                    this.notifications.add("danger", "Error deleting note: " + res.error + ". Try again later.");
                }
            });
        }
    }

    sendLogout() {
        this.user = null;
        this.isLogged = false;
        this.localStorage.remove(this.token_name);
        this.notifications.add("info", "You have been logged out. See you next time!");
        this.router.navigate(['/']);
    }

    refreshUserData() {
        this.fetchUserData().subscribe((res) => {
            this.user = res.user;
            this.localStorage.set(this.token_name, res.token);
            this.isLogged = true;
        });

    }

    fetchUserData(): Observable<any> {
        return this.httpClient.get('/auth/user').map((res) => res.json());
    }

    fetchAllUsers(): Observable<any> {
        return this.httpClient.get('/api/v1/users').map((res) => res.json());
    }

    setActiveTeam(team) {
        this.selectedTeam = team;
    }

    isAdmin() {
        if (this.loggedIn == false || this.userData == null) return false;
        return this.userData.role == "ADMIN";
    }

    get token() {
        if (this.isLogged) {
            return this.localStorage.get(this.token_name);
        } else {
            return "";
        }
    }

    get userData() {
        if (this.isLogged) {
            if (!this.user)
                this.refreshUserData();
            return this.user;
        } else {
            return null;
        }
    }

    get loggedIn() {
        return this.isLogged;
    }

    get teams() {
        if (this.isLogged) {
            return this.userData.teams;
        } else {
            return [];
        }
    }

    get activeTeam() {
        if (this.isLogged) {
            if (this.selectedTeam)
                return this.selectedTeam;
            else if (this.userData.teams[0])
                return this.userData.teams[0];
            else return null;
        }
    }

    set activeTeam(team) {
        this.selectedTeam = team;
    }

}