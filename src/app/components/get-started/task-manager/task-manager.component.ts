import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { TaskService, Task } from '../../../services/task.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-manager',
  templateUrl: './task-manager.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class TaskManagerComponent {
  @Input() taskForm!: FormGroup; // Form passed from parent
  @Input() taskExtracted = false; // Flag to show/hide the form
  @Output() taskSaved = new EventEmitter<void>(); // Emit event when task is saved

  tasks: Task[] = []; // List of tasks

  constructor(private taskService: TaskService) {
    this.tasks = this.taskService.getTasks(); // Load existing tasks
  }

  saveTask() {
    if (this.taskForm.valid) {
      const newTask: Task = this.taskForm.value;
      this.taskService.addTask(newTask); // Save the task in the service
      this.tasks = this.taskService.getTasks(); // Refresh the list of tasks
      console.log('Task saved:', newTask);
      this.taskSaved.emit(); // Emit event
    } else {
      alert('Please fill in all required fields.');
    }
  }
}
