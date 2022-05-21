import React from "react";
import { useState } from "react";

function Search() {
  const [formData, setFormData] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();
    alert("form submitted");
  }
  
  return (
    <>
      <h1>Search for Reservation</h1>
      <div>
        <form onSubmit={handleSubmit}>
          <fieldset>
            <label htmlFor="movile_number">Mobile Number:</label>
            <input
              name="mobile_number"
              id="mobile_number"
              placeholder="Enter a customer's phone number"
              value={formData.mobile_number}
              onChange={handleChange}
            />
          </fieldset>
          <fieldset>
            <button type="submit">Find</button>
          </fieldset>
        </form>
      </div>
    </>
  );
}
export default Search;
