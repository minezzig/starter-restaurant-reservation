const tablesService = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res){
  const data = await tablesService.list();
  res.json({data})
}

async function create(req, res) {
  const newTable = await tablesService.create(req.body.data);
  res.status(201).json({data: newTable})
}

module.exports = {
  list,
  create: asyncErrorBoundary(create)
};

