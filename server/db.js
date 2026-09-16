const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

const DATA_DIR = path.join(__dirname, "..", "data");

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, "habits.db");

const db = new Database(DB_PATH);

db.pragma("foreign_keys = ON");
db.pragma("journal_mode = WAL");

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        challenge_start_date TEXT NOT NULL,
        challenge_days INTEGER NOT NULL DEFAULT 75,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS habits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT DEFAULT '',
        schedule TEXT NOT NULL CHECK(schedule IN ('daily', 'weekdays')),
        start_date TEXT NOT NULL,
        archived INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (user_id)
            REFERENCES users(id)
            ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS habit_completions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        habit_id INTEGER NOT NULL,
        completed_date TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

        UNIQUE(habit_id, completed_date),

        FOREIGN KEY (habit_id)
            REFERENCES habits(id)
            ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_habits_user_id
    ON habits(user_id);

    CREATE INDEX IF NOT EXISTS idx_completions_habit_id
    ON habit_completions(habit_id);

    CREATE INDEX IF NOT EXISTS idx_completions_date
    ON habit_completions(completed_date);
`);

const user = db.prepare(`
    SELECT id
    FROM users
    LIMIT 1
`).get();

if (!user) {
    const today = new Date().toISOString().slice(0, 10);

    db.prepare(`
        INSERT INTO users (
            name,
            challenge_start_date,
            challenge_days
        )
        VALUES (?, ?, ?)
    `).run("Ananya", today, 75);
}

module.exports = db;