import React from "react";

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

function DisplayTables({ tables }) {
  return (
    <div>
      <h1>table display</h1>
      {tables.map((table) => (
        <div style={table.reservation_id ? occupied : open} key={table.table_id}>
          Table Name: {table.table_name}
          <br />
          Capacity: {table.capacity}
          <br />
          <span data-table-id-status={table.table_id}>
            <strong>
              {table.reservation_id === null ? "Free" : "Occupied"}
            </strong>
          </span>
        </div>
      ))}
    </div>
  );
}

export default DisplayTables;
