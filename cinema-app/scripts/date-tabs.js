import { getReservationFromCookies, saveReservationToCookies } from './cookies.js';
import { formatDate, generateDates, generateSessions, isToday } from './helpers.js';
import { openModal } from './modal.js';

const dateTabsContainer = document.getElementById("date-tabs");
const selectedDateContainer = document.getElementById("selected-date");

let reservationData = {
  dates: [],
  sessions: {},
  reservations: {}, // This will store seat reservations
};

// const availableDates = generateDates()
// const availableSessions = generateSessions()

// console.log('availableDates', availableDates)
// console.log('availableSessions', availableSessions)


// Check if there are reservation data in cookies
const existingReservationData = getReservationFromCookies();
console.log('existingReservationData', existingReservationData)

if (existingReservationData) {
  // If reservation data is found in cookies, use it
  // You can populate the UI with the saved reservation data here
  reservationData = JSON.parse(JSON.stringify(existingReservationData))

} else {
  // If no reservation data is found, generate new data
  // Use the existing methods to generate dates and sessions
  const availableDates = generateDates();
  const availableSessions = generateSessions();

  reservationData = {
    dates: availableDates,
    sessions: availableSessions,
    reservations: {}, // This will store seat reservations
  };

  // Save the initial reservation data to cookies
  saveReservationToCookies(reservationData);
}

/**
* Generates and displays date tabs for ticket booking.
*/
function createTabs() {
  reservationData.dates?.forEach((date) => {
    const tab = document.createElement("button");
    tab.textContent = formatDate(date);
    tab.addEventListener("click", () => {
      selectDate(date);
    });
    dateTabsContainer.appendChild(tab);
  });
}

/**
* Displays the selected date and its sessions.
* @param {string} date - The selected date in "YYYY-MM-DD" format.
*/
function selectDate(date) {
  if (!selectedDateContainer) {
    return
  }

  selectedDateContainer.innerHTML = "";

  const sessionsForDate = getSessionsForDate(date);

  const selectedDateElement = document.createElement("h2");
  selectedDateElement.textContent = `Selected Date: ${formatDate(date)}`;
  selectedDateContainer.appendChild(selectedDateElement);


  if (sessionsForDate.length === 0) {
    // If there are no available sessions for the selected date
    if (isToday(date)) {
      // Check if it's today's date
      selectedDateContainer.innerHTML = "No available sessions for today.";
    } else {
      selectedDateContainer.innerHTML = "No available sessions for selected date.";
    }
  } else {
    // If there are available sessions, display them
    selectedDateContainer.innerHTML = "";

    const sessionsList = document.createElement("ul");
    sessionsForDate.forEach((session) => {
      const sessionItem = document.createElement("li");
      sessionItem.textContent = session;
      sessionItem.addEventListener('click', openModal)
      sessionsList.appendChild(sessionItem);
    });
    selectedDateContainer.appendChild(sessionsList);
  }
}

/**
 * Retrieves sessions for the selected date and displays them.
 * @param {string} date - The selected date in "YYYY-MM-DD" format.
 */
function getSessionsForDate(date) {
  return reservationData.sessions[date] || [];
}

createTabs();