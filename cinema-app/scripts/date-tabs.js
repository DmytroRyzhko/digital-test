import { getReservationFromCookies, saveReservationToCookies } from './cookies.js';
import { formatDate, generateDates, generateSessions, isToday, onlyUnique } from './helpers.js';
import { MAX_SEATS_QUANTITY, bookButton, closeModal, openModal, seatsContainer, selectedDate, selectedSession } from './modal.js';

const dateTabsContainer = document.getElementById("date-tabs");
const selectedDateContainer = document.getElementById("selected-date");

let reservationData = {
  dates: [],
  sessions: {},
  reservations: {}, // This will store seat reservations
};

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
  console.log('createTabs DATES', reservationData.dates)
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
    return;
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
      const reservations = reservationData.reservations[date]?.[session] || [];

      if (reservations.length >= MAX_SEATS_QUANTITY) {
        sessionItem.className = 'booked'
      }

      sessionsList.appendChild(sessionItem);

      sessionItem.addEventListener('click', () => {
        console.log('selectDate click reservations', reservations)

        openModal(session, date, reservations); // Pass session, date, and reservations to openModal
      });
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

/**
 * Adds selected seats to the reservation data.
 * @param {string} date - The selected date in "YYYY-MM-DD" format.
 * @param {string} session - The selected session time in "HH:00" format.
 * @param {Array<string>} selectedSeats - An array of selected seat numbers.
 * @param {Object} reservationData - The reservation data object.
 */
function addSelectedSeatsToReservation(date, session, selectedSeats, reservationData) {
  if (!reservationData.reservations[date]) {
    reservationData.reservations[date] = {};
  }
  if (!reservationData.reservations[date][session]) {
    reservationData.reservations[date][session] = [];
  }

  const existingSeats = reservationData.reservations[date][session];
  reservationData.reservations[date][session] = [...existingSeats, ...selectedSeats].filter(onlyUnique);
}

// Add an event listener for the booking button
bookButton?.addEventListener("click", () => {
  // Get the list of selected seats
  const selectedSeats = Array.from(seatsContainer.querySelectorAll(".selected")).map(
    (seat) => seat.textContent
  );

  console.log('before', { selectedDate, selectedSeats, selectedSession, reservationData });

  addSelectedSeatsToReservation(selectedDate, selectedSession, selectedSeats, reservationData);

  // Save the updated reservation data to cookies
  saveReservationToCookies(reservationData);

  createTabs();
  console.log('after', { selectedDate, selectedSeats, selectedSession, reservationData });

  // Close the modal window after booking
  closeModal();
});

/**
 * TODO: move clicks here to the global body element
 * TODO: dispatch custom event when setting reservations
 *
 * @param {*} params
 */
function setEventListeners(params) {

}

createTabs();