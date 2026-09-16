# Ananya's 75-Day Challenge

A full-stack habit tracking application designed around Ananya's 75-day self-improvement challenge.

The application allows users to create and manage habits, complete habits for the day, maintain reliable streaks, search and update habits, and archive habits without permanently deleting their history.

## Features

- 75-day challenge tracking
- Daily habits
- Weekday habits (Monday-Friday)
- Today's habit dashboard
- Habit completion logging
- Undo today's completion
- Current streak tracking
- Best-ever streak tracking
- Completion history
- Search habits
- Edit habits
- Archive habits
- Restore archived habits
- Persistent SQLite database
- Input validation
- REST API
- Responsive web interface
- Automated streak tests
- GitHub Codespaces compatible

---

## Technology Stack

### Frontend

- HTML5
- CSS3
- Vanilla JavaScript

### Backend

- Node.js
- Express.js

### Database

- SQLite
- better-sqlite3

### Testing

- Node.js built-in `assert` module

---

## Project Structure

```text
Ananya_75Days/
│
├── README.md
├── REASONING.md
├── AI_LOGS.md
├── .gitignore
├── package.json
├── package-lock.json
│
├── data/
│   └── .gitkeep
│
├── server/
│   ├── db.js
│   ├── server.js
│   └── streak.js
│
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
│
└── tests/
    └── streak.test.js