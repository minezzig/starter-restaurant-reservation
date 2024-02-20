import React from "react";
import { useState } from "react";
import { useHistory } from "react-router";
import { createTable } from "../../utils/api";
import TableForm from "./TableForm";
import ErrorAlert from "../ErrorAlert";

function NewTable() {
  const history = useHistory();
  const defaultForm = { table_name: "", capacity: "" };
  const [formData, setFormData] = useState(defaultForm);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleChange = (event) => {
    setFormData((tables) => ({
      ...tables,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    try {
      formData.capacity = parseInt(formData.capacity);
      await createTable(formData, abortController.signal);
      setFormData(defaultForm);
      history.push("/dashboard");
    } catch (error) {
      setErrorMessage(error);
    }
    return () => abortController.abort();
  };

  return (
    <div>
      <h1>New Table</h1>
      <ErrorAlert error={errorMessage} />
      <TableForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}

export default NewTable;
