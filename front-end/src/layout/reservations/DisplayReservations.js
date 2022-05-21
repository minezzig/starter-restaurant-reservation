import React from "react";

const style = {
  border: "1px solid black",
  boxShadow: "3px 3px black",
  margin: "10px",
  padding: "5px",
  width: "300px",
  height: "150px",
};

function DisplayReservations({ reservations, search }) {

  return (
    <div>
      {reservations.map((reservation) => {
        if (reservation.status !== "finished" || search) {
          return (
            <div key={reservation.reservation_id} style={style}>
              <b>
                {reservation.reservation_time.split("").slice(0, 5).join("")}
              </b>{" "}
              <span>- Party of {reservation.people}</span>
              <br />
              {reservation.first_name} {reservation.last_name}
              <br />
              {reservation.mobile_number}
              <br />
              <span data-reservation-id-status={reservation.reservation_id}>
                {reservation.status}
              </span>
              <br />
              {reservation.status === "booked" ? (
                <a href={`/reservations/${reservation.reservation_id}/seat`}>
                  <button className="navigate" type="button">
                    Seat
                  </button>
                </a>
              ) : null}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

export default DisplayReservations;
