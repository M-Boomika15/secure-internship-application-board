# Secure Internship Application Board

A beginner-friendly internship listing and application website built with HTML, CSS, JavaScript, Node.js, Express and SQLite.

## Features

- Displays internship opportunities from a SQLite database.
- Loads data through a REST API.
- Provides loading, empty, error and retry states.
- Includes an application form with browser-side and server-side validation.
- Uses parameterized SQL queries to reduce SQL injection risk.
- Uses Helmet for common HTTP security headers.
- Applies API rate limiting.
- Includes automated API tests using Jest and Supertest.

## Requirements

- Node.js (LTS recommended)
- npm
- VS Code (optional)

## Run locally

1. Open this project folder in VS Code.
2. Open Terminal in the project folder.
3. Install dependencies:

   ```bash
   npm install
   ```

   On Windows PowerShell, if `npm` is blocked by the execution policy, use:

   ```powershell
   npm.cmd install
   ```

4. Start the application:

   ```bash
   npm start
   ```

   On Windows PowerShell, use `npm.cmd start` if required.

5. Open **http://localhost:3000** in your browser.

**Important:** Open the site through `http://localhost:3000`, not VS Code Live Server (port 5500). The frontend calls the Express API on the same origin.

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Checks server/database status |
| GET | `/api/internships` | Lists internships |
| POST | `/api/applications` | Submits an application |

### Application request example

```json
{
  "internship_id": 1,
  "full_name": "Example Student",
  "email": "student@example.com",
  "phone": "9876543210",
  "resume_link": "https://example.com/resume"
}
```

## Run automated tests

Stop the development server if it is running, then run:

```bash
npm test
```

On Windows PowerShell, use `npm.cmd test` if required.

The test suite uses a separate temporary SQLite database and checks health, internship retrieval, invalid form data, unknown internships and a successful application.

## Project structure

```text
secure-internship-application-board/
├── database.js
├── server.js
├── package.json
├── .gitignore
├── .env.example
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── tests/
│   └── application.test.js
└── reports/
    └── test-report.md
```

## Security notes

See [SECURITY.md](SECURITY.md) for the implemented safeguards and remaining production recommendations.

## Deployment

Deploy the Node.js application to a hosting provider that supports persistent storage if you want SQLite data to survive restarts. Configure the start command as `npm start` and set `PORT` if your host requires it. Do not commit `node_modules`, database files, credentials or private applicant data.
