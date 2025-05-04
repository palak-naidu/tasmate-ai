import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { AiService, TaskInfo } from '../../services/ai.service';
import { TaskService, Task } from '../../services/task.service';
import { TaskManagerComponent } from './task-manager/task-manager.component';

@Component({
  selector: 'app-get-started',
  templateUrl: './get-started.component.html',
  styleUrls: ['./get-started.component.scss'],
  imports: [CommonModule, FormsModule, TaskManagerComponent], // Add TaskManagerComponent here
})
export class GetStartedComponent {
  userInput = ''; // Stores the user's input
  isLoading = false; // Tracks loading state
  responseMessage = ''; // Stores the response from the API
  taskForm: FormGroup;
  taskExtracted = false;
  tasks: Task[] = []; // Stores all tasks

  constructor(
    private aiService: AiService,
    private taskService: TaskService,
    private fb: FormBuilder
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      date: [''],
      time: [''],
      priority: ['medium'], // Default priority
    });

    // Load existing tasks
    this.tasks = this.taskService.getTasks();
  }

  processInput() {
    if (!this.userInput.trim()) {
      this.responseMessage = 'Please enter a valid request.';
      return;
    }

    this.isLoading = true;
    this.responseMessage = ''; // Clear previous response
    this.taskExtracted = false;

    this.aiService.extractTaskInfo(this.userInput).subscribe({
      next: (taskInfo: TaskInfo) => {
        console.log('Extracted task info:', taskInfo);

        // Update the form with extracted information
        this.taskForm.patchValue({
          title: taskInfo.title || '',
          date: taskInfo.date || '',
          time: taskInfo.time || '',
          priority: taskInfo.priority || 'medium',
        });

        this.responseMessage = 'Task information extracted successfully!';
        this.taskExtracted = true; // Ensure this is set to true
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error processing input:', error);
        this.responseMessage =
          'An error occurred while processing your request. Please try again.';
        this.isLoading = false;
      },
    });
  }

  onChildSave() {
    this.taskExtracted = false; // hide edit table
    this.userInput = ''; // clear input box
    this.responseMessage = 'Task saved successfully!';
  }
}
