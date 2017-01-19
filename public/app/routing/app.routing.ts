import { ModuleWithProviders } from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { HomeComponent } from '../components/home.component';
import { LoginComponent } from '../components/login.component';
import { ChatComponent } from '../components/chat.component';
import { UserprofileComponent } from '../components/userprofile.component';
import { AuthGuard } from '../services/auth-guard.service';
import { LoggedUserResolve } from '../services/resolvers/logged-user.resolve';


const appRoutes : Routes = [
  { path: 'chat', component: ChatComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: UserprofileComponent, canActivate: [AuthGuard], resolve: {user: LoggedUserResolve} },
  { path: 'login', component: LoginComponent },
  { path: '', component: HomeComponent, pathMatch:'full' },
];


export const appRoutingProviders: any[] = [

];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

