const tablesService = require("./tables.service");
const reservationsService = require("../reservations/reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
//const { table } = require("../db/connection");

const validProperties = ["table_name", "capacity"];

async function list(req, res) {
  const data = await tablesService.list();
  res.json({ data });
}

function hasRequriedProperties(req, res, next) {
  const { data = {} } = req.body;
  if (!req.body.data) {
    next({ status: 400, message: `No data included` });
  }

  validProperties.forEach((property) => {
    if (!data[property]) {
      next({ status: 400, message: `Missing property: ${property}` });
    }
    if (property === "table_name" && data.table_name.length < 2) {
      next({
        status: 400,
        message: `Table name must be at least 2 character in length`,
      });
    }
    if (
      property === "capacity" &&
      (data.capacity < 1 || !Number.isInteger(data.capacity))
    ) {
      next({
        status: 400,
        message: `Your party size must be an intger of at least 1`,
      });
    }
  });
  next();
}

function validSeatingRequest(req, res, next) {
  const { data = {} } = req.body;
  if (!data) {
    next({ status: 400, message: `Request data not included` });
  }
  if (!data.reservation_id) {
    next({ status: 400, message: `A reservation ID must be included` });
  }
  next();
}

async function tableExists(req, res, next) {
  const { table_id } = req.params;
  const table = await tablesService.read(table_id);
  if (table) {
    res.locals.table = table;
    return next();
  }
  next({ status: 400, message: `Table ${table_id} doesn't exist.` });
}

async function reservationExists(req, res, next) {
  const { reservation_id } = req.body.data;
  const reservation = await reservationsService.read(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;

    return next();
  }
  next({
    status: 400,
    message: `Reservation #${reservation_id} does not exist.`,
  });
}

function partyFits(req, res, next) {
  const { people } = res.locals.reservation;
  const { capacity } = res.locals.table;
  const partyFits = people < capacity;
  if (partyFits) {
    return next();
  }
  next({ status: 400, message: `The party contains more people than chairs` });
}

function tableOccupied(req,res,next) {
const {reservation_id} = res.locals.table;
if (reservation_id) {
  next({status: 400, message: `The requested table is already occupied`});
}
next();
}

async function read(req, res) {
  const { table_id } = res.locals.table;
  const response = await tablesService.read(table_id);
  res.status(201).json({ data: response });
}

async function create(req, res) {
  const newTable = await tablesService.create(req.body.data);
  res.status(201).json({ data: newTable });
}

async function seatTable(req, res) {
  const { table_id } = res.locals.table;
  const { reservation_id } = res.locals.reservation;
  const updatedTable = await tablesService.seatTable(table_id, reservation_id);
  console.log(updatedTable);
  res.status(201).json({ data: updatedTable });
}
//-------------- validations ------------------

module.exports = {
  list: asyncErrorBoundary(list),
  read: [tableExists, asyncErrorBoundary(read)],
  create: [hasRequriedProperties, asyncErrorBoundary(create)],
  seatTable: [
    validSeatingRequest,
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(reservationExists),
    partyFits,
    tableOccupied,
    asyncErrorBoundary(seatTable),
  ],
};
