const knex = require("../db/connection");

async function list() {
  return knex("tables").select("*").orderBy("table_name");
}

async function create(newTable) {
  return knex("tables")
    .insert(newTable)
    .returning("*")
    .then((addition) => addition[0]);
}

module.exports = { list, create };
