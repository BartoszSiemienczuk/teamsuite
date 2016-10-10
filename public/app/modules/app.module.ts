import { NgModule }       from '@angular/core';
import { HttpModule }     from '@angular/http';
import { BrowserModule }  from '@angular/platform-browser';
import { AppComponent }   from '../components/app.component';
import { HomeComponent }  from '../components/home.component';
import { LoginComponent } from '../components/login.component';
import { UserService }    from '../services/user.service';
import { HttpClient }    from '../services/httpClient.service';
import { LocalStorage }   from '../services/localStorage.service'
import { routing, appRoutingProviders } from '../routing/app.routing';
import 'rxjs/Rx';
 

@NgModule({
  imports:      [ 
    BrowserModule,
    HttpModule,
    routing
  ],
  declarations: [ 
    AppComponent,
    HomeComponent,
    LoginComponent
  ],
  providers: [
    UserService,
    LocalStorage,
    HttpClient,
    appRoutingProviders
  ],
  bootstrap:    [ 
    AppComponent 
  ]
})
export class AppModule { }
