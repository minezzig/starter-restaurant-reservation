const knex = require("../db/connection");

async function list(reservation_date) {
  if (reservation_date) {
    return knex("reservations")
      .select("*")
      .where({ reservation_date })
      .orderBy("reservation_time");
  } else {
    return knex("reservations").select("*").orderBy("reservation_date");
  }
}

async function read(reservation_id) {
  return knex("reservations").select("*").where({ reservation_id }).first();
}

async function create(newReservation) {
  return knex("reservations")
    .insert(newReservation)
    .returning("*")
    .then((addition) => addition[0]);
}

async function updateReservationStatus(reservation_id, status) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id })
    .update("status", status, "*")
    .then((updatedReservationStatus) => updatedReservationStatus[0]);
}

module.exports = { list, read, create, updateReservationStatus };
