import React from "react";
//import { useState } from "react";
//import { updateReservationStatus } from "../../utils/api";
//import loadDashboard from "../../dashboard/Dashboard";
//import ErrorAlert from "../ErrorAlert";

const style = {
  border: "1px solid black",
  boxShadow: "3px 3px black",
  margin: "10px",
  padding: "5px",
  width: "300px",
  height: "150px",
};

function DisplayReservations({ reservations, search = false, handleCancel }) {
  // !search = fasle by default?

  return (
    <div>
      {reservations.map((reservation) => {
        if (
          reservation.status === "booked" ||
          reservation.status === "seated" ||
          search
        ) {
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
                <div>
                  <a href={`/reservations/${reservation.reservation_id}/seat`}>
                    <button type="button">Seat</button>
                  </a>
                  <a href={`/reservations/${reservation.reservation_id}/edit`}>
                    <button type="button">Edit</button>
                  </a>
                  <button
                    data-reservation-id-cancel={reservation.reservation_id}
                    onClick={() => handleCancel(reservation.reservation_id)}
                  >
                    Cancel
                  </button>
                </div>
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
