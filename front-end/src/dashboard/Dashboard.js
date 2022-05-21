import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { listReservations, updateReservationStatus } from "../utils/api";
import { listTables, finishTable } from "../utils/api";
import useQuery from "../utils/useQuery";
import { today, previous, next } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import DisplayReservations from "../layout/reservations/DisplayReservations";
import DisplayTables from "../layout/tables/DisplayTables";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date, setDate }) {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const history = useHistory();
  const route = useRouteMatch();
  const query = useQuery();

  useEffect(() => {
    const updateDate = () => {
      const date = query.get("date");
      if (date) {
        setDate(date);
      } else {
        setDate(today());
      }
    };
    updateDate();
  }, [query, setDate, route]);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    //setReservationsError(null);
    listTables(abortController.signal).then(setTables).catch(setErrorMessage);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setErrorMessage);

    return () => abortController.abort();
  }

  const handleCancel = async (reservation_id) => {
    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      )
    ) {
      const abortController = new AbortController();
      try {
        await updateReservationStatus(
          reservation_id,
          "cancelled",
          abortController.signal
        );
        loadDashboard();
      } catch (error) {
        if (error.name !== "AbortError") {
          setErrorMessage(error);
        }
      }

      return () => abortController.abort();
    }
  };

  const handleFinish = async (table_id, reservation_id) => {
    if (
      window.confirm(
        `Is this table ready to seat new guests? This cannot be undone.`
      )
    ) {
      const abortController = new AbortController();
      try {
        await finishTable(table_id, abortController.signal);
        await updateReservationStatus(
          reservation_id,
          "finished",
          abortController.signal
        );
        loadDashboard();
      } catch (error) {
        if (error.name !== "AbortError") {
          setErrorMessage(error);
        }
      }

      return () => abortController.abort();
    }
  };

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const months = [
    null,
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let day = new Date(date).getDay();

  const dateString = [
    parseInt(date.slice(5, 7)),
    parseInt(date.slice(8, 10)),
    parseInt(date.slice(0, 4)),
  ];

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">
          Reservations for: {days[day]}, {months[dateString[0]]} {dateString[1]}
          , {dateString[2]}
        </h4>
      </div>
      <button
        className="navigate"
        onClick={() => history.push(`?date=${previous(date)}`)}
      >
        Previous
      </button>
      <button
        className="navigate"
        onClick={() => history.push(`?date=${today()}`)}
      >
        Today
      </button>
      <button
        className="navigate"
        onClick={() => history.push(`?date=${next(date)}`)}
      >
        Next
      </button>
      <ErrorAlert error={errorMessage} />

      <DisplayReservations
        reservations={reservations}
        handleCancel={handleCancel}
      />

      <DisplayTables tables={tables} handleFinish={handleFinish} />
    </main>
  );
}

export default Dashboard;
