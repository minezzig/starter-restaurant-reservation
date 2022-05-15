import React from "react";
import { useHistory } from "react-router-dom";

function TableForm({formData, handleChange, handleSubmit}) {
  const history = useHistory();

  return (
    <div>
      <h2>TABLE FORM</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="table_name">Table Name</label>
        <input
          type="text"
          id="table_name"
          name="table_name"
          value={formData.table_name}
          onChange={handleChange}
          minLength="2"
          required
        />
        <br />
        <label htmlFor="capacity">Capacity:</label>
        <input
          type="number"
          id="capacity"
          name="capacity"
          value={formData.capacity}
          onChange={handleChange}
          min="1"
          required
        />
        <br />
        <button type="submit">Submit</button>
        <button type="reset" onClick={() => history.goBack()}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default TableForm;
