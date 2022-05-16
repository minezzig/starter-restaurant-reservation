import React from "react";

const myStyle = {
  boxShadow: "2px 2px black",
  border: "2px solid black",
  padding: "5px",
  margin: "10px",
  borderRadius: "5px",
  backgroundColor: "lightblue",
};

function DisplayTables({ tables }) {
  return (
    <div>
      <h1>table display</h1>
      {tables.map((table) => (
        <div style={myStyle} key={table.table_id}>
          Table Name: {table.table_name}
          <br /> Capacity: {table.capacity}
          <br />
          Status:{" "}
          <span data-table-id-status={table.table_id}>
            <strong>{table.table_name === true ? "Free" : "Occupied"}</strong>
          </span>
        </div>
      ))}
    </div>
  );
}

export default DisplayTables;
