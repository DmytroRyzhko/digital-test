/**
 * Component: DateTabs
 * ------------------------------------------------------------------------------
 * Main file for the Cinema Seat Reservation Application.
 * This component manages the rendering of date tabs, seat reservations,
 * and related functionalities.
 *
 * @namespace DateTabs
*/

import {
  getReservationFromCookies,
  saveReservationToCookies,
} from "./cookies.js";

import {
  addTicket,
  removeExpiredTickets,
  tickets,
} from "./tickets.js";

import {
  formatDate,
  generateDates,
  generateSessions,
  isToday,
  onlyUnique,
  removeSiblings,
} from "./helpers.js";

import {
  MAX_SEATS_QUANTITY,
  bookButton,
  closeModal,
  closeModalOnOutsideClick,
  openModal,
  seatsContainer,
  selectedDate,
  selectedSession,
  showSuccessMessage
} from "./booking-modal.js";

export default (config) => {

  const ACTIVE_TAB_CLASS = "active";

  const dateTabsContainer = document.getElementById("date-tabs");
  const selectedDateContainer = document.getElementById("selected-date");

  let reservationData = {
    dates: [],
    sessions: {},
    reservations: {}, // This will store seat reservations
  };

  let activeTab = null;

  // Check if there are reservation data in cookies
  const existingReservationData = getReservationFromCookies();

  if (existingReservationData) {
    // If reservation data is found in cookies, use it
    // You can populate the UI with the saved reservation data here
    reservationData = JSON.parse(JSON.stringify(existingReservationData));
  } else {
    // If no reservation data is found, generate new data
    // Use the existing methods to generate dates and sessions
    const availableDates = generateDates();
    const availableSessions = generateSessions();

    reservationData.dates = availableDates;
    reservationData.sessions = availableSessions;

    removeExpiredTickets(availableDates)

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
        removeSiblings(tab, ACTIVE_TAB_CLASS);
        tab.classList.add(ACTIVE_TAB_CLASS);
        tab.dataset.activeDate = date;
        activeTab = tab;
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
    if (!selectedDateContainer || !date) {
      return;
    }

    selectedDateContainer.innerHTML = "";

    const sessionsForDate = getSessionsForDate(date);
    const selectedDateElement = document.createElement("h2");
    selectedDateElement.textContent = `Обрана дата: ${formatDate(date)}`;

    if (sessionsForDate.length === 0) {
      // If there are no available sessions for the selected date
      if (isToday(date)) {
        // Check if it's today's date
        selectedDateContainer.innerHTML = "No available sessions for today.";
      } else {
        selectedDateContainer.innerHTML =
          "No available sessions for selected date.";
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
          sessionItem.className = "booked";
        }

        sessionsList.appendChild(sessionItem);

        sessionItem.addEventListener("click", (e) => {
          e.stopPropagation()

          openModal(session, date, reservations); // Pass session, date, and reservations to openModal
        });
      });
      selectedDateContainer.appendChild(sessionsList);
    }

    selectedDateContainer.appendChild(selectedDateElement);
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
  //  * @param {Object} reservationData - The reservation data object.
   */
  function addSelectedSeatsToReservation(date, session, selectedSeats) {
    if (!reservationData.reservations[date]) {
      reservationData.reservations[date] = {};
    }
    if (!reservationData.reservations[date][session]) {
      reservationData.reservations[date][session] = [];
    }

    const existingSeats = reservationData.reservations[date][session];
    reservationData.reservations[date][session] = [
      ...existingSeats,
      ...selectedSeats,
    ].filter(onlyUnique);
  }

  // Add an event listener for the booking button
  bookButton?.addEventListener("click", () => {
    // Get the list of selected seats
    const selectedSeats = Array.from(
      seatsContainer.querySelectorAll(".selected")
    ).map((seat) => seat.textContent);

    addSelectedSeatsToReservation(selectedDate, selectedSession, selectedSeats);
    addTicket(selectedDate, selectedSession, selectedSeats);

    // Save the updated reservation data to cookies
    saveReservationToCookies(reservationData);

    // Close the modal window after booking
    closeModal();

    showSuccessMessage();

    console.log('tickets', tickets)
  });

  /**
   * Sets the global event listeners.
   */
  function setEventListeners() {
    window.addEventListener("on-modal-close", (e) => {
      if (!activeTab) {
        return;
      }

      selectDate(activeTab.dataset.activeDate);
    });

    window.addEventListener("click", (event) => closeModalOnOutsideClick(event));
  }

  /**
   * Initialise component.
   */
  function init() {
    createTabs();
    setEventListeners();
  }

  /**
   * Expose public interface.
   */
  return Object.freeze({
    init,
  })
}