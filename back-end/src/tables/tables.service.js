const knex = require("../db/connection");

async function create(newTable) {
  return knex("tables")
    .insert(newTable)
    .returning("*")
    .then((addition) => addition[0]);
}

module.exports = { create };
