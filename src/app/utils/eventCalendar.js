const parseTimeParts = (value) => {
  if (!value) return null;
  const match = value.trim().match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i);
  if (!match) return null;
  let hour = parseInt(match[1], 10);
  const minute = parseInt(match[2] || '0', 10);
  const period = match[3].toUpperCase();
  if (period === 'PM' && hour !== 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;
  return { hour, minute };
};

const formatDateForCalendar = (date) => {
  const yyyy = String(date.getFullYear()).padStart(4, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${yyyy}${mm}${dd}T${hh}${min}00`;
};

const buildLocalDate = (dateString, timeString) => {
  if (!dateString || !timeString) return null;
  const parts = parseTimeParts(timeString);
  if (!parts) return null;
  const [year, month, day] = dateString.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day, parts.hour, parts.minute, 0);
};

const buildCalendarDateString = (dateString, timeString) => {
  const date = buildLocalDate(dateString, timeString);
  if (!date) return null;
  return formatDateForCalendar(date);
};

const buildCalendarUrl = (event) => {
  if (!event?.date || !event?.startTime || !event?.endTime) return null;
  const startDate = buildLocalDate(event.date, event.startTime);
  const endDate = buildLocalDate(event.date, event.endTime);
  if (!startDate || !endDate) return null;
  if (endDate <= startDate) {
    endDate.setDate(endDate.getDate() + 1);
  }
  const start = formatDateForCalendar(startDate);
  const end = formatDateForCalendar(endDate);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.eventName || 'IEEE GUB Event',
    dates: `${start}/${end}`,
  });
  if (event.description) params.set('details', event.description);
  const location = event.locationLabel || event.eventArea;
  if (location) params.set('location', location);
  if (event.timezone) params.set('ctz', event.timezone);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

export { parseTimeParts, buildCalendarDateString, buildLocalDate, buildCalendarUrl };
