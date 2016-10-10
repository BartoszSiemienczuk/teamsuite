//http://stackoverflow.com/a/34465070/3688967
import {Inject, Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {UserService} from './user.service';
import {LocalStorage} from './localStorage.service';

@Injectable()
export class HttpClient{
  private token_name = 'teamsuite_token';

  constructor(private http: Http, private localStorage : LocalStorage){ }
  
  createAuthorizationHeader(headers:Headers){
    headers.append('Authorization', 'Bearer ' + this.token);
  }
  
  get(url) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.get(url, {headers: headers});
  }
  
  post(url, data){
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.post(url, data, {headers: headers});
  }

  get token(){
      return this.localStorage.get(this.token_name);
  }
}