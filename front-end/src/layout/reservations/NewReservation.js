import React from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../ErrorAlert";
import ReservationForm from "./ReservationForm";
import { createReservation } from "../../utils/api";

function NewReservation() {
  const [errorMessage, setErrorMessage] = useState(false);
  const history = useHistory();
  const defaultForm = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  };

  const [formData, setFormData] = useState(defaultForm);

  const handleChange = (event) => {
    setFormData((reservation) => ({
      ...reservation,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    const newResDate = formData.reservation_date;
    formData.people = parseInt(formData.people);
    try {
      await createReservation(formData, abortController.signal);
      setFormData(defaultForm);
      history.push(`/dashboard?date=${newResDate}`);
    } catch (error) {
      setErrorMessage(error);
    }
    return () => abortController.abort();
  };

  return (
    <div>
      <h1>New Reservation Page</h1>
      <ErrorAlert error={errorMessage} />
      <ReservationForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}

export default NewReservation;
