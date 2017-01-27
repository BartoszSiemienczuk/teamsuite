import {Injectable} from "@angular/core";
import {HttpClient} from './httpClient.service';
import {NotificationsService} from './notifications.service';
import {Observable} from 'rxjs/Observable';
import {UserService} from "./user.service";

@Injectable()
export class TodoService {
    constructor(private httpClient: HttpClient, private notifications: NotificationsService, private userService: UserService) {

    }

    fetchAllTodos(): Observable<any> {
        var team_id = this.userService.activeTeam._id;
        return this.httpClient.get('/api/v1/teams/todos/team/' + team_id).map((res) => res.json());
    }

    addTodo(list_name: string) {
        var team_id = this.userService.activeTeam._id;
        return this.httpClient.post('/api/v1/teams/todos/team/' + team_id, {name: list_name}).map(res => res.json()).map(res => {
            if (res.success) {
                this.notifications.add("success", "Todo list was created successfully.");
            } else {
                this.notifications.add("danger", "There was an error creating Todo list: " + res.error + ". Please try again.");
            }
        });
    }

    deleteTodo(todo_id: string) {
        return this.httpClient.post('/api/v1/teams/todos/' + todo_id + '/delete', {}).map(res => res.json()).map(res => {
            if (res.success) {
                this.notifications.add("success", "Todo list was deleted successfully.");
            } else {
                this.notifications.add("danger", "There was an error deleting Todo list: " + res.error + ". Please try again.");
            }
        });
    }

    addTask(todo_id: string, task_text: string) {
        return this.httpClient.post('/api/v1/teams/todos/' + todo_id + '/task', {text: task_text}).map(res => res.json()).map(res => {
            if (res.success) {
                this.notifications.add("success", "Task was added successfully.");
            } else {
                this.notifications.add("danger", "There was an error adding task: " + res.error + ". Please try again.");
            }
        });
    }

    switchTask(todo_id: string, task_id: string) {
        return this.httpClient.patch('/api/v1/teams/todos/' + todo_id + '/task/' + task_id, {}).map(res => res.json()).map(res => {
            if (res.success) {
                this.notifications.add("success", "Task status was updated successfully.");
            } else {
                this.notifications.add("danger", "There was an error updating task: " + res.error + ". Please try again.");
            }
        });

    }
}