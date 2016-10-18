import { ModuleWithProviders } from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { HomeComponent } from '../components/home.component';
import { LoginComponent } from '../components/login.component';
import { UserprofileComponent } from '../components/userprofile.component';
import { AuthGuard } from '../services/auth-guard.service';


const appRoutes : Routes = [
  { path: 'profile', component: UserprofileComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: '', component: HomeComponent, pathMatch:'full' },
];


export const appRoutingProviders: any[] = [

];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

