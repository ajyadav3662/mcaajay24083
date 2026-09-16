let archivedView = false;

const $ = id =>
    document.getElementById(id);


/* ---------------------------------
   API HELPER
---------------------------------- */

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


/* ---------------------------------
   TOAST
---------------------------------- */

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


/* ---------------------------------
   ESCAPE HTML
---------------------------------- */

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* ---------------------------------
   LOAD TODAY
---------------------------------- */

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

        renderTodayHabits(
            data.habits
        );

    } catch (error) {

        showToast(
            error.message
        );
    }
}


/* ---------------------------------
   RENDER TODAY
---------------------------------- */

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


/* ---------------------------------
   COMPLETE / UNCOMPLETE
---------------------------------- */

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


/* ---------------------------------
   LOAD HABITS
---------------------------------- */

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


/* ---------------------------------
   SWITCH TAB
---------------------------------- */

function switchTab(
    archived
) {

    $("searchInput")
        .value = "";

    loadHabits(
        archived
    );
}


/* ---------------------------------
   RENDER HABIT LIST
---------------------------------- */

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


/* ---------------------------------
   MODAL
---------------------------------- */

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


/* ---------------------------------
   EDIT HABIT
---------------------------------- */

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


/* ---------------------------------
   SAVE HABIT
---------------------------------- */

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


/* ---------------------------------
   ARCHIVE
---------------------------------- */

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


/* ---------------------------------
   RESTORE
---------------------------------- */

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


/* ---------------------------------
   SEARCH
---------------------------------- */

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


/* ---------------------------------
   CLOSE MODAL ON BACKDROP
---------------------------------- */

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


/* ---------------------------------
   INITIALIZE
---------------------------------- */

loadToday();
loadHabits(false);
