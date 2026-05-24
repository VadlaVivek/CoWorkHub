const express = require("express")
const router = express.Router()

const auth =
  require("../middleware/authMiddleware")

const role =
  require("../middleware/roleMiddleware")

const {
  createReservation,
  getReservations,
  updateReservationStatus
} =
require(
  "../controllers/reservationController"
)

router.post(
  "/",
  auth,
  role("member","admin"),
  createReservation
)

router.get(
  "/",
  auth,
  getReservations
)

router.put(
  "/:id/status",
  auth,
  role("staff","admin"),
  updateReservationStatus
)

module.exports = router