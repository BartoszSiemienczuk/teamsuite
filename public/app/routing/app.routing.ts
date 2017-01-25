import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from '../components/home.component';
import {LoginComponent} from '../components/login.component';
import {ChatComponent} from '../components/chat.component';
import {UserprofileComponent} from '../components/userprofile.component';
import {AuthGuard} from '../services/auth-guard.service';
import {LoggedUserResolve} from '../services/resolvers/logged-user.resolve';
import {UserAdminComponent} from "../components/useradmin.component";
import {AdminGuard} from "../services/admin-guard.service";
import {AllUsersResolve} from "../services/resolvers/all-users.resolve";
import {AllTeamsResolve} from "../services/resolvers/all-teams.resolve";
import {TeamAdminComponent} from "../components/teamadmin.component";


const appRoutes: Routes = [
    {path: 'chat', component: ChatComponent, canActivate: [AuthGuard]},
    {path: 'profile', component: UserprofileComponent, canActivate: [AuthGuard], resolve: {user: LoggedUserResolve}},
    {path: 'login', component: LoginComponent},

    {path: 'admin/users', component: UserAdminComponent, canActivate: [AdminGuard], resolve: {user: AllUsersResolve}},
    {path: 'admin/teams', component: TeamAdminComponent, canActivate: [AdminGuard], resolve: {user: AllTeamsResolve}},

    {path: '', component: HomeComponent, pathMatch: 'full'},
];


export const appRoutingProviders: any[] = [];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

