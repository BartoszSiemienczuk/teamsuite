import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../services/user.service';


@Component({
    selector: 'teamsuite-notes',
    templateUrl: '/app/views/user/notes.html'
})
export class NotesComponent implements OnInit{
    public notes: any[];
    public noteText: string;

    constructor(private userService: UserService, private Router: Router){

    }

    ngOnInit(): void {
        this.refreshNotes()
    }

    addNote(){
        this.userService.addNote(this.noteText).subscribe(res=>this.refreshNotes());
        this.noteText="";
    }

    deleteNote(key) {
        this.userService.deleteNote(this.notes[key]).subscribe(res=>this.refreshNotes());
    }

    private refreshNotes(){
        this.userService.getNotes().subscribe(res=>{
            this.notes = res.notes;
        });
    }
}
