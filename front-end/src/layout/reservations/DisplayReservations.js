import React from "react";

function DisplayReservations({ reservations }) {
  return (
    <div>
      {reservations.map((reservation) => (
        <li key={reservation.reservation_id}>
          {reservation.reservation_time} - {reservation.first_name}{" "}
          {reservation.last_name}
        </li>
      ))}
      {/*JSON.stringify(reservations)*/}
    </div>
  );
}

export default DisplayReservations;
