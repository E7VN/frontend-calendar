export function generateRecurrenceDates(recurrence, count = 10) {
  if (!recurrence.startDate) return [];

  const {
    frequency,
    interval,
    startDate,
    endDate,
    daysOfWeek,
    usePattern,
    monthlyOcc,
    monthlyDay,
  } = recurrence;

  const output = [];
  let current = new Date(startDate);

  const isBeforeEnd = (date) => (!endDate || date <= new Date(endDate));

  // Daily Recurrence
  if (frequency === "daily") {
    while (output.length < count && isBeforeEnd(current)) {
      output.push(new Date(current));
      current.setDate(current.getDate() + interval);
    }
  }

  // Weekly Recurrence
  else if (frequency === "weekly" && Array.isArray(daysOfWeek)) {
    const dayIndexes = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
      .map((d, idx) => [d, idx])
      .filter(([d]) => daysOfWeek.includes(d))
      .map(([_, i]) => i);

    let weekStart = new Date(startDate);

    while (output.length < count && isBeforeEnd(weekStart)) {
      dayIndexes.forEach((day) => {
        const dayInWeek = new Date(weekStart);
        const offset = (7 + day - weekStart.getDay()) % 7;
        dayInWeek.setDate(weekStart.getDate() + offset);
        if (
          dayInWeek >= new Date(startDate) &&
          isBeforeEnd(dayInWeek) &&
          output.length < count
        ) {
          output.push(new Date(dayInWeek));
        }
      });
      weekStart.setDate(weekStart.getDate() + interval * 7);
    }
  }

  // Monthly Recurrence with Pattern (optional)
  else if (frequency === "weekly") {
    let current = new Date(startDate);
    let generated = 0;

    // Decide which weekdays to use
    let weekdays;
    if (recurrence.useMultipleWeekdays && (daysOfWeek?.length > 0)) {
      weekdays = daysOfWeek.map(day =>
        ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(day)
      );
    } else {
      // Default: single weekday (start date)
      weekdays = [new Date(startDate).getDay()];
    }

    while (generated < count && (!endDate || current <= new Date(endDate))) {
      weekdays.forEach(idx => {
        let nextDate = new Date(current);
        nextDate.setDate(current.getDate() - current.getDay() + idx);
        if (nextDate >= new Date(startDate) &&
            (!endDate || nextDate <= new Date(endDate)) &&
            generated < count
        ) {
          output.push(new Date(nextDate));
          generated++;
        }
      });
      current.setDate(current.getDate() + interval * 7);
    }
  }

  // Standard monthly (same day number each month)
  else if (frequency === "monthly") {
    const targetDay = new Date(startDate).getDate();

    while (output.length < count && isBeforeEnd(current)) {
      const date = new Date(current);
      const month = date.getMonth();
      const year = date.getFullYear();

      let nextMonthDate = new Date(year, month, targetDay);

      // Fallback for shorter months (e.g. 31st → Feb)
      if (nextMonthDate.getMonth() !== month) {
        nextMonthDate = new Date(year, month + 1, 0); // last day of month
      }

      if (nextMonthDate >= new Date(startDate) && isBeforeEnd(nextMonthDate)) {
        output.push(nextMonthDate);
      }

      current.setMonth(current.getMonth() + interval);
    }
  }

  // Yearly Recurrence
  else if (frequency === "yearly") {
    while (output.length < count && isBeforeEnd(current)) {
      output.push(new Date(current));
      current.setFullYear(current.getFullYear() + interval);
    }
  }

  return output;
}
function getNthWeekdayOfMonth(year, month, weekday, n) {
  let firstDay = new Date(year, month, 1);
  let firstDayOfWeek = firstDay.getDay();
  let offset = (7 + weekday - firstDayOfWeek) % 7;

  if (n > 0) {
    let day = 1 + offset + 7 * (n - 1);
    return new Date(year, month, day);
  } else {
    // Last occurrence
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const lastDate = lastDayOfMonth.getDate();
    for (let i = lastDate; i >= 1; i--) {
      const d = new Date(year, month, i);
      if (d.getDay() === weekday) return d;
    }
  }
}