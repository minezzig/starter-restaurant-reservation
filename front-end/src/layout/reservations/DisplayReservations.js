import React from "react";
import { formatAsDate, formatAsTime } from "../../utils/date-time";
import "./DisplayReservations.css";

function DisplayReservations({ reservations, search = false, handleCancel }) {
  // format mobile numbrer as 123-456-7890
  function formatMobile(number) {
    number = number.replaceAll("-", "");
    return (
      number.slice(0, 3) + "-" + number.slice(3, 6) + "-" + number.slice(6)
    );
  }
  reservations = reservations.filter(res => res.status === "booked" || res.status === "seated");

  return (
    <>
      <div className="cardsContainer">
        {reservations.length ? reservations.map((reservation) => {
            return (
              <div key={reservation.reservation_id} className="card">
                <div>
                  <b>{formatAsTime(reservation.reservation_time)}</b>
                  <span>- {formatAsDate(reservation.reservation_date)}</span>
                </div>
                <div>
                  {reservation.first_name} {reservation.last_name}
                </div>
                <div>{formatMobile(reservation.mobile_number)}</div>
                <div>Party of {reservation.people}</div>
                <div data-reservation-id-status={reservation.reservation_id}>
                  <b>{reservation.status}</b>
                </div>
                <div>
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
              </div>
            );
        }) : "No reserverations for today"}
      </div>
    </>
  );
}

export default DisplayReservations;
