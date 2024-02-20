import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { readReservation, updateReservationInformation } from "../../utils/api";
import ReservationForm from "./ReservationForm";
import ErrorAlert from "../ErrorAlert";
import { formatAsDate } from "../../utils/date-time";

function EditReservation() {
  const defaultForm = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  };
  const { reservation_id } = useParams();
  const [formData, setFormData] = useState(defaultForm);
  const [errorMessage, setErrorMessage] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const abortController = new AbortController();
    async function getReservation() {
      try {
        const result = await readReservation(
          reservation_id,
          abortController.signal
        );
        result.reservation_date = formatAsDate(result.reservation_date);
        setFormData(result);
      } catch (error) {
        if (error.name !== "AbortError") {
          setErrorMessage(error);
        }
      }
    }
    getReservation();
    return () => abortController.abort();
  }, [reservation_id]);

  const handleChange = (event) => {
    setFormData((reservation) => ({
      ...reservation,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    formData.people = parseInt(formData.people);
    const updatedReservation = formData;
    //console.log(reservation_id, updatedReservation)
    try {
      await updateReservationInformation(reservation_id, updatedReservation, abortController.signal);
      history.push(`/dashboard?date=${updatedReservation.reservation_date}`);
    } catch (error) {
      setErrorMessage(error);
    }
    return () => abortController.abort();
  };

  return (
    <>
      <h1>Edit Reservation</h1>
      <ErrorAlert error={errorMessage} />
      <ReservationForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        purpose={"edit"}
      />
    </>
  );
}

export default EditReservation;
