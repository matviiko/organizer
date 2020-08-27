import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

export interface Task {
  id?: string;
  title: string;
  date?: string;
}

export interface CreateResponse {
  name: string;
}

@Injectable({providedIn: 'root'})

export class TasksService {
  static url = 'https://angular-organizer-2899a.firebaseio.com/tasks';

  constructor(private http: HttpClient) {
  }

  load(date: moment.Moment): Observable<Task[]> {
    return this.http
      .get<Task[]>(`${TasksService.url}/${date.format('DD-MM-YYYY')}.json`)
      .pipe(map(task => {
        if (!task) {
          return [];
        } else { return Object.keys(task).map(key => ({...task[key], id: key})); }
      }));
  }

  create(task: Task): Observable<Task> {
    return this.http.post<CreateResponse>(`${TasksService.url}/${task.date}.json`, task)
      .pipe(map(res => {
        return {...task, id: res.name};
        })
      );
  }
}
