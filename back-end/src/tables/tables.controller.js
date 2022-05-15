const tablesService = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function create(req, res) {
  const newTable = await tablesService.create(req.body.data);
  res.status(201).json({data: newTable})
}

module.exports = {
  create: asyncErrorBoundary(create)
};

