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
  const currentHour = now.getHours();
  let startTime;

  const availableSessions = {};

  // Generate sessions for each date
  generateDates().forEach((date, index) => {
    // Check if it's the first date (today)
    if (index === 0) {
      // Ensure that the start time is within the range [10, 20]
      startTime = findNearestSessionHour(currentHour)
    } else {
      // For other dates, start from 10:00
      startTime = 10;
    }

    // Skip today's date if it's after 20:00
    if (!startTime) {
      return
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

/**
 * Removes the specified class from all sibling elements of the given element.
 * @param {HTMLElement} element - The element whose siblings should have the class removed.
 * @param {string} className - The class to be removed from sibling elements.
 */
export function removeSiblings(element, className = 'active') {
  if (!element) {
    return
  }

  // Get the parent element to access its children (siblings)
  const parent = element.parentElement;

  // Get all children of the parent element
  const siblings = Array.from(parent.children);

  // Remove the specified class from all sibling elements, except the given element
  siblings.forEach((sibling) => {
    if (sibling !== element) {
      sibling.classList.remove(className);
    }
  });
}

/**
 * Dispatches a custom event on the specified element with the given event name and optional data.
 * @param {HTMLElement} element - The element on which to dispatch the custom event.
 * @param {string} eventName - The name of the custom event.
 * @param {Object} eventData - Optional data to include with the event (default is an empty object).
 */
export function dispatchCustomEvent(element, eventName, eventData = {}) {
  // Create a new custom event with the specified name and data
  const customEvent = new CustomEvent(eventName, {
    detail: eventData,
    bubbles: true, // Event bubbles up the DOM tree
    cancelable: true, // Event is cancelable
  });

  // Dispatch the custom event on the specified element
  element.dispatchEvent(customEvent);
}


/**
 * Finds the nearest available session hour from the specified array of session hours.
 * @param {number} currentHour - The current hour.
 * @returns {number|null} The nearest available session hour, or null if the current hour is 20 or greater.
 */
function findNearestSessionHour(currentHour) {
  const sessionHours = [10, 12, 14, 16, 18, 20];

  // Sort the session hours in ascending order
  sessionHours.sort((a, b) => a - b);

  if (currentHour < 10) {
    return 10;
  } else if (currentHour >= 20) {
    return null;
  } else {
    let nearestSessionHour = sessionHours[0]; // The first hour in the range

    for (const hour of sessionHours) {
      if (hour > currentHour) {
        // Found an hour greater than the current hour, set it as the nearest and break the loop
        nearestSessionHour = hour;
        break;
      }
    }

    return nearestSessionHour;
  }
}