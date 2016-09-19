import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }  from '../components/app.component';
import { HomeComponent } from '../components/home.component';
import { LoginComponent } from '../components/login.component';
import { routing, appRoutingProviders } from '../routing/app.routing';


@NgModule({
  imports:      [ 
    BrowserModule,
    routing
  ],
  declarations: [ 
    AppComponent,
    HomeComponent,
    LoginComponent
  ],
  providers: [
    appRoutingProviders
  ],
  bootstrap:    [ 
    AppComponent 
  ]
})
export class AppModule { }
