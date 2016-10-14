//https://medium.com/@blacksonic86/angular-2-authentication-revisited-611bf7373bf9#.dt6cdnhki
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { HttpClient } from './httpClient.service';
import { LocalStorage } from './localStorage.service';
import { NotificationsService } from './notifications.service';
@Injectable()
export class UserService {
  private token_name = 'teamsuite_token';
  private isLogged:Boolean = false;
  private user = {};

  constructor(private http: Http, private localStorage: LocalStorage, private httpClient : HttpClient, private notifications: NotificationsService){
    this.isLogged = !!localStorage.get(this.token_name);
    if(this.isLogged){
      this.refreshUserData();
    }
  }

  sendLogin(login: string, password: string){
    console.log("send login!");
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    
    return this.http.post('/auth/login', JSON.stringify({login, password}), { headers })
      .map( res => res.json() ).map( (res) => {
        if(res.success){
          this.localStorage.set(this.token_name, res.token);
          this.isLogged = true;
          this.refreshUserData();
          this.notifications.add("success", "Zalogowałeś się poprawnie.");
        } else {
          this.notifications.add("danger", "Podałeś błędne dane logowania. Spróbuj ponownie.");
        }
      
      
        return res.success;
      });
  }

  sendLogout(){
    this.user = {};
    this.isLogged = false;
    this.localStorage.remove(this.token_name);
  }

  refreshUserData(){
    this.httpClient.get('/auth/user')
      .map((res)=>res.json())
      .subscribe( (res) => {
        console.log("User object : ");
        console.log(res.user.user);
        this.user = res.user.user;
      });
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
      return {};
    }
  }

  get loggedIn(){
    return this.isLogged;
  }
}