import React from "react";
import { useState } from "react";
import { searchMobileNumber } from "../utils/api";
import DisplayReservations from "./reservations/DisplayReservations";

function Search() {
  const initialFormData = { mobile_number: "" };
  const [formData, setFormData] = useState(initialFormData);
  const [results, setResults] = useState([]);
  const noResults = "No reservations found";

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { mobile_number } = formData;
    const abortController = new AbortController();
    const found = await searchMobileNumber(
      mobile_number,
      abortController.signal
    );
    found.length ? setResults(found) : setResults(noResults);
  };

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
              required
            />
          </fieldset>
          <fieldset>
            <button type="submit">Find</button>
          </fieldset>
        </form>
      </div>
      {typeof results !== "string" ? (
        <DisplayReservations reservations={results} search={true} />
      ) : (
        results
      )}
    </>
  );
}
export default Search;
