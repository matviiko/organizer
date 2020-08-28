import {Component, OnInit} from '@angular/core';
import {DateService} from '../shared/date.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Task, TasksService} from '../shared/tasks.service';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss']
})
export class OrganizerComponent implements OnInit {

  form: FormGroup;
  tasks: Task[] = [];

  constructor(public dateService: DateService,
              private tasksService: TasksService) {
  }

  ngOnInit(): void {
    this.dateService.date.pipe(
      switchMap(value => this.tasksService.load(value))
    ).subscribe(task => {
      this.tasks = task;
    });

    this.form = new FormGroup({
      title: new FormControl('', Validators.required)
    });
  }

  submit(): void {
    const {title} = this.form.value;

    const task: Task = {
      title,
      date: this.dateService.date.value.format('DD-MM-YYYY')
    };

    this.tasksService.create(task).subscribe(t => {
      this.form.reset();
      this.tasks.push(t);
    }, error => console.error(error));
  }

  remove(task: Task): void {
    this.tasksService.remove(task).subscribe(() => {
      this.tasks = this.tasks.filter( t => t.id !== task.id);
    }, error => {
      console.error(error);
    });
  }
}
