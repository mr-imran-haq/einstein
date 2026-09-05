export function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getDaysInMonth(year, month) {
  // month is 0-indexed (0 = January)
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysArray = [];

  // Leading empty slots so the 1st lands on the correct weekday
  const startWeekday = firstDay.getDay();
  for (let i = 0; i < startWeekday; i++) {
    daysArray.push(null);
  }

  for (let day = 1; day <= lastDay.getDate(); day++) {
    daysArray.push(day);
  }

  return daysArray;
}