//https://medium.com/@blacksonic86/angular-2-authentication-revisited-611bf7373bf9#.dt6cdnhki
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { HttpClient } from './httpClient.service';
import { Router } from '@angular/router';
import { LocalStorage } from './localStorage.service';
import { NotificationsService } from './notifications.service';
import { User } from '../models/user.model';
import { Team } from '../models/team.model';
import { Observable } from 'rxjs/Observable';

declare var $ : any;

@Injectable()
export class UserService {
  private token_name = 'teamsuite_token';
  private isLogged:Boolean = false;
  private user: User;
  private selectedTeam: Team = null; 
  public redirectUrl : string = "";

  constructor(private http: Http, private localStorage: LocalStorage, private httpClient : HttpClient, private notifications: NotificationsService, private router: Router){
    let logged = !!localStorage.get(this.token_name);
    if(logged){
      this.refreshUserData();
    }
  }

  sendLogin(login: string, password: string){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    
    return this.http.post('/auth/login', JSON.stringify({login, password}), { headers })
      .map( res => res.json() ).map( (res) => {
        if(res.success){
          this.localStorage.set(this.token_name, res.token);
          this.refreshUserData();
          this.notifications.add("success", "You have been logged in correctly.");
        } else {
          this.notifications.add("danger", "There was an error while logging you in. Check your login data and try again.");
        }
        return res.success;
      });
  }

  sendProfileUpdate(name: string, email: string): any{
    if(this.isLogged){
      return this.httpClient.post('/auth/user', {name: name, email:email}).map( res => res.json() ).map((res)=>{
        if(res.success){
          this.refreshUserData();
          this.notifications.add("success", "Your data was updated successfully.");
        } else {
          this.notifications.add("danger", "There was an error updating your data : "+res.error+". Please try again.");
        }
        console.log(res);
        return res;
      });
    } else {
      console.log("Not logged");
      return {success:false, error:'Not logged in.'}; 
    }
  }

  sendLogout(){
    this.user = null;
    this.isLogged = false;
    this.localStorage.remove(this.token_name);
    this.notifications.add("info", "You have been logged out. See you next time!");
    this.router.navigate(['/']);
  }

  refreshUserData(){
      this.fetchUserData().subscribe( (res) => {
        console.log("New token = " + res.token);
        this.user = res.user;
        this.localStorage.set(this.token_name, res.token);
        this.isLogged = true;
      });
  }

  fetchUserData(): Observable<any> {
    return this.httpClient.get('/auth/user').map((res)=>res.json());
  }
  
  setActiveTeam(team){
    this.selectedTeam = team;
  }

  isAdmin(){
    if(this.loggedIn || this.userData==null) return false;
    return this.userData.role=="ADMIN";
  }

  get token(){
    if(this.isLogged){
      return this.localStorage.get(this.token_name);
    } else {
      return "";
    }
  }

  get userData(){
    if(this.isLogged){
      if(!this.user)
        this.refreshUserData();
      return this.user;
    } else {
      return null;
    }
  }

  get loggedIn(){
    return this.isLogged;
  }

  get teams(){
    if(this.isLogged){
      return this.userData.teams;
    } else {
      return [];
    }
  }

  get activeTeam(){
    if(this.isLogged){
      if(this.selectedTeam)
        return this.selectedTeam;
      else if(this.userData.teams[0])
        return this.userData.teams[0];
      else return null;
    }
  }

  set activeTeam(team){
    this.selectedTeam=team;
  }

  
}