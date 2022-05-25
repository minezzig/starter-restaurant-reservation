/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
import formatReservationDate from "./format-reservation-date";
import formatReservationTime from "./format-reservation-date";

const API_BASE_URL ="https://reserve-table-backend.herokuapp.com";

  //process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers();
headers.append("Content-Type", "application/json");

/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * This function is NOT exported because it is not needed outside of this file.
 *
 * @param url
 *  the url for the requst.
 * @param options
 *  any options for fetch
 * @param onCancel
 *  value to return if fetch call is aborted. Default value is undefined.
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range the promise is rejected.
 */
async function fetchJson(url, options, onCancel) {
  try {
    const response = await fetch(url, options);

    if (response.status === 204) {
      return null;
    }

    const payload = await response.json();

    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }
    return payload.data;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

/**
 * Retrieves all existing reservation.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservation saved in the database.
 */


//-------------APIs--------------

export async function listReservations(params, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );
  return await fetchJson(url, { headers, signal }, [])
    .then(formatReservationDate)
    .then(formatReservationTime);
}

// creates a reservation for API
export async function createReservation(newReservation, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`);
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({ data: newReservation }),
    signal,
  };
  return await fetchJson(url, options);
}
// creates a table for API
export async function createTable(newTable, signal) {
  const url = new URL(`${API_BASE_URL}/tables`);
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({ data: newTable }),
    signal,
  };
  return await fetchJson(url, options);
}

// read a reservation request for API
export async function readReservation(reservation_id, signal) {
  const url = new URL(`${API_BASE_URL}/reservations/${reservation_id}`);
  return await fetchJson(url, { headers, signal });
}

// list tables request for API
export async function listTables(params, signal) {
  const url = new URL(`${API_BASE_URL}/tables`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );
  return await fetchJson(url, { headers, signal });
}

// update Tables table request for API
export async function seatTable(reservation_id, table_id, signal) {
  const url = new URL(`${API_BASE_URL}/tables/${table_id}/seat`);
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: { reservation_id } }),
    signal,
  };
  return await fetchJson(url, options);
}

// clear a table after it's finished
export async function finishTable(table_id, signal) {
  const url = new URL(`${API_BASE_URL}/tables/${table_id}/seat`);
  const options = { method: "DELETE", signal };
  return await fetchJson(url, options);
}

// update reservation status request for API
export async function updateReservationStatus(reservation_id, status, signal) {
  const url = new URL(`${API_BASE_URL}/reservations/${reservation_id}/status`);
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: { status } }),
    signal,
  };
  return await fetchJson(url, options);
}

// get phone number reqeust for API
export async function searchMobileNumber(mobile_number, signal) {
  const url = new URL(`${API_BASE_URL}/reservations?mobile_number=${mobile_number}`);
  return await fetchJson(url, {headers, signal})
}
// update reservation information for API
export async function updateReservationInformation(reservation_id, updatedReservation, signal) {
  const url = new URL(`${API_BASE_URL}/reservations/${reservation_id}`);
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: updatedReservation }),
    signal,
  };
  return await fetchJson(url, options);
}