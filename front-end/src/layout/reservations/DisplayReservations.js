import React from "react";

const style = {border: "1px solid black", boxShadow: "3px 3px black", margin: "10px", padding: "5px", width: "300px", height: "60px"}
function DisplayReservations({ reservations }) {
  return (
    <div>
      {reservations.map((reservation) => (
        <div style={style}>
        <li key={reservation.reservation_id}>
          {reservation.reservation_time} - {reservation.first_name}{" "}
          {reservation.last_name} {reservation.mobile_number}
        </li>
        </div>

      ))}
    </div>
  );
}

export default DisplayReservations;
