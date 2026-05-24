const express = require("express")
const router = express.Router()

const auth =
  require("../middleware/authMiddleware")

const role =
  require("../middleware/roleMiddleware")

const {
  createWorkspace,
  createDesk,
  createMeetingRoom,
  getRooms,
  getWorkspaces,
  getDeskAvailability,
  deleteWorkspace,
  deleteDesk,
  deleteRoom
} = require(
  "../controllers/workspaceController"
)

router.post(
  "/",
  auth,
  role("admin"),
  createWorkspace
)

router.post(
  "/desk",
  auth,
  role("admin"),
  createDesk
)

router.post(
  "/room",
  auth,
  role("admin"),
  createMeetingRoom
)

router.get(
  "/",
  auth,
  getWorkspaces
)

router.get(
  "/rooms",
  auth,
  getRooms
)

router.get(
  "/desks/availability",
  auth,
  getDeskAvailability
)

router.delete(
  "/:id",
  auth,
  role("admin"),
  deleteWorkspace
)

router.delete(
  "/desk/:id",
  auth,
  role("admin"),
  deleteDesk
)

router.delete(
  "/room/:id",
  auth,
  role("admin"),
  deleteRoom
)

module.exports = router