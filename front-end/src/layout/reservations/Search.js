import React from "react";
import { useState } from "react";
import { searchMobileNumber, updateReservationStatus } from "../../utils/api";
import DisplayReservations from "./DisplayReservations";
import ErrorAlert from "../ErrorAlert";

function Search() {
  const initialFormData = { mobile_number: "" };
  const [formData, setFormData] = useState(initialFormData);
  const [results, setResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const noResults = "No reservations found";

  // allow user to search
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  // cancel a reservation by updating selected reservation to "cancelled"
  const handleCancel = async (reservation_id) => {
    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      )
    ) {
      const abortController = new AbortController();
      try {
        await updateReservationStatus(
          reservation_id,
          "cancelled",
          abortController.signal
        );
        const { mobile_number } = formData;
        const found = await searchMobileNumber(
          mobile_number,
          abortController.signal
        );
        setResults(found);
      } catch (error) {
        if (error.name !== "AbortError") {
          setErrorMessage(error);
        }
      }

      return () => abortController.abort();
    }
  };

  // search database for matching mobile number entered by user
  const handleSubmit = async (event) => {
    event.preventDefault();
    const { mobile_number } = formData;
    const abortController = new AbortController();
    try {
      const found = await searchMobileNumber(
        mobile_number,
        abortController.signal
      );
      found.length ? setResults(found) : setResults(noResults);
    } catch (error) {}
  };

  return (
    <>
      <h3>Search for Reservation</h3>
      <div>
        <form onSubmit={handleSubmit}>
          <fieldset>
            <label htmlFor="movile_number">Mobile Number:</label>
            <input
              type="tel"
              name="mobile_number"
              id="mobile_number"
              placeholder="Enter a customer's phone number"
              value={formData.mobile_number}
              onChange={handleChange}
              required
            />
          </fieldset>
          <fieldset>
            <button type="submit" className="navigate">Find</button>
          </fieldset>
        </form>
      </div>

      {typeof results !== "string" ? (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          <DisplayReservations
            reservations={results}
            search={true}
            handleCancel={handleCancel}
          />{" "}
        </div>
      ) : (
        results
      )}

      <ErrorAlert error={errorMessage} />
    </>
  );
}
export default Search;
