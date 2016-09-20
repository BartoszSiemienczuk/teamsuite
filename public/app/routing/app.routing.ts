import { ModuleWithProviders } from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { HomeComponent } from '../components/home.component';
import { LoginComponent } from '../components/login.component';


const appRoutes : Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: HomeComponent, pathMatch:'full' },
];


export const appRoutingProviders: any[] = [

];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

