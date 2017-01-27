import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {UserService} from '../services/user.service';
import {TodoService} from '../services/todo.service';


@Component({
    selector: 'teamsuite-todos',
    templateUrl: '/app/views/team/todos.html'
})
export class TodoComponent implements OnInit {
    public todos: any[];
    public listname: string;

    constructor(private userService: UserService, private Router: Router, private todoService: TodoService) {

    }

    ngOnInit(): void {
        this.refreshTodos()
    }

    addTodo() {
        this.todoService.addTodo(this.listname).subscribe(res => this.refreshTodos());
        this.listname = "";
    }

    deleteTodo(todo_id) {
        if (window.confirm("Are you sure?")) {
            this.todoService.deleteTodo(todo_id).subscribe(res => this.refreshTodos());
        }
    }

    addTask(todo_index) {
        let todo = this.todos[todo_index];
        this.todoService.addTask(todo._id, todo.newtask).subscribe(res => this.refreshTodos());
        this.todos[todo_index].newtask = "";
    }

    switchTask(todo_id, task_id) {
        this.todoService.switchTask(todo_id, task_id).subscribe(res => this.refreshTodos());
    }

    private refreshTodos() {
        this.todoService.fetchAllTodos().subscribe(res => {
            this.todos = res.todos;
        });
    }


}
