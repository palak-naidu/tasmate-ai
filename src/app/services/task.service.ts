import { Injectable } from '@angular/core';

export interface Task {
  title: string;
  date: string | null;
  time: string | null;
  priority: string;
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasks: Task[] = []; // Array to store tasks

  constructor() {}

  // Add a new task
  addTask(task: Task): void {
    this.tasks.push(task);
    console.log('Task added:', task);
  }

  // Get all tasks
  getTasks(): Task[] {
    return this.tasks;
  }
}
