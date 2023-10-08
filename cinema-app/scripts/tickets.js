// An array to store ticket data
const tickets = [];

/**
 * Adds a new ticket to the array.
 * @param {string} date - The date of the ticket in "YYYY-MM-DD" format.
 * @param {string} session - The session time in "HH:00" format.
 * @param {string[]} seats - An array of seat numbers.
 */
export function addTicket(date, session, seats) {
  // Add a new ticket to the tickets array
  tickets.push({
    date,
    session,
    seats,
  });
}

/**
 * Removes expired tickets from the array.
 * @param {string[]} availableDates - An array of available dates.
 */
export function removeExpiredTickets(availableDates) {
  // Filter tickets to keep only those that match available dates
  tickets = tickets.filter((ticket) => availableDates.includes(ticket.date));
}
export { tickets };

