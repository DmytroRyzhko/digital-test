const modal = document.getElementById("myModal");
const seatsContainer = document.getElementById("seats-container");
const bookButton = document.getElementById("book-button");

let selectedDate = "";
let selectedSession = "";


/**
 * Shows the modal window for seat selection and booking.
 * @param {string} session - The selected session time in "HH:00" format.
 * @param {string} date - The selected date in "YYYY-MM-DD" format.
 * @param {object} reservations - The reservations for the selected date and session.
 */
export function openModal(session, date, reservations) {
  console.log('openModal reservations', reservations)

  if (!modal || !seatsContainer) {
    return;
  }

  modal.style.display = "block";

  // Clear the seats container content
  seatsContainer.innerHTML = "";

  // Create seats
  for (let i = 1; i <= 25; i++) {
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
  modal.style.display = "none";
}

// Add an event listener for closing the modal window
modal.querySelector(".close").addEventListener("click", () => {
  closeModal();
});

/**
* Toggles the state of a selected/cancelled seat.
* @param {HTMLElement} seat - The seat element.
*/
export function toggleSeat(seat) {
  seat.classList.toggle("selected");
}

export { bookButton, modal, seatsContainer, selectedDate, selectedSession };

