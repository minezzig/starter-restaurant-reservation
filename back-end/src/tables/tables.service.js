const knex = require("../db/connection");

async function list() {
  return knex("tables").select("*").orderBy("table_name");
}

async function read(table_id) {
  return knex("tables").select("*").where({ table_id }).first();
}

async function create(newTable) {
  return knex("tables")
    .insert(newTable)
    .returning("*")
    .then((addition) => addition[0]);
}

async function seatTable(table_id, reservation_id) {
  return knex("tables")
    .select("*")
    .where({ table_id })
    .update({ reservation_id }, "*")
    .then((satTable) => satTable[0]);
}

async function finishTable(table_id) {
  return knex("tables")
    .select("*")
    .where({ table_id })
    .update("reservation_id", null, "*")
    .then((finishedTable) => finishedTable[0]);
}

module.exports = { list, read, create, seatTable, finishTable };
