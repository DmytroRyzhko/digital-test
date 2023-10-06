/**
 * Generates an array of available dates for ticket booking.
 * Dates will be generated starting from the current date
 * and ending one week later.
 * @returns {Array<string>} An array of available dates in ISO date string format.
 */
export function generateDates() {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset hours, minutes, seconds, and milliseconds to 00:00:00
  const oneWeekLater = new Date(today);
  oneWeekLater.setDate(today.getDate() + 7); // Add 7 days to the current date
  const dates = [];

  while (today < oneWeekLater) {
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    const isoDate = `${year}-${month < 10 ? "0" : ""}${month}-${day < 10 ? "0" : ""}${day}`;
    dates.push(isoDate);

    today.setDate(today.getDate() + 1); // Move to the next date
  }

  return dates;
}

/**
 * Generates an object of available sessions for ticket booking.
 * Sessions will be generated for each date with a specified start time, end time,
 * and time interval.
 * @returns {Object} An object with dates as keys and arrays of available session times in "HH:00" format as values.
 */
export function generateSessions() {
  const now = new Date();
  const interval = 2; // Interval between sessions in hours
  const minutesInHour = 60;
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  console.log({ currentHour, currentMinute });
  let startTime;

  const availableSessions = {};

  // Generate sessions for each date
  generateDates().forEach((date, index) => {
    // Check if it's the first date (today)
    if (index === 0) {
      // Calculate the nearest session start time for today
      if (currentMinute >= 30) {
        // If the current minute is 30 or more, round up to the next even hour
        startTime = currentHour + 2;
      } else {
        // Otherwise, round up to the next odd hour
        startTime = currentHour + 1;
      }

      // Ensure that the start time is within the range [10, 20]
      if (startTime < 10) {
        startTime = 10;
      } else if (startTime > 20) {
        // Skip today's date if it's after 20:00
        return;
      }
    } else {
      // For other dates, start from 10:00
      startTime = 10;
    }

    const endTime = 20; // End time for sessions
    const sessions = [];

    while (startTime <= endTime) {
      const sessionTime = `${startTime < 10 ? "0" : ""}${startTime}:00`;
      sessions.push(sessionTime);
      startTime += interval;
    }

    availableSessions[date] = sessions;
  });

  return availableSessions;
}
/**
 * Formats a date string in a human-readable format.
 * @param {string} dateString - The date string in "YYYY-MM-DD" format.
 * @returns {string} A formatted date string.
 */
export function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
}

/**
 * Checks if a given date is today.
 * @param {string} date - The date to check in "YYYY-MM-DD" format.
 * @returns {boolean} True if the date is today, false otherwise.
 */
export function isToday(date) {
  const today = new Date();
  const selectedDate = new Date(date);
  return (
    today.getFullYear() === selectedDate.getFullYear() &&
    today.getMonth() === selectedDate.getMonth() &&
    today.getDate() === selectedDate.getDate()
  );
}

/**
 * Filters an array to keep only the unique elements.
 *
 * @param {*} value - The current value being processed in the array.
 * @param {number} index - The index of the current value within the array.
 * @param {Array} array - The array that the `value` belongs to.
 * @returns {boolean} `true` if the `value` is unique in the array, `false` otherwise.
 */
export function onlyUnique(value, index, array) {
  return array.indexOf(value) === index;
}