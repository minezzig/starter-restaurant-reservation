const knex = require("../db/connection");

async function list(reservation_date) {
  return knex("reservations")
    .select("*")
    .where({ reservation_date })
    .orderBy("reservation_time");
}

async function create(newReservation) {
  return knex("reservations")
    .insert(newReservation)
    .returning("*")
    .then((addition) => addition[0]);
}

module.exports = { list, create };
