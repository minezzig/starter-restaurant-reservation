import React from "react";
import { useHistory } from "react-router-dom";

function ReservationForm({ formData, handleChange, handleSubmit }) {
  const history = useHistory();
  return (
    <div>
      <h5>Please fill out the form with your party's information:</h5>
      <form onSubmit={handleSubmit}>
        <label htmlFor="first_name">Name: </label>
        <input
          type="text"
          id="first_name"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          required
        ></input>
        <br />
        <label htmlFor="last_name">Surname: </label>
        <input
          type="text"
          id="last_name"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          required
        ></input>
        <br />
        <label htmlFor="mobile_number">Mobile Number: </label>
        <input
          type="text"
          id="mobile_number"
          name="mobile_number"
          value={formData.mobile_number}
          onChange={handleChange}
          required
        ></input>
        <br />
        <label htmlFor="reservation_date">Reservation Date: </label>
        <input
          type="date"
          id="reservation_date"
          name="reservation_date"
          value={formData.reservation_date}
          onChange={handleChange}
          required
        ></input>
        <br />
        <label htmlFor="reservation_time">Reservation Time: </label>
        <input
          type="time"
          id="reservation_time"
          name="reservation_time"
          value={formData.reservation_time}
          onChange={handleChange}
          required
        ></input>
        <br />
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
        <br />
        <button type="submit">Reserve</button>
        <button type="reset" onClick={() => history.push("/")}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default ReservationForm;
