function parseDate(dateString) {
    const [year, month, day] = dateString.split("-").map(Number);

    return new Date(
        Date.UTC(year, month - 1, day)
    );
}

function formatDate(date) {
    return date.toISOString().slice(0, 10);
}

function addDays(dateString, amount) {
    const date = parseDate(dateString);

    date.setUTCDate(
        date.getUTCDate() + amount
    );

    return formatDate(date);
}

function getDayOfWeek(dateString) {
    return parseDate(dateString).getUTCDay();
}

function isScheduledDate(dateString, schedule) {
    if (schedule === "daily") {
        return true;
    }

    if (schedule === "weekdays") {
        const day = getDayOfWeek(dateString);

        return day >= 1 && day <= 5;
    }

    return false;
}

function normalizeCompletions(completions) {
    return new Set(
        completions.map(item => {
            if (typeof item === "string") {
                return item;
            }

            return item.completed_date;
        })
    );
}

function getPreviousScheduledDate(dateString, schedule) {
    let date = addDays(dateString, -1);

    while (!isScheduledDate(date, schedule)) {
        date = addDays(date, -1);
    }

    return date;
}

function calculateCurrentStreak(
    completions,
    schedule,
    today
) {
    const completedDates =
        normalizeCompletions(completions);

    let currentDate = today;

    /*
     * If today is not a scheduled day,
     * start from the most recent scheduled day.
     */
    if (!isScheduledDate(currentDate, schedule)) {
        currentDate =
            getPreviousScheduledDate(
                currentDate,
                schedule
            );
    }

    /*
     * The latest scheduled day must be completed
     * for a current streak to exist.
     */
    if (!completedDates.has(currentDate)) {
        return 0;
    }

    let streak = 0;

    while (completedDates.has(currentDate)) {
        streak++;

        currentDate =
            getPreviousScheduledDate(
                currentDate,
                schedule
            );
    }

    return streak;
}

function calculateBestStreak(
    completions,
    schedule
) {
    const completedDates =
        normalizeCompletions(completions);

    if (completedDates.size === 0) {
        return 0;
    }

    const sortedDates =
        [...completedDates].sort();

    let best = 0;
    let streak = 0;

    for (const date of sortedDates) {
        const previous =
            getPreviousScheduledDate(
                date,
                schedule
            );

        if (completedDates.has(previous)) {
            streak++;
        } else {
            streak = 1;
        }

        best = Math.max(best, streak);
    }

    return best;
}

module.exports = {
    parseDate,
    formatDate,
    addDays,
    isScheduledDate,
    getPreviousScheduledDate,
    calculateCurrentStreak,
    calculateBestStreak
};