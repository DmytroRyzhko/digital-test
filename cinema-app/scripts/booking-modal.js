import { dispatchCustomEvent } from './helpers.js';


const MAX_SEATS_QUANTITY = 25
const VISIBLE_CLASS = 'visible'

const modal = document.getElementById("bookingModal");
const seatsContainer = document.getElementById("seats-container");
const bookButton = document.getElementById("book-button");
const overlay = document.getElementById("overlay");
const successMessage = document.querySelector(".success-message");

let selectedDate = "";
let selectedSession = "";

/**
 * Shows the modal window for seat selection and booking.
 * @param {string} session - The selected session time in "HH:00" format.
 * @param {string} date - The selected date in "YYYY-MM-DD" format.
 * @param {object} reservations - The reservations for the selected date and session.
 */
export function openModal(session, date, reservations) {
  if (!modal || !seatsContainer) {
    return;
  }

  bookButton.disabled = !getSelectedSeats().length ? true : false

  modal.classList.add(VISIBLE_CLASS)

  // Clear the seats container content
  seatsContainer.innerHTML = "";

  // Create seats
  for (let i = 1; i <= MAX_SEATS_QUANTITY; i++) {
    const seat = document.createElement("div");
    seat.className = "seat";
    seat.textContent = i;

    // Check if the seat is reserved
    if (reservations?.includes(String(i))) {
      seat.classList.add("reserved");
    } else {
      seat.addEventListener("click", () => {
        // Event handler for seat selection
        toggleSeat(seat);
        bookButton.disabled = !getSelectedSeats().length ? true : false
      });
    }

    seatsContainer.appendChild(seat);
  }

  selectedDate = date;
  selectedSession = session;
}

/**
* Closes the modal window.
*/
export function closeModal() {
  if (!modal) {
    return;
  }

  dispatchCustomEvent(modal, 'on-modal-close',)
  modal.classList.remove(VISIBLE_CLASS);
}

/**
 * Close the modal when clicking outside of it.
 * @param {Event} event - The click event.
 */
export function closeModalOnOutsideClick(event) {
  if (!modal || modal.style.display === 'none') {
    return;
  }

  if (!(event.target.closest('.modal-content'))) {
    // Clicked outside of modal content, close the modal
    closeModal();
  }
}

/**
 * Function to display the success message.
 */
export function showSuccessMessage() {

  if (!successMessage) {
    return
  }

  successMessage.classList.add(VISIBLE_CLASS)
  overlay.classList.add(VISIBLE_CLASS)

  overlay.addEventListener("click", () => {
    successMessage.classList.remove(VISIBLE_CLASS);
    overlay.classList.remove(VISIBLE_CLASS)
  });

  /**
   * Automatically hide the success message after a specified time.
   */
  setTimeout(() => {
    successMessage.classList.remove(VISIBLE_CLASS);
  }, 3000); // (3 seconds)
}


/**
* Toggles the state of a selected/cancelled seat.
* @param {HTMLElement} seat - The seat element.
*/
export function toggleSeat(seat) {
  seat?.classList.toggle("selected");
}

/**
 * Gets the list of selected seats.
 * @returns {Array} An array containing the selected seats.
 */
export function getSelectedSeats() {
  return Array.from(seatsContainer?.querySelectorAll(".selected")).map(
    (seat) => seat.textContent
  );
}


export { MAX_SEATS_QUANTITY, bookButton, modal, seatsContainer, selectedDate, selectedSession };

