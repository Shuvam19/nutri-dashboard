export function getDaysInMonth(year: number, month: number) {
  // month is 0-indexed (0 = Jan, 11 = Dec)
  const date = new Date(year, month, 1);
  const days = [];

  // Find the first day of the month (0 = Sun, 1 = Mon, etc.)
  // We want Monday to be the first day of the grid (index 0)
  // If first day is Sunday (0), we need 6 padding days. If Monday (1), 0 padding days.
  let firstDayIndex = date.getDay() - 1;
  if (firstDayIndex === -1) firstDayIndex = 6;

  // Add previous month padding days
  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    days.push({
      date: new Date(year, month - 1, prevMonthDays - i),
      isCurrentMonth: false,
    });
  }

  // Add current month days
  const numDaysInMonth = new Date(year, month + 1, 0).getDate();
  for (let i = 1; i <= numDaysInMonth; i++) {
    days.push({
      date: new Date(year, month, i),
      isCurrentMonth: true,
    });
  }

  // Add next month padding days to complete the 35 or 42 grid cells
  const remainingCells = days.length % 7 === 0 ? 0 : 7 - (days.length % 7);
  // Ensure we always have at least 5 rows (35 cells) or 6 rows (42 cells)
  const totalGridCells = days.length + remainingCells <= 35 ? 35 : 42;
  const nextMonthPadding = totalGridCells - days.length;

  for (let i = 1; i <= nextMonthPadding; i++) {
    days.push({
      date: new Date(year, month + 1, i),
      isCurrentMonth: false,
    });
  }

  return days;
}

export function isSameDay(date1: Date, date2: Date) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function formatTime(date: Date) {
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

export function isToday(date: Date) {
  const today = new Date();
  return isSameDay(date, today);
}
