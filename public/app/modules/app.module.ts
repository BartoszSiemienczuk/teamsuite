import { NgModule }       from '@angular/core';
import { HttpModule }     from '@angular/http';
import { BrowserModule }  from '@angular/platform-browser';
import { AppComponent }   from '../components/app.component';
import { HomeComponent }  from '../components/home.component';
import { LoginComponent } from '../components/login.component';
import { MenuComponent } from '../components/menu.component';
import { TopbarComponent } from '../components/topbar.component';
import { UserinfoComponent } from '../components/userinfo.component';
import { SidebarComponent } from '../components/sidebar.component';
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
    LoginComponent,
    MenuComponent,
    TopbarComponent,
    SidebarComponent,
    UserinfoComponent
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
