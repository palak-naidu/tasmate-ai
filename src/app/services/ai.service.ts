import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment'; // <-- import

export interface TaskInfo {
  title: string;
  date: string | null;
  time: string | null;
  priority?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AiService {
  private huggingFaceApiUrl = 'https://api-inference.huggingface.co/models/';
  private modelId = 'gpt2';
  private apiKey = environment.hfApiKey;

  constructor(private http: HttpClient) {}
  extractTaskInfo(userInput: string): Observable<any> {
    // First try with the API - if it fails, fall back to local extraction
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.apiKey}`)
      .set('Content-Type', 'application/json');

    // Since many models aren't trained for structured extraction, we'll use the API
    // to help classify the intent, then do our own parsing
    return this.http
      .post<any>(
        `${this.huggingFaceApiUrl}${this.modelId}`,
        {
          inputs: userInput,
          parameters: {
            return_full_text: true,
          },
        },
        { headers }
      )
      .pipe(
        map((response) => {
          console.log('API Response:', response);
          // Even if we get a response, we'll rely on our client-side parsing
          return this.extractTaskDetails(userInput);
        }),
        catchError((error) => {
          console.error('Error from Hugging Face API:', error);
          // Fall back to local extraction
          return of(this.extractTaskDetails(userInput));
        })
      );
  }

  private extractTaskDetails(input: string): any {
    // Task title extraction - remove date/time patterns first
    const dateTimePatterns = [
      // Date patterns
      /(?:on|for|this|next)\s+([a-zA-Z]+day|tomorrow|yesterday|today)/i,
      /(?:on|for)\s+([a-zA-Z]+\s\d{1,2}(?:st|nd|rd|th)?)/i,
      /(?:on|for)\s+(\d{1,2}[\/\.-]\d{1,2}(?:[\/\.-]\d{2,4})?)/i,

      // Time patterns
      /(?:at|by)\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm|AM|PM))/i,
      /(?:at|by)\s+(noon|midnight|morning|afternoon|evening)/i,

      // Priority patterns
      /(?:high|medium|low)\s+priority/i,
    ];

    // Copy the input to extract the title
    let title = input;

    // Remove all date/time patterns from the title
    dateTimePatterns.forEach((pattern) => {
      title = title.replace(pattern, '');
    });

    // Common action words to remove from the beginning
    const actionWords = [
      /^remind me to /i,
      /^schedule /i,
      /^plan /i,
      /^set up /i,
      /^create /i,
      /^add /i,
    ];

    actionWords.forEach((pattern) => {
      title = title.replace(pattern, '');
    });

    // Clean up the title
    title = title.replace(/\s+/g, ' ').trim();

    // Extract date
    const dateInfo = this.extractDate(input);

    // Extract time
    const timeInfo = this.extractTime(input);

    // Extract priority
    const priorityInfo = this.extractPriority(input);

    return {
      title: title,
      date: dateInfo,
      time: timeInfo,
      priority: priorityInfo,
    };
  }

  private extractDate(input: string): string | null {
    // Check for specific days
    const dayMatch = input.match(/(?:on|next|this)\s+([a-zA-Z]+day)/i);
    if (dayMatch) {
      const day = dayMatch[1].toLowerCase();
      return this.getNextDayDate(day);
    }

    // Check for tomorrow/today/yesterday
    const relativeMatch = input.match(/\b(tomorrow|today|yesterday)\b/i);
    if (relativeMatch) {
      const relativeDay = relativeMatch[1].toLowerCase();
      const date = new Date();

      if (relativeDay === 'tomorrow') {
        date.setDate(date.getDate() + 1);
      } else if (relativeDay === 'yesterday') {
        date.setDate(date.getDate() - 1);
      }

      return this.formatDate(date);
    }

    // Check for dates like "May 15th" or "June 3rd"
    const monthDayMatch = input.match(
      /\b([a-zA-Z]+)\s+(\d{1,2})(?:st|nd|rd|th)?\b/i
    );
    if (monthDayMatch) {
      const monthName = monthDayMatch[1];
      const day = parseInt(monthDayMatch[2]);

      const monthNames = [
        'january',
        'february',
        'march',
        'april',
        'may',
        'june',
        'july',
        'august',
        'september',
        'october',
        'november',
        'december',
      ];
      const monthIndex = monthNames.findIndex((m) =>
        m.startsWith(monthName.toLowerCase())
      );

      if (monthIndex !== -1 && day >= 1 && day <= 31) {
        const date = new Date();
        date.setMonth(monthIndex);
        date.setDate(day);

        // If the date is in the past, assume next year
        if (date < new Date()) {
          date.setFullYear(date.getFullYear() + 1);
        }

        return this.formatDate(date);
      }
    }

    // Check for numeric dates like MM/DD or DD/MM
    const numericMatch = input.match(
      /\b(\d{1,2})[\/\.-](\d{1,2})(?:[\/\.-](\d{2,4}))?\b/
    );
    if (numericMatch) {
      // Assume MM/DD format
      let month = parseInt(numericMatch[1]);
      let day = parseInt(numericMatch[2]);

      // Basic validation
      if (month > 12) {
        // Swap if day/month format seems likely
        [month, day] = [day, month];
      }

      if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
        const year = numericMatch[3]
          ? parseInt(numericMatch[3])
          : new Date().getFullYear();
        const fullYear = year < 100 ? 2000 + year : year;

        const date = new Date(fullYear, month - 1, day);
        return this.formatDate(date);
      }
    }

    return null;
  }

  private extractTime(input: string): string | null {
    // Check for specific times like "2 PM", "2:30 PM"
    const timeMatch = input.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm|AM|PM)\b/);
    if (timeMatch) {
      let hours = parseInt(timeMatch[1]);
      const minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
      const period = timeMatch[3].toLowerCase();

      // Convert to 24-hour format
      if (period === 'pm' && hours < 12) {
        hours += 12;
      } else if (period === 'am' && hours === 12) {
        hours = 0;
      }

      // Format as HH:MM
      return `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}`;
    }

    // Check for general time periods
    const periodMatch = input.match(
      /\b(morning|afternoon|evening|noon|midnight)\b/i
    );
    if (periodMatch) {
      const period = periodMatch[1].toLowerCase();

      switch (period) {
        case 'morning':
          return '09:00';
        case 'afternoon':
          return '14:00';
        case 'evening':
          return '19:00';
        case 'noon':
          return '12:00';
        case 'midnight':
          return '00:00';
      }
    }

    return null;
  }

  private extractPriority(input: string): string {
    // Check for priority keywords
    if (
      /\bhigh\s+priority\b|\bpriority\s*:\s*high\b|\bimportant\b|\burgent\b/i.test(
        input
      )
    ) {
      return 'high';
    } else if (/\blow\s+priority\b|\bpriority\s*:\s*low\b/i.test(input)) {
      return 'low';
    }

    // Default priority
    return 'medium';
  }

  private getNextDayDate(dayName: string): any {
    const days = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];
    const today = new Date();
    const todayIndex = today.getDay();

    // Find the target day index
    const targetDayIndex = days.findIndex(
      (day) => day.toLowerCase() === dayName.toLowerCase()
    );
    if (targetDayIndex === -1) return null;

    // Calculate days to add
    let daysToAdd = targetDayIndex - todayIndex;
    if (daysToAdd <= 0) {
      // If the day has already occurred this week, get next week's occurrence
      daysToAdd += 7;
    }

    const targetDate = new Date();
    targetDate.setDate(today.getDate() + daysToAdd);

    return this.formatDate(targetDate);
  }

  private formatDate(date: Date): string {
    // Format as YYYY-MM-DD for the date input
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
