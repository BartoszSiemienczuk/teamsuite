import {Component, OnInit} from '@angular/core';
import {UserService} from '../services/user.service';
import {ActivatedRoute} from "@angular/router";
import {User} from "../models/user.model";

@Component({
    selector: 'teamsuite-useradmin',
    templateUrl: '/app/views/admin/users.html'
})

export class UserAdminComponent implements OnInit {
    private users: User[];
    private edit: boolean = false;
    private editedUser: User;
    private editedLogin: string;


    constructor(private userService: UserService, private route: ActivatedRoute) {

    }

    protected editUser(u: User): void {
        this.edit = true;
        this.editedUser = u;
        this.editedLogin = u.login;
    }

    protected cancelEdit(): void {
        this.edit = false;
        this.editedUser = null;
        this.editedLogin = null;
    }

    protected saveEdit(): void {
        console.log("Edit save");
        //TODO implement request to change role
        this.userService.sendUserEdit(this.editedLogin, this.editedUser.name, this.editedUser.login, this.editedUser.email).subscribe((res) => {
        });
        this.edit = false;
        this.editedUser = null;
        this.editedLogin = null;
    }

    ngOnInit(): void {
        this.route.data.subscribe((data: any) => {
            this.users = data.user;
        });
    };


}
