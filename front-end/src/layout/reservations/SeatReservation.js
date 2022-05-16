import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { listTables } from "../../utils/api";
//import ErrorAlert from "../ErrorAlert";

function SeatReservation() {
  const { reservation_id } = useParams();
  const [tables, setTables] = useState([]);
  //const { showError, setShowError } = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    async function getTables() {
      try {
        const response = await listTables(abortController.signal);
        setTables(response);
        JSON.stringify("hello");
      } catch (error) {
        if (error.name !== "AbortError") {
          console.log(error);
        }
      }
    }
    getTables();
    return () => abortController.abort();
  }, [reservation_id]);

  const tableList = tables.map((table) => {
    return (
      <option key={table.table_id}>
        {table.table_name} - {table.capacity}
      </option>
    );
  });

  return (
    <div>
      <h1>seat reservation page</h1>
      <p>seating customer id number: {reservation_id}</p>
      <form>
        <label htmlFor="table_id">Table Number:</label>
        <select name="table_id">{tableList}</select>
      </form>
    </div>
  );
}

export default SeatReservation;