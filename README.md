# TaskMate AI

A modern Angular app that uses AI to parse natural‑language task requests, auto‑fill a form, and manage your tasks.

## Features

- Enter tasks in natural language (e.g. “Schedule a call with John on Friday at 3 PM”)
- AI‑powered extraction of title, date, time, and priority
- Review & edit parsed fields in a form
- Save tasks in memory and view history
- Responsive UI with Tailwind CSS
- Contact Us and About Us pages

## Prerequisites

- Node.js ≥ 16
- npm or yarn
- Angular CLI

## Installation

```bash
git clone <repo-url> /home/palak/Desktop/todo-list
cd /home/palak/Desktop/todo-list
npm install
```

## Running the App

```bash
ng serve
```

Open http://localhost:4200 in your browser.

## Project Structure

src/app/
├── components/
│ ├── home/ # Landing page
│ ├── get-started/ # AI input & form
│ ├── task-manager/ # Review & save tasks
│ ├── contact-us/ # Contact form
│ └── about-us/ # About page
├── services/
│ ├── ai.service.ts # AI extraction logic
│ └── task.service.ts # In‑memory task store
├── app.routes.ts # Route definitions
└── app.component.html # Header/footer layout

## Contributing

1. Fork the repo
2. Create a feature branch
3. Submit a pull request

## License

MIT © 2025
