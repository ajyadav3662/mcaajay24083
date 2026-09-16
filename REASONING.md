# Reasoning Behind the Solution

## 1. Understanding the Problem

The goal is to build a reliable habit-tracking application for Ananya's 75-day self-improvement challenge.

The requirements suggest several important user needs:

- Users should be able to create and manage habits.
- Some habits occur every day.
- Some habits occur only on weekdays.
- The user should see only the habits scheduled for today.
- Completing a habit should be a simple one-click action.
- Each habit needs a current streak.
- Each habit needs a best-ever streak.
- Completion history must be stored reliably.
- Duplicate completion entries for the same habit and date must not be possible.
- Users should be able to find a particular habit quickly.
- Users should be able to update an existing habit.
- Habits that are no longer active should be removable from the active view without permanently deleting their history.
- The application should remind the user about habits that have not yet been logged for the current day.
- The solution should be useful for Ananya but should also work for other users and arbitrary habits.

The most important parts of the system are therefore reliable completion logging and correct streak calculation. The rest of the interface is built around those two foundations.

---

# 2. Main Design Priorities

I prioritized the implementation in the following order:

1. Reliable data persistence
2. Correct completion logging
3. Correct current streak calculation
4. Correct best-ever streak calculation
5. Daily and weekday scheduling
6. Today's habit dashboard
7. Morning reminders
8. Search and update functionality
9. Archive and restore functionality
10. Simple and responsive user interface

This ordering follows the problem statement's emphasis on getting logging and streaks solid first.

---

# 3. Technology Choice

## Backend

I used:

- Node.js
- Express.js

Express provides a lightweight REST API and allows the frontend and backend to be served from the same application.

The backend is responsible for:

- Habit creation
- Habit updates
- Habit retrieval
- Completion logging
- Completion removal
- Search
- Archive and restore
- Streak calculation
- Validation
- Error handling

## Database

I used SQLite through `better-sqlite3`.

SQLite was selected because:

- It requires no separate database server.
- It provides persistent local storage.
- It is easy to run in GitHub Codespaces.
- It is suitable for a small single-application project.
- It supports transactions and database constraints.
- The database file can be kept outside the source-code logic.

This makes the project simple to run while still providing real persistence.

## Frontend

I used:

- HTML
- CSS
- Vanilla JavaScript

A framework was not necessary for this application because the interface is relatively small. Vanilla JavaScript keeps the project lightweight and reduces setup complexity.

---

# 4. Application Architecture

The project is divided into three main layers.

```text
Browser
   |
   | HTTP / REST API
   v
Express Server
   |
   +---- Habit API
   |
   +---- Completion API
   |
   +---- Search / Archive API
   |
   +---- Streak Engine
   |
   v
SQLite Database
