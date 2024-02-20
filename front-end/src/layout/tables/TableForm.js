import React from "react";
import { useHistory } from "react-router-dom";

function TableForm({ formData, handleChange, handleSubmit }) {
  const history = useHistory();

  return (
    <>
      <div>
        <form onSubmit={handleSubmit}>
          <fieldset>
            <label htmlFor="table_name">Table Name:</label>
            <input
              type="text"
              id="table_name"
              name="table_name"
              value={formData.table_name}
              onChange={handleChange}
              minLength="2"
              required
            />
          </fieldset>
          <fieldset>
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
          </fieldset>
          <fieldset>
            <button type="submit" className="navigate">
              Submit
            </button>
            <button
              type="reset"
              className="navigate"
              onClick={() => history.goBack()}
            >
              Cancel
            </button>
          </fieldset>
        </form>
      </div>
    </>
  );
}

export default TableForm;
