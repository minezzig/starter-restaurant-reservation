import React from "react";
import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { listTables, seatTable, readReservation } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";

function SeatReservation() {
  const defaultForm = { table_id: "" };
  const { reservation_id } = useParams();
  const [tables, setTables] = useState([]);
  const [reservation, setReservation] = useState({});
  const [formData, setFormData] = useState(defaultForm);
  const [errorMessage, setErrorMessage] = useState(false);
  const history = useHistory();

  // fetch the tables data and the specific reservation from the page we are on
  useEffect(() => {
    const abortController = new AbortController();

    async function getTables() {
      try {
        const response = await listTables(abortController.signal);
        setTables(response);
        JSON.stringify("hello");
      } catch (error) {
        if (error.name !== "AbortError") {
          setErrorMessage(error);
        }
      }
    }

    async function getReservation() {
      try {
        const response = await readReservation(
          reservation_id,
          abortController.signal
        );
        setReservation(response);
      } catch (error) {
        if (error.name !== "AbortError") {
          setErrorMessage(error);
        }
      }
    }

    getTables();
    getReservation();

    return () => abortController.abort();
  }, [reservation_id]);

  // creates the options for the form with each table
  const tableList = tables.map((table) => {
    const partyFits = reservation.people <= table.capacity;
    return (
      <option key={table.table_id} value={table.table_id} disabled={!partyFits}>
        {table.table_name} - {table.capacity}
      </option>
    );
  });

  // collect information from form selection
  const handleChange = (event) => {
    setFormData({ [event.target.name]: event.target.value });
    console.log(formData);
  };

  // submit the form
  const handleSubmit = async (event) => {
    event.preventDefault();
    const table_id = Number(formData.table_id);
    const abortController = new AbortController();
    try {
      await seatTable(reservation_id, table_id, abortController.signal); //!add the form data
      history.push("/dashboard");
    } catch (error) {
      setErrorMessage(error);
    }
    return () => abortController.abort();
  };

  return (
    <div>
      <ErrorAlert error={errorMessage} />
      <h1>Choose a Table</h1>
      <p>
        Choose a table for {reservation.last_name}, party of{" "}
        {reservation.people}:
      </p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="table_id">Table Number:</label>
        <select id="table_id" name="table_id" onChange={handleChange} required>
          <option value="">Choose a Table</option>
          {tableList}
        </select>
        <br />
        <button type="submit">Submit</button>
        <button type="reset" onClick={() => history.goBack()}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default SeatReservation;
