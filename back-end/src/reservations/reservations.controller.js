const reservationsService = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
/**
 * List handler for reservation resources
 */
async function list(req, res) {
  const lookUpDate = req.query.date;
  if (lookUpDate) {
    const data = await reservationsService.list(lookUpDate);
    res.json({ data });
  }
}

async function create(req, res) {
  const newReservation = await reservationsService.create(req.body.data);
  res.status(201).json({ data: newReservation });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: asyncErrorBoundary(create),
};

/**
 * async function create(req, res) {
  const { data: { first_name, last_name, mobile_number, reservation_date, reservation_time, people } = {} } = req.body;
  const newReservation = {
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people
  };

  res.status(201).json({ data: newReservation });
}
 */
