import React from "react";

const open = {
  boxShadow: "2px 4px black",
  border: "2px solid black",
  padding: "50px 0",
  margin: "10px",
  borderRadius: "50%",
  backgroundColor: "lightblue",
  width: "200px",
  height: "200px",
  textAlign: "center",
};
const occupied = {
  boxShadow: "2px 4px black",
  border: "2px solid black",
  padding: "50px 0",
  margin: "10px",
  borderRadius: "50%",
  backgroundColor: "coral",
  width: "200px",
  height: "200px",
  textAlign: "center",
};
/*
const open = {
  boxShadow: "2px 2px black",
  border: "2px solid black",
  padding: "5px",
  margin: "10px",
  borderRadius: "5px",
  backgroundColor: "lightblue",
};

const occupied = {
  boxShadow: "2px 2px black",
  border: "2px solid black",
  padding: "5px",
  margin: "10px",
  borderRadius: "5px",
  backgroundColor: "coral",
};
*/

function DisplayTables({ tables, handleFinish }) {
  return (
    <>
      <h1>table display</h1>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {tables.map((table) => (
          <div
            style={table.reservation_id ? occupied : open}
            key={table.table_id}
          >
            Table Name: {table.table_name}
            <br />
            Capacity: {table.capacity}
            <br />
            <span data-table-id-status={table.table_id}>
              <strong>
                {table.reservation_id === null ? "Free" : "Occupied"}
              </strong>
            </span>
            <br />
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
        ))}
      </div>
    </>
  );
}

export default DisplayTables;
