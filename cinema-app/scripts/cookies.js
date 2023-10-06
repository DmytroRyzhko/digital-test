/**
 * Saves the reservation data to cookies.
 * @param {Object} reservationData - The reservation data to be saved.
 */
export function saveReservationToCookies(reservationData) {
  const jsonReservationData = JSON.stringify(reservationData);
  document.cookie = `reservation=${jsonReservationData}; expires=${getCookieExpiration()}; path=/`;
}

/**
* Reads the reservation data from cookies.
* @returns {Object|null} The reservation data or null if not found.
*/
export function getReservationFromCookies() {
  const cookies = document.cookie.split(';');
  const cookieName = 'reservation=';
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.indexOf(cookieName) === 0) {
      const jsonReservationData = cookie.substring(cookieName.length);
      return JSON.parse(jsonReservationData);
    }
  }
  return null;
}

/**
* Deletes the reservation data from cookies.
*/
export function clearReservationCookies() {
  document.cookie = 'reservation=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

/**
* Generates a date for cookie expiration (one week from the current date).
* @returns {string} The formatted date string.
*/
export function getCookieExpiration() {
  const oneWeekLater = new Date();
  oneWeekLater.setDate(oneWeekLater.getDate() + 7); // Add 1 week
  return oneWeekLater.toUTCString();
}
