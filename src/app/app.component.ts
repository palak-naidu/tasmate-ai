import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true, // Mark as standalone
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [CommonModule, RouterModule], // Import necessary modules
})
export class AppComponent {
  showInputBox = false; // Controls the visibility of the input box
  userInput = ''; // Stores the user's input

  processInput() {
    console.log('User Input:', this.userInput);
    // Add logic to process the input, e.g., send it to an API
  }
}
