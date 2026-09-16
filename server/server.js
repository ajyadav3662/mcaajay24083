const express = require("express");
const cors = require("cors");
const path = require("path");

const db = require("./db");

const {
    calculateCurrentStreak,
    calculateBestStreak,
    isScheduledDate
} = require("./streak");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(
    express.static(
        path.join(__dirname, "..", "public")
    )
);

/* ---------------------------------
   HELPERS
---------------------------------- */

function getToday() {
    return new Date()
        .toISOString()
        .slice(0, 10);
}

function isValidDate(value) {
    if (
        typeof value !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(value)
    ) {
        return false;
    }

    const date = new Date(`${value}T00:00:00Z`);

    return (
        !Number.isNaN(date.getTime()) &&
        date.toISOString().slice(0, 10) === value
    );
}

function getUser() {
    return db.prepare(`
        SELECT *
        FROM users
        ORDER BY id
        LIMIT 1
    `).get();
}

function getCompletions(habitId) {
    return db.prepare(`
        SELECT completed_date
        FROM habit_completions
        WHERE habit_id = ?
        ORDER BY completed_date ASC
    `).all(habitId);
}

function addHabitStats(habit) {
    const completions =
        getCompletions(habit.id);

    const currentDate = getToday();

    return {
        ...habit,

        archived: Boolean(
            habit.archived
        ),

        completedToday:
            completions.some(
                item =>
                    item.completed_date ===
                    currentDate
            ),

        currentStreak:
            calculateCurrentStreak(
                completions,
                habit.schedule,
                currentDate
            ),

        bestStreak:
            calculateBestStreak(
                completions,
                habit.schedule
            )
    };
}

/* ---------------------------------
   HEALTH CHECK
---------------------------------- */

app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        application: "Ananya 75-Day Challenge"
    });
});

/* ---------------------------------
   USER
---------------------------------- */

app.get("/api/user", (req, res) => {
    res.json(getUser());
});

/* ---------------------------------
   TODAY
---------------------------------- */

app.get("/api/today", (req, res) => {
    const user = getUser();
    const date = getToday();

    const habits = db.prepare(`
        SELECT *
        FROM habits
        WHERE user_id = ?
          AND archived = 0
          AND start_date <= ?
        ORDER BY created_at ASC
    `).all(user.id, date);

    const todaysHabits = habits
        .filter(habit =>
            isScheduledDate(
                date,
                habit.schedule
            )
        )
        .map(addHabitStats);

    const completed =
        todaysHabits.filter(
            habit => habit.completedToday
        ).length;

    const start =
        new Date(
            `${user.challenge_start_date}T00:00:00Z`
        );

    const current =
        new Date(
            `${date}T00:00:00Z`
        );

    let challengeDay =
        Math.floor(
            (current - start) /
            86400000
        ) + 1;

    challengeDay = Math.max(
        1,
        Math.min(
            challengeDay,
            user.challenge_days
        )
    );

    res.json({
        date,
        challengeDay,
        challengeDays: user.challenge_days,
        completed,
        remaining:
            todaysHabits.length - completed,
        total: todaysHabits.length,
        habits: todaysHabits
    });
});

/* ---------------------------------
   GET HABITS
---------------------------------- */

app.get("/api/habits", (req, res) => {
    const user = getUser();

    const archived =
        req.query.archived === "true"
            ? 1
            : 0;

    const habits = db.prepare(`
        SELECT *
        FROM habits
        WHERE user_id = ?
          AND archived = ?
        ORDER BY created_at DESC
    `).all(user.id, archived);

    res.json(
        habits.map(addHabitStats)
    );
});

/* ---------------------------------
   SEARCH HABITS
---------------------------------- */

app.get("/api/habits/search", (req, res) => {
    const user = getUser();

    const query =
        String(req.query.q || "").trim();

    if (!query) {
        return res.json([]);
    }

    const habits = db.prepare(`
        SELECT *
        FROM habits
        WHERE user_id = ?
          AND name LIKE ?
        ORDER BY name ASC
    `).all(
        user.id,
        `%${query}%`
    );

    res.json(
        habits.map(addHabitStats)
    );
});

/* ---------------------------------
   GET SINGLE HABIT
---------------------------------- */

app.get("/api/habits/:id", (req, res) => {
    const habit = db.prepare(`
        SELECT *
        FROM habits
        WHERE id = ?
    `).get(req.params.id);

    if (!habit) {
        return res.status(404).json({
            error: "Habit not found"
        });
    }

    res.json(addHabitStats(habit));
});

/* ---------------------------------
   CREATE HABIT
---------------------------------- */

app.post("/api/habits", (req, res) => {
    const {
        name,
        description = "",
        schedule = "daily",
        startDate = getToday()
    } = req.body;

    if (
        typeof name !== "string" ||
        !name.trim()
    ) {
        return res.status(400).json({
            error: "Habit name is required"
        });
    }

    if (
        !["daily", "weekdays"]
            .includes(schedule)
    ) {
        return res.status(400).json({
            error:
                "Schedule must be daily or weekdays"
        });
    }

    if (!isValidDate(startDate)) {
        return res.status(400).json({
            error: "Invalid start date"
        });
    }

    const user = getUser();

    const result = db.prepare(`
        INSERT INTO habits (
            user_id,
            name,
            description,
            schedule,
            start_date
        )
        VALUES (?, ?, ?, ?, ?)
    `).run(
        user.id,
        name.trim(),
        String(description).trim(),
        schedule,
        startDate
    );

    const habit = db.prepare(`
        SELECT *
        FROM habits
        WHERE id = ?
    `).get(result.lastInsertRowid);

    res.status(201).json(
        addHabitStats(habit)
    );
});

/* ---------------------------------
   UPDATE HABIT
---------------------------------- */

app.put("/api/habits/:id", (req, res) => {
    const {
        name,
        description = "",
        schedule
    } = req.body;

    const habit = db.prepare(`
        SELECT *
        FROM habits
        WHERE id = ?
    `).get(req.params.id);

    if (!habit) {
        return res.status(404).json({
            error: "Habit not found"
        });
    }

    if (
        typeof name !== "string" ||
        !name.trim()
    ) {
        return res.status(400).json({
            error: "Habit name is required"
        });
    }

    if (
        !["daily", "weekdays"]
            .includes(schedule)
    ) {
        return res.status(400).json({
            error:
                "Schedule must be daily or weekdays"
        });
    }

    db.prepare(`
        UPDATE habits
        SET
            name = ?,
            description = ?,
            schedule = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `).run(
        name.trim(),
        String(description).trim(),
        schedule,
        req.params.id
    );

    const updated = db.prepare(`
        SELECT *
        FROM habits
        WHERE id = ?
    `).get(req.params.id);

    res.json(
        addHabitStats(updated)
    );
});

/* ---------------------------------
   COMPLETE HABIT
---------------------------------- */

app.post(
    "/api/habits/:id/complete",
    (req, res) => {

        const date =
            req.body.date || getToday();

        if (!isValidDate(date)) {
            return res.status(400).json({
                error: "Invalid completion date"
            });
        }

        const habit = db.prepare(`
            SELECT *
            FROM habits
            WHERE id = ?
        `).get(req.params.id);

        if (!habit) {
            return res.status(404).json({
                error: "Habit not found"
            });
        }

        if (habit.archived) {
            return res.status(400).json({
                error:
                    "Archived habits cannot be completed"
            });
        }

        if (
            !isScheduledDate(
                date,
                habit.schedule
            )
        ) {
            return res.status(400).json({
                error:
                    "Habit is not scheduled for this date"
            });
        }

        try {
            db.prepare(`
                INSERT INTO habit_completions (
                    habit_id,
                    completed_date
                )
                VALUES (?, ?)
            `).run(
                habit.id,
                date
            );
        } catch (error) {

            if (
                error.code ===
                "SQLITE_CONSTRAINT_UNIQUE"
            ) {
                return res.status(409).json({
                    error:
                        "Habit is already completed for this date"
                });
            }

            throw error;
        }

        const updated = db.prepare(`
            SELECT *
            FROM habits
            WHERE id = ?
        `).get(habit.id);

        res.json(
            addHabitStats(updated)
        );
    }
);

/* ---------------------------------
   UNCOMPLETE HABIT
---------------------------------- */

app.delete(
    "/api/habits/:id/complete/:date",
    (req, res) => {

        if (!isValidDate(req.params.date)) {
            return res.status(400).json({
                error: "Invalid date"
            });
        }

        const habit = db.prepare(`
            SELECT *
            FROM habits
            WHERE id = ?
        `).get(req.params.id);

        if (!habit) {
            return res.status(404).json({
                error: "Habit not found"
            });
        }

        db.prepare(`
            DELETE FROM habit_completions
            WHERE habit_id = ?
              AND completed_date = ?
        `).run(
            req.params.id,
            req.params.date
        );

        res.json(
            addHabitStats(habit)
        );
    }
);

/* ---------------------------------
   COMPLETION HISTORY
---------------------------------- */

app.get(
    "/api/habits/:id/history",
    (req, res) => {

        const habit = db.prepare(`
            SELECT id
            FROM habits
            WHERE id = ?
        `).get(req.params.id);

        if (!habit) {
            return res.status(404).json({
                error: "Habit not found"
            });
        }

        const history = db.prepare(`
            SELECT completed_date
            FROM habit_completions
            WHERE habit_id = ?
            ORDER BY completed_date DESC
        `).all(req.params.id);

        res.json(history);
    }
);

/* ---------------------------------
   ARCHIVE
---------------------------------- */

app.post(
    "/api/habits/:id/archive",
    (req, res) => {

        const result = db.prepare(`
            UPDATE habits
            SET
                archived = 1,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(req.params.id);

        if (!result.changes) {
            return res.status(404).json({
                error: "Habit not found"
            });
        }

        res.json({
            message:
                "Habit archived successfully"
        });
    }
);

/* ---------------------------------
   RESTORE
---------------------------------- */

app.post(
    "/api/habits/:id/restore",
    (req, res) => {

        const result = db.prepare(`
            UPDATE habits
            SET
                archived = 0,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(req.params.id);

        if (!result.changes) {
            return res.status(404).json({
                error: "Habit not found"
            });
        }

        res.json({
            message:
                "Habit restored successfully"
        });
    }
);

/* ---------------------------------
   404 API
---------------------------------- */

app.use("/api", (req, res) => {
    res.status(404).json({
        error: "API endpoint not found"
    });
});

/* ---------------------------------
   ERROR HANDLER
---------------------------------- */

app.use((error, req, res, next) => {
    console.error(error);

    res.status(500).json({
        error: "Internal server error"
    });
});

/* ---------------------------------
   START
---------------------------------- */

app.listen(PORT, () => {
    console.log(
        `Ananya 75-Day Challenge running on port ${PORT}`
    );
});