const modal = document.getElementById("myModal");
const seatsContainer = document.getElementById("seats-container");
const bookButton = document.getElementById("book-button");

/**
 * Shows the modal window for seat selection and booking.
 * @param {string} session - The selected session time in "HH:00" format.
 */
export function openModal(session) {
  if (!modal) {
    return
  }

  modal.style.display = "block";

  if (!seatsContainer) {
    return
  }

  // Clear the seats container content
  seatsContainer.innerHTML = "";

  // Create seats
  for (let i = 1; i <= 25; i++) {
    const seat = document.createElement("div");
    seat.className = "seat";
    seat.textContent = i;
    seat.addEventListener("click", () => {
      // Event handler for seat selection
      toggleSeat(seat);
    });
    seatsContainer.appendChild(seat);
  }
}

/**
* Closes the modal window.
*/
export function closeModal() {
  modal.style.display = "none";
}

// Add an event listener for the booking button
bookButton.addEventListener("click", () => {
  // Get the list of selected seats
  const selectedSeats = Array.from(seatsContainer.querySelectorAll(".selected")).map(
    (seat) => seat.textContent
  );
  // Here you can implement the logic for booking the selected seats
  // For example, display them in the console
  console.log("Selected seats:", selectedSeats);
  // Close the modal window after booking
  closeModal();
});

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
