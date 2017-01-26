import {NgModule}       from '@angular/core';
import {HttpModule}     from '@angular/http';
import {FormsModule}    from '@angular/forms';
import {BrowserModule}  from '@angular/platform-browser';

import {AppComponent}   from '../components/app.component';
import {HomeComponent}  from '../components/home.component';
import {LoginComponent} from '../components/login.component';
import {MenuComponent} from '../components/menu.component';
import {TopbarComponent} from '../components/topbar.component';
import {UserinfoComponent} from '../components/userinfo.component';
import {SidebarComponent} from '../components/sidebar.component';
import {ChatComponent} from '../components/chat.component';
import {UserprofileComponent} from '../components/userprofile.component';
import {UserAdminComponent} from '../components/useradmin.component';
import {TeamAdminComponent} from '../components/teamadmin.component';

import {UserService}    from '../services/user.service';
import {TeamService}    from '../services/team.service';
import {HttpClient}    from '../services/httpClient.service';
import {LocalStorage}   from '../services/localStorage.service';
import {NotificationsService} from '../services/notifications.service';
import {AuthGuard} from '../services/auth-guard.service';
import {AdminGuard} from '../services/admin-guard.service';
import {ChatService} from '../services/chat.service';

import {LoggedUserResolve} from '../services/resolvers/logged-user.resolve';
import {AllUsersResolve} from '../services/resolvers/all-users.resolve';
import {AllTeamsResolve} from '../services/resolvers/all-teams.resolve';

import {routing, appRoutingProviders} from '../routing/app.routing';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';


@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        FormsModule,
        routing
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        LoginComponent,
        MenuComponent,
        TopbarComponent,
        SidebarComponent,
        UserinfoComponent,
        UserprofileComponent,
        ChatComponent,
        UserAdminComponent,
        TeamAdminComponent
    ],
    providers: [
        UserService,
        LocalStorage,
        HttpClient,
        NotificationsService,
        AuthGuard,
        AdminGuard,
        LoggedUserResolve,
        AllUsersResolve,
        AllTeamsResolve,
        appRoutingProviders,
        ChatService,
        TeamService
    ],
    bootstrap: [
        AppComponent
    ]
})

export class AppModule {
}
