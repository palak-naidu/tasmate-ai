# TaskMate AI

**TaskMate AI** is a modern Angular app that uses AI to parse natural‑language task requests, auto‑fill a form, and manage your tasks.

## Features

- Natural‑language task entry (e.g. “Schedule a call with John on Friday at 3 PM”)
- AI‑powered extraction of title, date, time, and priority
- Review & edit parsed fields before saving
- In‑memory task store with history
- Responsive UI with Tailwind CSS
- Built‑in About Us and Contact Us pages

## Prerequisites

- Node.js v16 or higher
- npm or yarn
- Angular CLI (`npm install -g @angular/cli`)

## Setup

1. Clone the repo

   ```bash
   git clone https://github.com/your-org/todo-list.git
   cd todo-list
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Create your local environment file
   ```bash
   cp src/environments/environment.example.ts src/environments/environment.ts
   ```
   Then open `src/environments/environment.ts` and replace the placeholder API key.

## Running the App

```bash
ng serve
```

Open [http://localhost:4200](http://localhost:4200) in your browser.

## Scripts

- `ng serve` – start development server
- `ng build` – build production bundle
- `npm test` – run unit tests

## Contributing

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/xyz`)
3. Commit your changes and push (`git push origin feature/xyz`)
4. Open a pull request

## License

MIT © 2025
