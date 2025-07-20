export function generateRecurrenceDates(recurrence, count = 10) {
  if (!recurrence.startDate) return [];

  const {
    frequency,
    interval = 1,
    startDate,
    endDate,
    daysOfWeek,
    usePattern,
    monthlyOcc,
    monthlyDay,
    useMultipleWeekdays,
  } = recurrence;

  const output = [];
  const isBeforeEnd = (date) => !endDate || date <= new Date(endDate);
  let current = new Date(startDate);

  // DAILY
  if (frequency === "daily") {
    while (output.length < count && isBeforeEnd(current)) {
      output.push(new Date(current));
      current.setDate(current.getDate() + interval);
    }
  }

  // WEEKLY
  else if (frequency === "weekly") {
    let generated = 0;

    let weekdays = [];

    if (useMultipleWeekdays && Array.isArray(daysOfWeek) && daysOfWeek.length > 0) {
      weekdays = daysOfWeek.map(d =>
        ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(d)
      );
    } else {
      // default to weekday of startDate
      weekdays = [new Date(startDate).getDay()];
    }

    while (generated < count) {
      weekdays.forEach((dayIndex) => {
        const date = new Date(current);
        const offset = (7 + dayIndex - date.getDay()) % 7;
        date.setDate(date.getDate() + offset);

        if (date >= new Date(startDate) && isBeforeEnd(date)) {
          output.push(new Date(date));
          generated++;
        }
      });

      current.setDate(current.getDate() + interval * 7);
    }
  }

  // MONTHLY with pattern (like 2nd Thursday)
  else if (frequency === "monthly" && usePattern && monthlyOcc && monthlyDay) {
    const weekdayIndex = {
      Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3,
      Thursday: 4, Friday: 5, Saturday: 6,
    }[monthlyDay];

    const nthMap = {
      First: 1,
      Second: 2,
      Third: 3,
      Fourth: 4,
      Last: -1,
    };

    const nth = nthMap[monthlyOcc];
    let monthCursor = new Date(startDate);

    while (output.length < count) {
      const y = monthCursor.getFullYear();
      const m = monthCursor.getMonth();

      const nthDate = getNthWeekdayOfMonth(y, m, weekdayIndex, nth);

      if (nthDate >= new Date(startDate) && isBeforeEnd(nthDate)) {
        output.push(new Date(nthDate));
      }

      monthCursor.setMonth(monthCursor.getMonth() + interval);
      monthCursor.setDate(1); // prevent date roll-over issues
    }
  }

  // MONTHLY (default, same date every month like 31st)
  else if (frequency === "monthly") {
    const targetDay = new Date(startDate).getDate();

    while (output.length < count && isBeforeEnd(current)) {
      const y = current.getFullYear();
      const m = current.getMonth();
      let date = new Date(y, m, targetDay);

      if (date.getMonth() !== m) {
        // handle shorter months
        date = new Date(y, m + 1, 0);
      }

      if (date >= new Date(startDate) && isBeforeEnd(date)) {
        output.push(date);
      }

      current.setMonth(current.getMonth() + interval);
    }
  }

  // YEARLY
  else if (frequency === "yearly") {
    while (output.length < count && isBeforeEnd(current)) {
      output.push(new Date(current));
      current.setFullYear(current.getFullYear() + interval);
    }
  }

  return output;
}

function getNthWeekdayOfMonth(year, month, weekday, n) {
  if (n > 0) {
    const firstDay = new Date(year, month, 1);
    const firstWeekday = firstDay.getDay();
    const offset = (7 + weekday - firstWeekday) % 7;
    const day = 1 + offset + 7 * (n - 1);
    return new Date(year, month, day);
  } else {
    // Last occurrence
    const lastDay = new Date(year, month + 1, 0);
    for (let i = lastDay.getDate(); i >= 1; i--) {
      const d = new Date(year, month, i);
      if (d.getDay() === weekday) return d;
    }
  }
}
