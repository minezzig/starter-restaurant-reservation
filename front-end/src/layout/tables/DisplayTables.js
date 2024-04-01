import React from "react";
import "./DisplayTables.css";

function DisplayTables({ tables, handleFinish }) {
  // display the tables or if not found, Loading...
  return (
    <>
      <div className="tableContainer">
        {tables.length ? (
          tables.map((table) => (
            <div
              className={`${table.reservation_id ? "occupied" : "open"} table`}
              key={table.table_id}
            >
              <p>Table Name: {table.table_name}</p>
              <p>Capacity: {table.capacity}</p>
              <p data-table-id-status={table.table_id}>
                <strong>
                  {table.reservation_id === null ? "Free" : "Occupied"}
                </strong>
              </p>
              <div>
                {table.reservation_id && (
                  <button
                    data-table-id-finish={table.table_id}
                    onClick={() =>
                      handleFinish(table.table_id, table.reservation_id)
                    }
                  >
                    Finish
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>Loading Tables...</p>
        )}
      </div>
    </>
  );
}

export default DisplayTables;
