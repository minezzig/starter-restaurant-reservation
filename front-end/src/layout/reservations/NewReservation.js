import React from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import ReservationForm from "./ReservationForm";

function NewReservation() {
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
    console.log(formData);
  };

  const handleSubmit = () => {
    alert("submitted");
    history.push("/dashboard");
  };

  return (
    <div>
      <h1>New Reservation Page</h1>
      <ReservationForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}

export default NewReservation;
