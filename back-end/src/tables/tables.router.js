const router = require("express").Router();
const controller = require("./tables.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router
  .route("/")
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

router.route("/:table_id").get(controller.read);

router.route("/:table_id/seat").put(controller.seatTable).delete(controller.finishTable).all(methodNotAllowed);

module.exports = router;
