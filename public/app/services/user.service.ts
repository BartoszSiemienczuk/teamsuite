//https://medium.com/@blacksonic86/angular-2-authentication-revisited-611bf7373bf9#.dt6cdnhki
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { LocalStorage } from './localStorage.service';
@Injectable()
export class UserService {
  private token_name = 'teamsuite_token';
  private isLogged:Boolean = false;

  constructor(private http: Http, private localStorage: LocalStorage){
    this.isLogged = !!localStorage.get(this.token_name);
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
        }
        console.log("Czy zalogowano : %s", res.success);
        return res.success;
      });
  }

  get token(){
    if(this.isLogged){
      return this.localStorage.get(this.token_name);
    } else {
      return "";
    }
  }

  get loggedIn(){
    return this.isLogged;
  }
}