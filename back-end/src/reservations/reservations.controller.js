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
  if (!req.body.data) {
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

// has valid status update property
function validStatusUpdateProperty(req, res, next) {
  if (!req.body.data) {
    return next({ status: 400, message: `no data` });
  }
  const {status} = req.body.data
}

// check to make sure date isn't Tuesday or date/time in the past
function validateDateTime(req, res, next) {
  const { data } = req.body;

  //convert date request into just date format
  const dateRequest = new Date(data.reservation_date);
  //console.log("Reservation_date", data.reservation_date);
  //console.log("dateRequest", dateRequest)
  const dateRequestFormat =
    dateRequest.getFullYear() +
    "-" +
    dateRequest.getMonth() +
    "-" +
    dateRequest.getDate();
  //console.log("dateREquestFormat", dateRequestFormat)
  const timeRequest = data.reservation_time;

  //format current date/time to match
  const now = new Date();
  const date = now.getFullYear() + "-" + now.getMonth() + "-" + now.getDate();
  //console.log("date now", date)
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
  const { mobile_number } = req.query;
  const data = await reservationsService.list(date, mobile_number);
  res.status(200).json({ data });
}

function read(req, res) {
  const reservation = res.locals.reservation;
  res.status(200).json({ data: reservation });
}

async function create(req, res) {
  const newReservation = await reservationsService.create(req.body.data);
  res.status(201).json({ data: newReservation });
}

async function updateReservationStatus(req, res) {
  const { reservation_id } = res.locals.reservation;
  const { status } = req.body.data;
  const updatedReservationStatus =
    await reservationsService.updateReservationStatus(reservation_id, status);
  res.status(200).json({ data: updatedReservationStatus });
}

async function updateReservationInformation(req, res) {
  const { reservation_id } = res.locals.reservation;
  const reservation = req.body.data;
  const udpatedReservationInformation =
    await reservationsService.updateReservationInformation(
      reservation_id,
      reservation
    );
  res.status(200).json({ data: udpatedReservationInformation });
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
  create: [hasValidProperties, validateDateTime, asyncErrorBoundary(create)],
  update: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(updateReservationStatus),
  ],
  updateReservationInformation: [
    asyncErrorBoundary(reservationExists),
    hasValidProperties,
    validateDateTime,
    asyncErrorBoundary(updateReservationInformation),
  ],
};

// createa;   has only necessary properties

//update (status):    has required properties for updateStatus {status:}
//                    a status can oonly be booked, seated, finished, cancelled
//                  verify that reservation is booked (not seated cancled or finished)

//updateReservationInfo:  ADDED
//includes all necessary information - same as create {hasValidProperies, validateTIme}

//
