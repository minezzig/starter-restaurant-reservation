const reservationsService = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
//const {formatAsTime} = require ("../../utils/date-time");

// ---------------- VALIDATIONS ---------------- //
const validProperties = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
];

const validStatusProperties = ["booked", "seated", "finished", "cancelled"];

const datePattern = /[0-9]{4}-[0-9]{2}-[0-9]{2}/;
const timePattern = /[0-9]{2}:[0-9]{2}/;

// check that API receives all necessary fields
function hasValidProperties(req, res, next) {
  const { data = {} } = req.body;
  if (!req.body.data) {
    return next({ status: 400, message: `no data` });
  }
  //checks to see if all required properties are present
  validProperties.forEach((property) => {
    if (!data[property]) {
      return next({ status: 400, message: `missing ${property} value` });
    }
  });
  // check is people is 1 or more and is an interger
  if (data.people < 1 || !Number.isInteger(data.people)) {
    return next({
      status: 400,
      message: `people must be an integer of 1 or more`,
    });
  }
  // check is date is formatted correctly
  if (!datePattern.test(data.reservation_date)) {
    return next({
      status: 400,
      message: `reservation_date must be formatted as a date, YYYY-MM-DD`,
    });
  }
  // check if time is formatted correctly
  if (!timePattern.test(data.reservation_time)) {
    return next({
      status: 400,
      message: `reservation_time must be formatted correctly: HH:MM`,
    });
  }
  // if a status is included in creation, it mst be "booked"
  if (data.status && data.status !== "booked") {
    next({
      status: 400,
      message: "tables can not be created with a 'seated' or 'finished' status",
    });
  }

  next();
}

// has valid status update property //! haven't written yet...
function validStatusUpdateProperty(req, res, next) {
  const { status } = req.body.data;
  if (!req.body.data) {
    return next({ status: 400, message: `no data` });
  }

  if (!validStatusProperties.includes(status)) {
    next({
      status: 400,
      message: `${status} is not a valid status.  Choose Booked, Seated, or Finished`,
    });
  }
  next();
}

function reservationNotFinished(rq, res, next) {
  const { reservation } = res.locals;
  if (reservation.status === "finished") {
    next({
      status: 400,
      message: `Reservation ${reservation.resevation_id} has already finished their meal and cannot be updated`,
    });
  }
  next();
}

// check to make sure date isn't Tuesday or date/time in the past
function validateDateTime(req, res, next) {
  const { data: {reservation_date, reservation_time} } = req.body;
  // dateREquest is an object 2022-05-23T12:05:00.000z
  const dateRequest = new Date(
    `${reservation_date} ${reservation_time}`
  );
  //string time HH:MM
  const timeRequest = reservation_time;
  //today is an object 2022-05-23T12:05:00.000z
  const today = new Date();
  // no reservations allowed on tuesdays
  if (dateRequest.getDay() === 2) {
    return next({
      status: 400,
      message: "Sorry, we're closed on Tuesdays!",
    });
  } 
  // no reservations if not open
  if (timeRequest < "10:30" || timeRequest > "21:30") {
    return next({
      status: 400,
      message: "Reservations allowed between 10:30h and 21.30h",
    });
  }
  // no reservations in the past
  if (dateRequest < today) {
    return next({
      status: 400,
      message: "Please choose a time and date that is in the future",
    });
  }
  // check to see if request time is during working hours
  if (dateRequest < today && day === 2) {
    return next({
      status: 400,
      message:
        "We don't accept reservations on Tuesdays, as we are closed",
    });
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
  next({ status: 404, message: `Reservation ${reservation_id} doesn't exist` });
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
    validStatusUpdateProperty,
    reservationNotFinished,
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

//

/*
function validateDateTime(req, res, next) {
  const { data: {reservation_date, reservation_time} } = req.body;
  //keep dates as objects so nothing gets funky!!!
  // date object with 2022-05-23T12:05:00.000z - two hours before real time
  const dateRequest = new Date(reservation_date);
  console.log("dateRequest", dateRequest)
  // date object 2022-05-23T12:05:00.000z
  const today = new Date();
  console.log("today", today)
  const timeRequest = reservation_time; //string time HH:MM
  
  // do not allow reservations on Tuesdays in general
  console.log(dateRequest.getDay())
  if (dateRequest.getDay() === 2) {
    return next({
      status: 400,
      message: "Sorry, we're closed on Tuesdays!",
    });
  }
  // check to see if request time is during working hours
  if (timeRequest < "10:30" || timeRequest > "21:30") {
    return next({
      status: 400,
      message: "Reservations allowed between 10:30h and 21.30h",
    });
  }
  // check to see that the date requested isn't in the past
  if (dateRequest < today) {
    return next({
      status: 400,
      message: "Please choose a time and date that is in the future",
    });
  }
  // if the date requested is in the past and is also a Tuesday, let them know
  if (dateRequest < today && day === 2) {
    return next({
      status: 400,
      message: `We don't accept reservations on Tuesdays, as we are closed`,
    });
  }

  next();
}
*/
