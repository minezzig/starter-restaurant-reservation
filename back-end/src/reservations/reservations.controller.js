const reservationsService = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
/**
 * VALIDATIONS
 */
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

  if (data["people"] < 1) {
    return next({
      status: 400,
      message: "Party size must be 1 or more people",
    });
  }

  validProperties.forEach((property) => {
    if (!data[property]) {
      return next({ status: 400, message: `missing ${property} value` });
    }
  });

  next();
}

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
  create: [hasValidProperties, asyncErrorBoundary(create)],
};
