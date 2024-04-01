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

  // allow user to edit input fields
  const handleChange = (event) => {
    setFormData((reservation) => ({
      ...reservation,
      [event.target.name]: event.target.value,
    }));
  };

  // save reservation, reset form, and redirect to dashboard to view reservation date page
  const handleSubmit = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    formData.people = parseInt(formData.people);
    try {
      await createReservation(formData, abortController.signal);
      setFormData(defaultForm);
      history.push(`/dashboard?date=${formData.reservation_date}`);
    } catch (error) {
      setErrorMessage(error);
    }
    return () => abortController.abort();
  };

  return (
    <div>
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
