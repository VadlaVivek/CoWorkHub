const express = require("express")
const router = express.Router()

const auth =
  require("../middleware/authMiddleware")

const role =
  require("../middleware/roleMiddleware")

const {
  getDashboardMetrics
} = require(
  "../controllers/dashboardController"
)

router.get(
  "/workspace",
  auth,
  role("staff","admin"),
  getDashboardMetrics
)

module.exports = router