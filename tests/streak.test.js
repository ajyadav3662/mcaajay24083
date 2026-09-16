const assert = require("assert");

const {
    calculateCurrentStreak,
    calculateBestStreak,
    isScheduledDate
} = require("../server/streak");

console.log("\nRunning streak tests...\n");


/* DAILY STREAK */

assert.strictEqual(
    calculateCurrentStreak(
        [
            "2026-09-14",
            "2026-09-15",
            "2026-09-16"
        ],
        "daily",
        "2026-09-16"
    ),
    3
);

console.log(
    "✓ Daily consecutive streak"
);


/* MISSED DAILY DAY */

assert.strictEqual(
    calculateCurrentStreak(
        [
            "2026-09-14",
            "2026-09-16"
        ],
        "daily",
        "2026-09-16"
    ),
    1
);

console.log(
    "✓ Missed daily day breaks streak"
);


/* WEEKDAY STREAK */

assert.strictEqual(
    calculateCurrentStreak(
        [
            "2026-09-14",
            "2026-09-15",
            "2026-09-16"
        ],
        "weekdays",
        "2026-09-16"
    ),
    3
);

console.log(
    "✓ Weekday consecutive streak"
);


/* WEEKEND DOES NOT BREAK STREAK */

assert.strictEqual(
    calculateCurrentStreak(
        [
            "2026-09-11",
            "2026-09-14"
        ],
        "weekdays",
        "2026-09-14"
    ),
    2
);

console.log(
    "✓ Weekend does not break weekday streak"
);


/* MISSED FRIDAY */

assert.strictEqual(
    calculateCurrentStreak(
        [
            "2026-09-10",
            "2026-09-14"
        ],
        "weekdays",
        "2026-09-14"
    ),
    1
);

console.log(
    "✓ Missed weekday breaks streak"
);


/* BEST DAILY STREAK */

assert.strictEqual(
    calculateBestStreak(
        [
            "2026-09-10",
            "2026-09-11",
            "2026-09-12",
            "2026-09-14"
        ],
        "daily"
    ),
    3
);

console.log(
    "✓ Best-ever daily streak"
);


/* BEST WEEKDAY STREAK */

assert.strictEqual(
    calculateBestStreak(
        [
            "2026-09-07",
            "2026-09-08",
            "2026-09-09",
            "2026-09-10",
            "2026-09-11",
            "2026-09-14"
        ],
        "weekdays"
    ),
    6
);

console.log(
    "✓ Best-ever weekday streak"
);


/* NO COMPLETIONS */

assert.strictEqual(
    calculateCurrentStreak(
        [],
        "daily",
        "2026-09-16"
    ),
    0
);

assert.strictEqual(
    calculateBestStreak(
        [],
        "daily"
    ),
    0
);

console.log(
    "✓ Empty completion history"
);


/* SCHEDULE */

assert.strictEqual(
    isScheduledDate(
        "2026-09-14",
        "weekdays"
    ),
    true
);

assert.strictEqual(
    isScheduledDate(
        "2026-09-13",
        "weekdays"
    ),
    false
);

assert.strictEqual(
    isScheduledDate(
        "2026-09-13",
        "daily"
    ),
    true
);

console.log(
    "✓ Schedule validation"
);


console.log(
    "\nAll streak tests passed! ✓\n"
);