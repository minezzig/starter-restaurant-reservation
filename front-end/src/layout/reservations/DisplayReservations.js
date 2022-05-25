import React from "react";
//import { useState } from "react";
//import { updateReservationStatus } from "../../utils/api";
//import loadDashboard from "../../dashboard/Dashboard";
//import ErrorAlert from "../ErrorAlert";
import {formatAsDate, formatAsTime} from "../../utils/date-time"

const style = {
  border: "1px solid black",
  backgroundColor: "white",
  boxShadow: "3px 3px black",
  margin: "10px",
  padding: "10px",
  width: "250px",
  //height: "165px",
};

function DisplayReservations({ reservations, search = false, handleCancel }) {

  function formatMobile(number) {
    number = number.replaceAll("-", "");
    return (
      number.slice(0, 3) + "-" + number.slice(3, 6) + "-" + number.slice(6)
    );
  }

  return (
    <>
      <div style={{ display: "flex", flex: "1", flexWrap: "wrap" }}>
        {reservations.map((reservation) => {
          if (
            reservation.status === "booked" ||
            reservation.status === "seated" ||
            search
          ) {
            return (
              <div key={reservation.reservation_id} style={style}>
                <b>{formatAsTime(reservation.reservation_time)}</b>
                <span>- {formatAsDate(reservation.reservation_date)}</span>
                <br />
                {reservation.first_name} {reservation.last_name}
                <br />
                {formatMobile(reservation.mobile_number)}
                <br />
                <span>Party of {reservation.people}</span>
                <br />
                <b>
                  <p data-reservation-id-status={reservation.reservation_id}>
                    {reservation.status}
                  </p>
                </b>
                <br />
                {reservation.status === "booked" ? (
                  <div>
                    <a
                      href={`/reservations/${reservation.reservation_id}/seat`}
                    >
                      <button className="navigate" type="button">
                        Seat
                      </button>
                    </a>
                    <a
                      href={`/reservations/${reservation.reservation_id}/edit`}
                    >
                      <button className="navigate" type="button">
                        Edit
                      </button>
                    </a>
                    <button
                      className="navigate"
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
    </>
  );
}

export default DisplayReservations;
