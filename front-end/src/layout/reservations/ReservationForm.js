import React from "react";
import { useHistory } from "react-router-dom";
import "./ReservationForm.css";

function ReservationForm({ formData, handleChange, handleSubmit, purpose }) {
  const history = useHistory();
  return (
    <>
      <h5>Please fill out the form with your party's information:</h5>
      <div>
        <form onSubmit={handleSubmit}>
          <fieldset>
            <label htmlFor="first_name">Name: </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
            ></input>
          </fieldset>
          <fieldset>
            <label htmlFor="last_name">Surname: </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
            ></input>
          </fieldset>
          <fieldset>
            <label htmlFor="mobile_number">Mobile Number: </label>
            <input
              type="tel"
              //pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              //title="555-555-1234"
              id="mobile_number"
              name="mobile_number"
              value={formData.mobile_number}
              onChange={handleChange}
              required
            ></input>
          </fieldset>
          <fieldset>
            <label htmlFor="reservation_date">Reservation Date: </label>
            <input
              type="date"
              id="reservation_date"
              name="reservation_date"
              //pattern="\d{4}-\d{2}-\d{2}"
              value={formData.reservation_date}
              onChange={handleChange}
              required
            ></input>
          </fieldset>
          <fieldset>
            <label htmlFor="reservation_time">Reservation Time: </label>
            <input
              type="time"
              //pattern="[0-9]{2}:[0-9]{2}"
              id="reservation_time"
              name="reservation_time"
              value={formData.reservation_time}
              onChange={handleChange}
              required
            ></input>
          </fieldset>
          <fieldset>
            <label htmlFor="people">Party Size: </label>
            <input
              type="number"
              id="people"
              name="people"
              min="1"
              value={formData.people}
              onChange={handleChange}
              required
            ></input>
          </fieldset>
          <fieldset>
            <button className="navigate" type="submit">
              {purpose ? "submit" : "Reserve"}
            </button>
            <button
              className="navigate"
              type="reset"
              onClick={() => history.push("/")}
            >
              Cancel
            </button>
          </fieldset>
        </form>
      </div>
    </>
  );
}

export default ReservationForm;
