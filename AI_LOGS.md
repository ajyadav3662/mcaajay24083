Today 2:33 PM
i am giving you a few lines of a real world problem and from which you have to give me a working solution so that i can upload it on my github and on github you have to make 3 files readme.md,reasoning.md and 3rd one is for ai chat and i only have 2.5 hours for this complete project and make sure to make a perfect solution for me

Absolutely. Send me the real-world problem statement exactly as you received it.

I’ll treat this as a 2.5-hour GitHub-ready project, not just an explanation. I’ll help you build something that is:

✅ Actually working
✅ Easy to run and demonstrate
✅ Clean enough for GitHub
✅ Appropriate for a coding/technical assessment
✅ Includes the required 3 files
README.md
reasoning.md
An AI Chat / AI solution file — I’ll determine the appropriate name/format from the problem
✅ Includes proper project structure
✅ Includes sample input/output or API examples where relevant
✅ Includes error handling and edge cases
✅ Includes a clear explanation of the solution
✅ Designed so you can finish within 2.5 hours
How we'll work

Once you give me the problem, I'll break it down like this:

1. Understand the requirement
What the real-world problem actually asks us to solve.

2. Choose the simplest reliable technology
We'll avoid unnecessary complexity because you only have 2.5 hours.

3. Build the project

project/
│
├── README.md
├── reasoning.md
├── AI_Chat.md
│
├── src/
│   └── ...
│
├── tests/
│   └── ...
│
└── requirements.txt / package.json

I'll adjust this structure based on the actual problem.

4. Give you complete code
Not pseudo-code — code you can actually run.

5. Test important cases
We'll check normal cases, edge cases, and likely assessment cases.

6. Prepare GitHub files
I'll write the README so someone opening your repository immediately understands:

Problem
Solution
Features
Architecture
Setup
How to run
API/usage
Example
Future improvements

7. reasoning.md will explain your engineering decisions:

Why this approach?
Alternatives considered
Time/space complexity
Edge cases
Trade-offs
What could be improved

8. AI Chat file
We'll document how AI was used during development, including the prompts/conversation or AI-assisted decisions required by the assessment, while keeping the actual implementation understandable.

Most important

Since you have only 2.5 hours, I will prioritize:

Working solution → correctness → clean structure → documentation → polish

rather than trying to build an unnecessarily large application.

Send me the problem statement now. If there are screenshots, PDFs, requirements, or starter files, upload those too.




ok now 
there is a little change in the plan help me in this 

Yes. The new twist is important and we should explicitly implement it:

Every morning, the app should remind the user about habits they have not logged yet for that day.

Your current app already knows which habits are completed today, so we can add this without changing the database.

What we'll add

When Ananya opens the app in the morning:

Show a Morning Reminder banner.
Display the number/names of habits still incomplete.

Example:

☀️ Good morning! You still have 2 habits to log today: Drink Water, Workout

The reminder disappears once all today's habits are completed.
Also attempt a browser notification once per day if notification permission is available.
The normal habit cards remain unchanged.
This works for any user and any habits, not just Ananya.

We only need to modify 3 files:

public/index.html
public/style.css
public/app.js

No database change is required.

1. Replace public/index.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >
    <meta
        name="description"
        content="A simple and reliable 75-day habit and streak tracker."
    >
    <title>Ananya's 75-Day Challenge</title>
    <link rel="stylesheet" href="style.css">
</head>

<body>
    <div class="app">

        <header class="header">
            <div>
                <div class="label">
                    SELF IMPROVEMENT
                </div>

                <h1>
                    Ananya's 75-Day Challenge
                </h1>

                <p id="todayDate">
                    Loading date...
                </p>
            </div>

            <div class="challenge-box">
                <div class="challenge-label">
                    CHALLENGE PROGRESS
                </div>

                <strong id="challengeDay">
                    Day 1 / 75
                </strong>

                <div class="progress-track">
                    <div
                        id="progressBar"
                        class="progress-bar"
                    ></div>
                </div>
            </div>
        </header>


        <!-- MORNING REMINDER -->

        <section
            id="morningReminder"
            class="morning-reminder hidden"
        >
            <div class="reminder-icon">
                ☀️
            </div>

            <div class="reminder-content">
                <strong>
                    Good morning!
                </strong>

                <p id="reminderMessage">
                    You still have habits to complete today.
                </p>
            </div>

            <button
                class="reminder-close"
                onclick="dismissReminder()"
                aria-label="Dismiss reminder"
            >
                ×
            </button>
        </section>


        <section class="summary">

            <div class="summary-card">
                <span>
                    Completed Today
                </span>

                <strong id="completedCount">
                    0
                </strong>
            </div>

            <div class="summary-card">
                <span>
                    Remaining
                </span>

                <strong id="remainingCount">
                    0
                </strong>
            </div>

            <div class="summary-card">
                <span>
                    Today's Habits
                </span>

                <strong id="totalCount">
                    0
                </strong>
            </div>

        </section>


        <section>

            <div class="section-header">

                <div>
                    <div class="label">
                        TODAY
                    </div>

                    <h2>
                        Today's Habits
                    </h2>
                </div>

                <button
                    class="primary-button"
                    onclick="openAddModal()"
                >
                    + Add Habit
                </button>

            </div>

            <div
                id="todayHabits"
                class="habit-grid"
            ></div>

        </section>


        <section class="management">

            <div class="section-header">

                <div>
                    <div class="label">
                        HABIT MANAGEMENT
                    </div>

                    <h2>
                        Your Habits
                    </h2>
                </div>

                <div class="management-controls">

                    <input
                        id="searchInput"
                        type="search"
                        placeholder="Search habits..."
                        oninput="searchHabits()"
                    >

                    <button
                        class="primary-button"
                        onclick="openAddModal()"
                    >
                        + Add
                    </button>

                </div>

            </div>


            <div class="tabs">

                <button
                    id="activeTab"
                    class="tab active"
                    onclick="switchTab(false)"
                >
                    Active
                </button>

                <button
                    id="archivedTab"
                    class="tab"
                    onclick="switchTab(true)"
                >
                    Archived
                </button>

            </div>


            <div
                id="habitList"
                class="habit-list"
            ></div>

        </section>

    </div>


    <!-- HABIT MODAL -->

    <div
        id="habitModal"
        class="modal hidden"
    >

        <div class="modal-card">

            <div class="modal-header">

                <div>
                    <div class="label">
                        HABIT
                    </div>

                    <h2 id="modalTitle">
                        Add Habit
                    </h2>
                </div>

                <button
                    class="close-button"
                    onclick="closeModal()"
                >
                    ×
                </button>

            </div>


            <form id="habitForm">

                <input
                    type="hidden"
                    id="habitId"
                >


                <label>
                    Habit Name

                    <input
                        id="habitName"
                        type="text"
                        placeholder="e.g. Drink Water"
                        maxlength="100"
                        required
                    >
                </label>


                <label>
                    Description

                    <textarea
                        id="habitDescription"
                        placeholder="Describe your habit..."
                        maxlength="500"
                    ></textarea>
                </label>


                <label>
                    Schedule

                    <select id="habitSchedule">

                        <option value="daily">
                            Every Day
                        </option>

                        <option value="weekdays">
                            Weekdays
                        </option>

                    </select>
                </label>


                <label>
                    Start Date

                    <input
                        id="habitStartDate"
                        type="date"
                        required
                    >
                </label>


                <div class="form-actions">

                    <button
                        type="button"
                        class="secondary-button"
                        onclick="closeModal()"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        class="primary-button"
                    >
                        Save Habit
                    </button>

                </div>

            </form>

        </div>

    </div>


    <div
        id="toast"
        class="toast"
    ></div>


    <script src="app.js"></script>

</body>
</html>
2. Add this to public/style.css

You do not need to replace the entire CSS file.

Add this section before the .summary CSS:

/* Morning Reminder */

.morning-reminder {
    display: flex;
    align-items: center;
    gap: 15px;

    background: var(--surface);
    border: 1px solid var(--border);
    border-left: 5px solid var(--text);

    border-radius: 15px;
    padding: 17px 20px;

    margin-bottom: 25px;

    box-shadow:
        0 8px 24px
        rgba(20, 30, 50, 0.05);
}

.morning-reminder.hidden {
    display: none;
}

.reminder-icon {
    font-size: 28px;
    flex-shrink: 0;
}

.reminder-content {
    flex: 1;
}

.reminder-content strong {
    display: block;
    font-size: 16px;
    margin-bottom: 4px;
}

.reminder-content p {
    color: var(--muted);
    font-size: 14px;
    line-height: 1.45;
}

.reminder-close {
    border: none;
    background: transparent;
    color: var(--muted);

    font-size: 24px;
    line-height: 1;

    padding: 5px;
}

.reminder-close:hover {
    color: var(--text);
}

And inside the existing mobile media query, add:

    .morning-reminder {
        align-items: flex-start;
    }
3. Replace public/app.js

Use this updated version:

let archivedView = false;

const $ = id =>
    document.getElementById(id);


async function api(
    url,
    options = {}
) {
    const response = await fetch(
        url,
        {
            headers: {
                "Content-Type":
                    "application/json"
            },
            ...options
        }
    );

    const data =
        await response.json();

    if (!response.ok) {
        throw new Error(
            data.error ||
            "Something went wrong"
        );
    }

    return data;
}


function showToast(message) {
    const toast =
        $("toast");

    toast.textContent =
        message;

    toast.classList.add(
        "show"
    );

    setTimeout(() => {
        toast.classList.remove(
            "show"
        );
    }, 2500);
}


function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================
   MORNING REMINDER
========================= */

function showMorningReminder(
    habits
) {
    const reminder =
        $("morningReminder");

    const message =
        $("reminderMessage");

    const incompleteHabits =
        habits.filter(
            habit =>
                !habit.completedToday
        );

    if (!incompleteHabits.length) {
        reminder.classList.add(
            "hidden"
        );

        return;
    }

    const habitNames =
        incompleteHabits
            .map(
                habit =>
                    habit.name
            );

    let habitText;

    if (habitNames.length === 1) {
        habitText =
            `You still have 1 habit to log today: ${habitNames[0]}.`;
    } else if (habitNames.length === 2) {
        habitText =
            `You still have 2 habits to log today: ${habitNames.join(" and ")}.`;
    } else {
        const last =
            habitNames.pop();

        habitText =
            `You still have ${incompleteHabits.length} habits to log today: ${habitNames.join(", ")}, and ${last}.`;
    }

    message.textContent =
        habitText;

    reminder.classList.remove(
        "hidden"
    );

    sendBrowserReminder(
        incompleteHabits
    );
}


function dismissReminder() {
    $("morningReminder")
        .classList.add(
            "hidden"
        );
}


/* Browser notification */

function sendBrowserReminder(
    incompleteHabits
) {
    if (
        !("Notification" in window)
    ) {
        return;
    }

    const currentHour =
        new Date().getHours();

    /*
       Morning reminder window:
       5:00 AM - 11:59 AM
    */

    if (
        currentHour < 5 ||
        currentHour >= 12
    ) {
        return;
    }

    const today =
        new Date()
            .toISOString()
            .slice(0, 10);

    const reminderKey =
        `ananya-reminder-${today}`;

    if (
        localStorage.getItem(
            reminderKey
        )
    ) {
        return;
    }

    const names =
        incompleteHabits
            .map(
                habit =>
                    habit.name
            )
            .join(", ");

    if (
        Notification.permission ===
        "granted"
    ) {
        new Notification(
            "Ananya's Morning Reminder",
            {
                body:
                    `You still have habits to log today: ${names}`,
                icon: "/favicon.ico"
            }
        );

        localStorage.setItem(
            reminderKey,
            "sent"
        );

        return;
    }

    if (
        Notification.permission ===
        "default"
    ) {
        Notification
            .requestPermission()
            .then(
                permission => {

                    if (
                        permission ===
                        "granted"
                    ) {
                        new Notification(
                            "Ananya's Morning Reminder",
                            {
                                body:
                                    `You still have habits to log today: ${names}`
                            }
                        );

                        localStorage.setItem(
                            reminderKey,
                            "sent"
                        );
                    }

                }
            )
            .catch(() => {
                /*
                    Browser notification is optional.
                    In-app reminder still works.
                */
            });
    }
}


/* =========================
   TODAY
========================= */

async function loadToday() {
    try {
        const data =
            await api(
                "/api/today"
            );

        const date =
            new Date(
                `${data.date}T00:00:00`
            );

        $("todayDate")
            .textContent =
            date.toLocaleDateString(
                undefined,
                {
                    weekday:
                        "long",
                    year:
                        "numeric",
                    month:
                        "long",
                    day:
                        "numeric"
                }
            );

        $("challengeDay")
            .textContent =
            `Day ${data.challengeDay} / ${data.challengeDays}`;

        const percentage =
            (
                data.challengeDay /
                data.challengeDays
            ) * 100;

        $("progressBar")
            .style.width =
            `${Math.min(
                percentage,
                100
            )}%`;

        $("completedCount")
            .textContent =
            data.completed;

        $("remainingCount")
            .textContent =
            data.remaining;

        $("totalCount")
            .textContent =
            data.total;


        /* NEW:
           Show morning reminder
        */

        showMorningReminder(
            data.habits
        );


        renderTodayHabits(
            data.habits
        );

    } catch (error) {
        showToast(
            error.message
        );
    }
}


function renderTodayHabits(
    habits
) {
    const container =
        $("todayHabits");

    if (!habits.length) {
        container.innerHTML = `
            <div class="empty">
                <h3>No habits scheduled today</h3>
                <p>
                    Add a habit to start building
                    your streak.
                </p>
            </div>
        `;

        return;
    }

    container.innerHTML =
        habits.map(
            habit => `
                <div class="habit-card">

                    <div class="habit-name">
                        ${escapeHtml(
                            habit.name
                        )}
                    </div>

                    <div class="habit-description">
                        ${escapeHtml(
                            habit.description ||
                            ""
                        )}
                    </div>

                    <span class="schedule">
                        ${
                            habit.schedule ===
                            "daily"
                                ? "Every Day"
                                : "Weekdays"
                        }
                    </span>

                    <div class="stats">

                        <div class="stat">
                            <span>
                                Current streak
                            </span>

                            <strong>
                                🔥
                                ${habit.currentStreak}
                            </strong>
                        </div>

                        <div class="stat">
                            <span>
                                Best streak
                            </span>

                            <strong>
                                🏆
                                ${habit.bestStreak}
                            </strong>
                        </div>

                    </div>

                    <button
                        class="
                            complete-button
                            ${
                                habit.completedToday
                                    ? "completed"
                                    : ""
                            }
                        "
                        onclick="
                            toggleCompletion(
                                ${habit.id},
                                ${habit.completedToday}
                            )
                        "
                    >
                        ${
                            habit.completedToday
                                ? "✓ Completed Today"
                                : "Mark Complete"
                        }
                    </button>

                </div>
            `
        ).join("");
}


/* =========================
   COMPLETION
========================= */

async function toggleCompletion(
    id,
    completed
) {
    try {
        const today =
            new Date()
                .toISOString()
                .slice(0, 10);

        if (completed) {

            await api(
                `/api/habits/${id}/complete/${today}`,
                {
                    method:
                        "DELETE"
                }
            );

            showToast(
                "Completion removed"
            );

        } else {

            await api(
                `/api/habits/${id}/complete`,
                {
                    method:
                        "POST",
                    body:
                        JSON.stringify({})
                }
            );

            showToast(
                "Habit completed! 🔥"
            );
        }

        await loadToday();

        await loadHabits(
            archivedView
        );

    } catch (error) {
        showToast(
            error.message
        );
    }
}


/* =========================
   HABIT MANAGEMENT
========================= */

async function loadHabits(
    archived = false
) {
    archivedView =
        archived;

    $("activeTab")
        .classList.toggle(
            "active",
            !archived
        );

    $("archivedTab")
        .classList.toggle(
            "active",
            archived
        );

    try {
        const habits =
            await api(
                `/api/habits?archived=${archived}`
            );

        renderHabitList(
            habits
        );

    } catch (error) {
        showToast(
            error.message
        );
    }
}


function switchTab(
    archived
) {
    $("searchInput")
        .value = "";

    loadHabits(
        archived
    );
}


function renderHabitList(
    habits
) {
    const container =
        $("habitList");

    if (!habits.length) {
        container.innerHTML = `
            <div class="empty">
                No habits found.
            </div>
        `;

        return;
    }

    container.innerHTML =
        habits.map(
            habit => `
                <div class="list-item">

                    <div>

                        <div class="list-name">
                            ${escapeHtml(
                                habit.name
                            )}
                        </div>

                        <div class="list-meta">
                            ${
                                habit.schedule ===
                                "daily"
                                    ? "Every Day"
                                    : "Weekdays"
                            }
                            · Current:
                            ${habit.currentStreak}
                            · Best:
                            ${habit.bestStreak}
                        </div>

                    </div>

                    <div class="list-actions">

                        ${
                            !habit.archived
                                ? `
                                    <button
                                        class="small-button"
                                        onclick="
                                            editHabit(
                                                ${habit.id}
                                            )
                                        "
                                    >
                                        Edit
                                    </button>

                                    <button
                                        class="small-button"
                                        onclick="
                                            archiveHabit(
                                                ${habit.id}
                                            )
                                        "
                                    >
                                        Archive
                                    </button>
                                `
                                : `
                                    <button
                                        class="small-button"
                                        onclick="
                                            restoreHabit(
                                                ${habit.id}
                                            )
                                        "
                                    >
                                        Restore
                                    </button>
                                `
                        }

                    </div>

                </div>
            `
        ).join("");
}


/* =========================
   MODAL
========================= */

function openAddModal() {

    $("modalTitle")
        .textContent =
        "Add Habit";

    $("habitId")
        .value = "";

    $("habitName")
        .value = "";

    $("habitDescription")
        .value = "";

    $("habitSchedule")
        .value = "daily";

    $("habitStartDate")
        .value =
        new Date()
            .toISOString()
            .slice(0, 10);

    $("habitModal")
        .classList.remove(
            "hidden"
        );
}


function closeModal() {

    $("habitModal")
        .classList.add(
            "hidden"
        );
}


async function editHabit(
    id
) {
    try {

        const habit =
            await api(
                `/api/habits/${id}`
            );

        $("modalTitle")
            .textContent =
            "Edit Habit";

        $("habitId")
            .value =
            habit.id;

        $("habitName")
            .value =
            habit.name;

        $("habitDescription")
            .value =
            habit.description ||
            "";

        $("habitSchedule")
            .value =
            habit.schedule;

        $("habitStartDate")
            .value =
            habit.start_date;

        $("habitModal")
            .classList.remove(
                "hidden"
            );

    } catch (error) {
        showToast(
            error.message
        );
    }
}


/* =========================
   SAVE HABIT
========================= */

$("habitForm")
    .addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            const id =
                $("habitId")
                    .value;

            const payload = {

                name:
                    $("habitName")
                        .value,

                description:
                    $("habitDescription")
                        .value,

                schedule:
                    $("habitSchedule")
                        .value,

                startDate:
                    $("habitStartDate")
                        .value
            };

            try {

                if (id) {

                    await api(
                        `/api/habits/${id}`,
                        {
                            method:
                                "PUT",

                            body:
                                JSON.stringify(
                                    payload
                                )
                        }
                    );

                    showToast(
                        "Habit updated"
                    );

                } else {

                    await api(
                        "/api/habits",
                        {
                            method:
                                "POST",

                            body:
                                JSON.stringify(
                                    payload
                                )
                        }
                    );

                    showToast(
                        "Habit created"
                    );
                }

                closeModal();

                await loadToday();

                await loadHabits(
                    archivedView
                );

            } catch (error) {

                showToast(
                    error.message
                );
            }
        }
    );


/* =========================
   ARCHIVE / RESTORE
========================= */

async function archiveHabit(
    id
) {
    if (
        !confirm(
            "Archive this habit? You can restore it later."
        )
    ) {
        return;
    }

    try {

        await api(
            `/api/habits/${id}/archive`,
            {
                method:
                    "POST"
            }
        );

        showToast(
            "Habit archived"
        );

        await loadToday();

        await loadHabits(
            false
        );

    } catch (error) {

        showToast(
            error.message
        );
    }
}


async function restoreHabit(
    id
) {
    try {

        await api(
            `/api/habits/${id}/restore`,
            {
                method:
                    "POST"
            }
        );

        showToast(
            "Habit restored"
        );

        await loadToday();

        await loadHabits(
            true
        );

    } catch (error) {

        showToast(
            error.message
        );
    }
}


/* =========================
   SEARCH
========================= */

let searchTimer;


function searchHabits() {

    clearTimeout(
        searchTimer
    );

    searchTimer =
        setTimeout(
            async () => {

                const query =
                    $("searchInput")
                        .value
                        .trim();

                if (!query) {

                    await loadHabits(
                        archivedView
                    );

                    return;
                }

                try {

                    const habits =
                        await api(
                            `/api/habits/search?q=${encodeURIComponent(
                                query
                            )}`
                        );

                    renderHabitList(
                        habits
                    );

                } catch (error) {

                    showToast(
                        error.message
                    );
                }

            },
            250
        );
}


/* =========================
   MODAL CLOSE
========================= */

$("habitModal")
    .addEventListener(
        "click",
        event => {

            if (
                event.target ===
                $("habitModal")
            ) {
                closeModal();
            }

        }
    );


/* =========================
   INITIAL LOAD
========================= */

loadToday();

loadHabits(false);
4. Test it

Your server should already be running. If not:

npm start

Open:

http://localhost:3000

Add these habits:

Drink Water     → Every Day
Read            → Every Day
Workout         → Weekdays

Refresh the page.

You should see something like:

☀️ Good morning!
You still have 3 habits to log today: Drink Water, Read, and Workout.

Then click Mark Complete on one.

The reminder should update to:

☀️ Good morning!
You still have 2 habits to log today: Read and Workout.

Complete everything and the reminder disappears.

This directly addresses the new "Twist"

Your feature set is now:

✅ Daily habits
✅ Weekday habits
✅ Today's habits
✅ One-click completion
✅ Undo completion
✅ Current streak
✅ Best-ever streak
✅ Search
✅ Edit/update
✅ Archive
✅ Restore
✅ Persistent SQLite storage
✅ 75-day progress
✅ Morning reminder for unlogged habits
✅ Optional browser notification
✅ Tests

Do not change the backend yet. First test this UI. If it works, we should update README.md and REASONING.md to explicitly mention the new morning-reminder requirement, then commit and push the final version.

ok now next

Good. Now we do the final submission pass. Don't add more features unless a test fails.

Step 1 — Run the automated tests

In your terminal:

npm test

You should get:

All streak tests passed! ✓
Step 2 — Verify the project is committed

Run:

git status

If it shows modified files (public/app.js, public/index.html, public/style.css), run:

git add .
git commit -m "Add morning habit reminders"
git push
Step 3 — Verify GitHub

Open your repository:

GitHub repository — ajyadav3662/mcaajay24083

Make sure these are visible:

README.md
REASONING.md
AI_LOGS.md
.gitignore
package.json
package-lock.json

server/
  db.js
  server.js
  streak.js

public/
  index.html
  style.css
  app.js

tests/
  streak.test.js

data/
  .gitkeep
Step 4 — Important: AI_LOGS.md

Do not leave this as a fabricated conversation.

The assessment specifically says:

complete copy of candidate's AI conversation, pasted as-is and not modified.

So put your actual AI conversation transcript into AI_LOGS.md, exactly as required by the assessment. Don't invent or edit a transcript.

Step 5 — Final test

Run:

npm test

Then:

npm start

Open:

http://localhost:3000

Test:

Add → Complete → Undo → Edit → Search → Archive → Restore → Refresh

If all of those work, stop coding. At this point the priority is submission, not adding extra features.

REASONING.md  
write a perfect description for this

Absolutely. For the assessment, REASONING.md should clearly show how you interpreted the requirements, why you made each technical decision, how streaks work, and how edge cases are handled.

Replace the contents of REASONING.md with this:

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

The frontend does not directly access the database.

Instead:

Frontend → REST API → Database

This separation makes the application easier to maintain and allows the business logic to remain on the server.

5. Data Model

The database contains three main tables.

Users

The users table stores:

User ID
User name
Challenge start date
Challenge duration
Creation timestamp

The application starts with a default challenge user so the project can be used immediately without requiring an authentication system.

The challenge duration is stored as data rather than hard-coded into the UI.

Habits

The habits table stores:

Habit ID
User ID
Habit name
Description
Schedule
Start date
Archive status
Creation timestamp
Updated timestamp

The schedule is restricted to:

daily
weekdays

This prevents unsupported schedule values from entering the database.

Habit Completions

The habit_completions table stores:

Completion ID
Habit ID
Completion date
Creation timestamp

The most important database constraint is:

UNIQUE(habit_id, completed_date)

This means a habit can only be completed once for a particular date.

6. Why Completion Records Are Stored Separately

I considered storing a simple completed boolean on the habit itself.

That would not be sufficient because streaks depend on historical dates.

For example:

September 14  ✓
September 15  ✓
September 16  ✓
September 17  ✗
September 18  ✓

The application needs the complete history to determine both current and best streaks.

Therefore, completion is represented as a dated event:

Habit + Date = Completion

This provides the information needed to calculate streaks at any time.

7. Preventing Duplicate Completions

A user should not be able to accidentally create:

Drink Water - 2026-09-16
Drink Water - 2026-09-16

as two separate completion records.

The database prevents this with:

UNIQUE(habit_id, completed_date)

The API also handles the duplicate constraint and returns an appropriate HTTP response instead of creating duplicate data.

This makes the database the final source of truth for data integrity.

8. Scheduling Logic

Each habit has one of two schedules:

daily
weekdays

For a daily habit:

Monday     ✓
Tuesday    ✓
Wednesday  ✓
Thursday   ✓
Friday     ✓
Saturday   ✓
Sunday     ✓

For a weekday habit:

Monday     ✓
Tuesday    ✓
Wednesday  ✓
Thursday   ✓
Friday     ✓
Saturday   -
Sunday     -

The isScheduledDate() function determines whether a habit should occur on a particular date.

This same scheduling logic is used by both the dashboard and completion API.

That prevents the frontend and backend from having different definitions of a scheduled day.

9. Today's Habits

The main dashboard is designed around the user's most immediate need:

"What do I need to do today?"

The /api/today endpoint:

Gets the current date.
Gets active habits.
Ignores habits that have not started yet.
Removes archived habits from today's list.
Filters habits according to their schedule.
Calculates completion status.
Calculates current and best streaks.
Returns the day's summary.

The response contains:

Today's date
Challenge day
Challenge duration
Completed count
Remaining count
Total habits
Today's habits

This allows the frontend to render the complete morning dashboard from one API request.

10. Current Streak Logic

The current streak represents consecutive completed scheduled days.

For example, for a daily habit:

Monday     ✓
Tuesday    ✓
Wednesday  ✓
Thursday   ✓

The current streak is:

4

If a scheduled day is missed:

Monday     ✓
Tuesday    ✓
Wednesday  ✗
Thursday   ✓

the previous streak is broken.

The algorithm does not simply subtract dates because schedules can differ.

Instead, it finds the previous scheduled date using:

getPreviousScheduledDate()

This is especially important for weekday habits.

11. Weekday Streak Handling

Weekends should not break a weekday habit streak.

For example:

Friday     ✓
Saturday   -
Sunday     -
Monday     ✓

This is still a consecutive weekday streak of:

2

The algorithm therefore moves backwards through scheduled dates rather than calendar dates.

For a weekday habit:

Monday → previous Friday
Tuesday → previous Monday

and so on.

This ensures weekends are ignored correctly.

12. Best-Ever Streak

The best-ever streak is calculated from the complete completion history.

Example:

Day 1  ✓
Day 2  ✓
Day 3  ✓
Day 4  ✗
Day 5  ✓
Day 6  ✓

The best streak is:

3

rather than the current streak of:

2

The algorithm sorts completion dates and checks whether each completion immediately follows the previous scheduled completion date.

The largest consecutive sequence becomes the best-ever streak.

13. Why Current and Best Streaks Are Calculated Separately

These two values answer different questions.

Current streak

"How long is my active run?"

Best streak

"What is the longest run I have ever achieved?"

Keeping them separate prevents historical performance from being confused with the current run.

Both values are calculated from the same completion history, which keeps the data model simple.

14. Completion and Undo

The main action on a today's habit is:

Mark Complete

When clicked, the frontend sends:

POST /api/habits/:id/complete

The server validates:

Habit exists
Habit is not archived
Date is valid
Habit is scheduled for that date
Completion does not already exist

If valid, the completion is stored.

The same button then changes to:

✓ Completed Today

Clicking it again removes today's completion using:

DELETE /api/habits/:id/complete/:date

This provides an easy correction mechanism if the user accidentally checks a habit.

15. Morning Reminder

The problem includes an additional requirement:

The application should remind the user each morning about habits that have not yet been logged for that day.

The application handles this in two ways.

In-app reminder

When today's data is loaded, the application checks:

completedToday === false

for each scheduled habit.

If incomplete habits exist, the application displays a morning reminder containing their names.

For example:

☀️ Good morning!

You still have 2 habits to log today:
Drink Water and Workout.

As habits are completed, the dashboard is refreshed and the reminder updates.

When every scheduled habit has been completed, the reminder disappears.

Browser notification

Where supported by the browser, the application can also request notification permission and show a browser notification during the morning period.

The browser notification is treated as an enhancement rather than the core reminder because browser permissions and notification support vary by environment.

The in-app reminder therefore remains the reliable primary mechanism.

16. Search

The problem mentions that the habit list can become long and that the user may want to find a particular habit.

The application therefore provides a search field.

The API supports:

GET /api/habits/search?q=...

The search is performed against habit names.

This avoids forcing the user to manually scan a long list.

A small debounce is also used in the frontend so that the application does not send a request for every individual keystroke immediately.

17. Updating Habits

Users can edit an existing habit.

The edit form allows changes to:

Name
Description
Schedule

The application retrieves the existing habit and pre-fills the form.

The update is sent to:

PUT /api/habits/:id

The backend validates the data before updating it.

This supports the requirement that the user may want to update a particular habit.

18. Archive Instead of Permanent Delete

The problem states that some habits have been given up on and should be taken out of the way, but:

"not gone forever"

Because of this, I chose archiving instead of permanent deletion.

An archived habit:

Disappears from the active habit list.
Does not appear in today's active habits.
Cannot be completed while archived.
Remains in the database.
Can be restored later.

This preserves the user's history and matches the requirement more closely than permanent deletion would.

The archive state is represented by:

archived = 0

or:

archived = 1
19. Validation

Validation is performed on the server because client-side validation alone cannot guarantee data integrity.

Examples include:

Habit name

The name must exist and cannot be empty.

Schedule

Only:

daily
weekdays

are accepted.

Date

Dates must follow:

YYYY-MM-DD

and must represent valid calendar dates.

Completion

A completion is rejected when:

The habit does not exist.
The habit is archived.
The date is not scheduled for the habit.
The completion already exists.

This prevents invalid states from being created through direct API calls.

20. Error Handling

The API returns meaningful HTTP status codes.

Examples:

201 Created

for successful habit creation.

400 Bad Request

for invalid input.

404 Not Found

when a requested habit does not exist.

409 Conflict

when a duplicate completion is attempted.

500 Internal Server Error

for unexpected server errors.

The frontend converts API errors into user-friendly toast messages.

21. Data Persistence

The application uses a local SQLite database:

data/habits.db

This means data survives:

Page refreshes
Browser reopening
Server restarts

The database directory is created automatically when the server starts.

The actual database file is ignored by Git so personal runtime data is not committed to the repository.

22. Testing Strategy

The most important logic to test is the streak engine because incorrect streak calculations would directly affect the main purpose of the application.

The test suite covers:

Daily consecutive streaks
Missed daily days
Consecutive weekday streaks
Weekends not breaking weekday streaks
Missed weekdays
Best-ever daily streaks
Best-ever weekday streaks
Empty completion history
Schedule validation

The tests are intentionally focused on business logic rather than UI appearance.

The test command is:

npm test
23. Important Edge Cases

The implementation considers several edge cases.

No habits

The dashboard displays an empty state rather than failing.

No completions

Both current and best streaks return:

0
Archived habit

An archived habit cannot be completed.

Weekend

A weekday habit does not treat Saturday or Sunday as a missed scheduled day.

Duplicate completion

The database prevents duplicate completion records.

Invalid schedule

Unsupported schedule values are rejected.

Invalid date

Invalid date strings are rejected by the API.

Long habit names

The frontend limits habit name length and escapes rendered content.

24. Security Considerations

Although this is a local assessment project rather than a production authentication system, some basic protections are included.

SQL Injection

Database operations use parameterized SQL queries instead of concatenating user input directly into SQL statements.

HTML Injection

Habit names and descriptions are escaped before being inserted into the DOM.

Input validation

The backend validates user-controlled values rather than trusting the frontend.

Database constraints

The database enforces relationships and unique completion records.

25. API Design

The main API endpoints are:

GET    /api/health

GET    /api/user

GET    /api/today

GET    /api/habits
GET    /api/habits/:id
GET    /api/habits/search?q=...

POST   /api/habits
PUT    /api/habits/:id

POST   /api/habits/:id/complete
DELETE /api/habits/:id/complete/:date

GET    /api/habits/:id/history

POST   /api/habits/:id/archive
POST   /api/habits/:id/restore

The API is intentionally small and focused on the actual requirements.

26. Project Structure
ananya-75-day-challenge/
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
├── tests/
│   └── streak.test.js
│
├── data/
│   └── .gitkeep
│
├── README.md
├── REASONING.md
├── AI_LOGS.md
├── package.json
├── package-lock.json
└── .gitignore
27. Design Trade-offs
Why SQLite instead of MySQL?

MySQL would be useful for a larger production application, but SQLite reduces setup requirements and makes the assessment project easier to run locally and in Codespaces.

Why vanilla JavaScript instead of React?

The application does not require a large component hierarchy. Vanilla JavaScript is sufficient and reduces dependencies and setup time.

Why archive instead of delete?

The requirement explicitly says habits should be removed from view but not gone forever. Archiving preserves history.

Why calculate streaks from completion history?

It avoids maintaining several separate streak counters that could become inconsistent with the underlying data.

The completion history remains the source of truth.

28. Complexity

Let n be the number of completion records for a habit.

Current streak

The current streak calculation walks backward through scheduled dates.

Its practical cost is proportional to the streak length.

Best streak

Completion dates are sorted and then processed.

The main cost is:

O(n log n)

because of sorting.

For a 75-day challenge and normal habit usage, this is small and keeps the implementation straightforward and reliable.

29. Why This Design Fits the User

The interface is designed around a morning workflow.

A typical session is:

Open application
      ↓
See today's habits
      ↓
See unfinished-habit reminder
      ↓
Complete habits one by one
      ↓
Watch streaks update
      ↓
Finish the day with all habits logged

Management features such as search, editing, archiving and restoring are kept below the main daily workflow so they do not distract from the user's primary task.

30. Final Design Philosophy

The central design decision was to treat completion history as the source of truth.

From that history, the application derives:

Today's completion status
Current streak
Best-ever streak
Challenge progress
Remaining habits
Morning reminder state

This avoids maintaining duplicated state wherever possible.

The result is a small application with a simple architecture but reliable core behavior.

The implementation intentionally prioritizes correctness and usability over unnecessary complexity.

The main objective is that when a user opens the application each morning, they can immediately understand:

What habits are scheduled today.
Which habits are already completed.
Which habits still need to be logged.
How long their current streak is.
What their best streak has been.
Where they can manage older habits.

That directly addresses the core problem while leaving a clean foundation for future features such as authentication, custom schedules, reminders through a backend notification service, analytics, and multi-user support.


After saving it, run:

```powershell
git add REASONING.md
git commit -m "Add solution reasoning documentation"
git push

This version is written specifically to explain the engineering decisions and requirement-to-feature mapping, which is what a reviewer should be able to understand quickly.
