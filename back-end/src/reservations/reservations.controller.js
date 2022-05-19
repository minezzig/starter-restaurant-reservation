const reservationsService = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// ---------------- VALIDATIONS ---------------- //
const validProperties = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
];

// check that API receives all necessary fields
function hasValidProperties(req, res, next) {
  const { data = {} } = req.body;
  if (!data) {
    return next({ status: 400, message: `no data` });
  }

  validProperties.forEach((property) => {
    if (!data[property]) {
      return next({ status: 400, message: `missing ${property} value` });
    }
  });

  if (data.people < 1 || !Number.isInteger(data.people)) {
    return next({
      status: 400,
      message: "Party size must be and integer of 1 or more",
    });
  }

  next();
}

// check to make sure date isn't Tuesday or date/time in the past
function validateDateTime(req, res, next) {
  const { data } = req.body;
  //convert date request into just date format
  const dateRequest = new Date(data.reservation_date);
  const dateRequestFormat =
    dateRequest.getFullYear() +
    "-" +
    dateRequest.getMonth() +
    "-" +
    dateRequest.getDate();
  const timeRequest = data.reservation_time;

  //format current date/time to match
  const now = new Date();
  const date = now.getFullYear() + "-" + now.getMonth() + "-" + now.getDate();
  const time = now.getHours() + ":" + now.getMinutes();

  // validate if we're open
  if (timeRequest < "10:30" || timeRequest > "21:30") {
    if (timeRequest >= "22:30") {
      return next({
        status: 400,
        message: "Sorry, we are closed.  We close at 22:30h",
      });
    }
    return next({
      status: 400,
      message: "Reservations allowed between 10:30h and 21.30h",
    });
  }

  // reservation must be before present date and time
  if (
    dateRequestFormat < date ||
    (dateRequestFormat === date && timeRequest <= time)
  ) {
    if (dateRequest.getDay() === 2) {
      return next({
        status: 400,
        // message: "We don't accept reservations for the past, nor for Tuesdays",
        message: "We don't accept reservations on Tuesdays, as we are closed",
      });
    }
    return next({
      status: 400,
      message: "Please choose a time and date later than the present moment",
    });
  }
  // do not allow reservations on Tuesdays
  if (dateRequest.getDay() === 2) {
    return next({ status: 400, message: "Sorry, we're closed on Tuesdays!" });
  }
  next();
}

async function reservationExists(req, res, next) {
  const { reservation_id } = req.params;
  const reservation = await reservationsService.read(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({ status: 404, message: "Reservation doesn't exist" });
}

// ---------------- HTTP requests ---------------- //
async function list(req, res) {
  const { date } = req.query;
  const data = await reservationsService.list(date);
  res.json({ data });
}
async function read(req, res) {
  const { reservation_id } = res.locals.reservation;
  const response = await reservationsService.read(reservation_id);
  res.json({ data: response });
}

async function create(req, res) {
  const newReservation = await reservationsService.create(req.body.data);
  res.status(201).json({ data: newReservation });
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
  create: [hasValidProperties, validateDateTime, asyncErrorBoundary(create)],
};
