import React from "react";

const style = {
  border: "1px solid black",
  boxShadow: "3px 3px black",
  margin: "10px",
  padding: "5px",
  width: "300px",
  height: "125px",
  //transform: "rotate(-1deg)",
};
function DisplayReservations({ reservations }) {
  return (
    <div>
      {reservations.map((reservation) => (
        <div key={reservation.reservation_id} style={style}>
          <b>{reservation.reservation_time.split("").slice(0, 5).join("")}</b>{" "}
          <span>- Party of {reservation.people}</span>
          <br />
          {reservation.first_name} {reservation.last_name}
          <br />
          {reservation.mobile_number}
          <br />
          <a href={`/reservations/${reservation.reservation_id}/seat`}>
            <button className="navigate" type="button">Seat</button>
          </a>
        </div>
      ))}
    </div>
  );
}

export default DisplayReservations;
