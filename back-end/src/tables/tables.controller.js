const tablesService = require("./tables.service");
const reservationsService = require("../reservations/reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const validProperties = ["table_name", "capacity"];

// ------------------VALIDATIONS-----------------------
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
        message: `table_name must be at least 2 character in length`,
      });
    }
    if (
      property === "capacity" &&
      (data.capacity < 1 || !Number.isInteger(data.capacity))
    ) {
      next({
        status: 400,
        message: `capacity must be an intger of at least 1`,
      });
    }
  });
  next();
}

function validSeatingRequest(req, res, next) {
  const { data = {} } = req.body;
  if (!req.body.data) {
    next({ status: 400, message: `Request data not included` });
  }
  if (!data.reservation_id) {
    next({ status: 400, message: `A reservation_id must be included` });
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
  next({ status: 404, message: `Table ${table_id} doesn't exist.` });
}

async function reservationExists(req, res, next) {
  const { reservation_id } = req.body.data;
  const reservation = await reservationsService.read(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `Reservation #${reservation_id} does not exist.`,
  });
}

function partyNotSeated(req, res, next) {
  const { reservation } = res.locals;
  if (reservation.status === "seated") {
    next({ status: 400, message: `This table has already been seated` });
  }
  next();
}
function partyFits(req, res, next) {
  const { people } = res.locals.reservation;
  const { capacity } = res.locals.table;
  if (people > capacity) {
    next({ status: 400, message: `Table does not have sufficient capacity` });
  }
  return next();
}

function tableOccupied(req, res, next) {
  const { reservation_id } = res.locals.table;
  if (reservation_id) {
    next({ status: 400, message: `The requested table is already occupied` });
  }
  next();
}

function readyToFinish(req, res, next) {
  const { reservation_id } = res.locals.table;
  if (!reservation_id) {
    next({
      status: 400,
      message: `This table is not occupied and can not be cleared`,
    });
  }
  next();
}

// --------------------regular calls------------------
async function list(req, res) {
  const data = await tablesService.list();
  res.status(200).json({ data });
}

function read(req, res) {
  const { table } = res.locals;
  res.status(200).json({ data: table });
}

async function create(req, res) {
  const newTable = await tablesService.create(req.body.data);
  res.status(201).json({ data: newTable });
}

async function seatTable(req, res) {
  const { table_id } = res.locals.table;
  const { reservation_id } = res.locals.reservation;
  const updatedTable = await tablesService.seatTable(table_id, reservation_id);
  const changedReservationStatus =
    await reservationsService.updateReservationStatus(reservation_id, "seated");
  res.status(200).json({ data: updatedTable, changedReservationStatus });
}

async function finishTable(req, res) {
  const { table_id } = res.locals.table;
  const { reservation_id } = res.locals.table;
  const finishedTable = await tablesService.finishTable(table_id);
  const changedReservationStatus =
    await reservationsService.updateReservationStatus(
      reservation_id,
      "finished"
    );
  res.status(200).json({ data: finishedTable, changedReservationStatus });
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(tableExists), asyncErrorBoundary(read)],
  create: [hasRequriedProperties, asyncErrorBoundary(create)],
  seatTable: [
    validSeatingRequest,
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(reservationExists),
    partyNotSeated,
    partyFits,
    tableOccupied,
    asyncErrorBoundary(seatTable),
  ],
  finishTable: [
    asyncErrorBoundary(tableExists),
    readyToFinish,
    asyncErrorBoundary(finishTable),
  ],
};
