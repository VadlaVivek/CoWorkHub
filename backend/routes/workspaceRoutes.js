const express = require("express")
const router = express.Router()

const db = require("../database/db")

const auth =
  require("../middleware/authMiddleware")

const role =
  require("../middleware/roleMiddleware")

// ======================
// GET ALL WORKSPACES
// ======================

router.get("/", (req, res) => {

  db.all(
    "SELECT * FROM workspaces",
    [],
    (err, rows) => {

      if (err) {
        return res.status(500).json({
          message: err.message
        })
      }

      res.json(rows)
    }
  )
})

// ======================
// GET ALL DESKS
// ======================

router.get("/desks", (req, res) => {

  db.all(
    "SELECT * FROM desks",
    [],
    (err, rows) => {

      if (err) {
        return res.status(500).json({
          message: err.message
        })
      }

      res.json(rows)
    }
  )
})

// ======================
// GET DESKS BY WORKSPACE
// ======================

router.get(
  "/desks/availability",
  (req, res) => {

    const workspaceId =
      req.query.workspace_id

    let query =
      "SELECT * FROM desks"

    let params = []

    if (workspaceId) {

      query +=
        " WHERE workspace_id = ?"

      params.push(workspaceId)
    }

    db.all(
      query,
      params,
      (err, rows) => {

        if (err) {
          return res.status(500).json({
            message: err.message
          })
        }

        res.json(rows)
      }
    )
  }
)

// ======================
// GET ALL ROOMS
// ======================

router.get("/rooms", (req, res) => {

  db.all(
    "SELECT * FROM meeting_rooms",
    [],
    (err, rows) => {

      if (err) {
        return res.status(500).json({
          message: err.message
        })
      }

      res.json(rows)
    }
  )
})

// ======================
// CREATE WORKSPACE
// ======================

router.post(
  "/",
  auth,
  role("admin"),
  (req, res) => {

    const {
      name,
      location,
      floor,
      pricing
    } = req.body

    db.run(
      `
      INSERT INTO workspaces
      (name, location, floor, pricing)
      VALUES (?, ?, ?, ?)
      `,
      [
        name,
        location,
        floor,
        pricing
      ],
      function (err) {

        if (err) {
          return res.status(500).json({
            message: err.message
          })
        }

        res.json({
          message: "Workspace created",
          id: this.lastID
        })
      }
    )
  }
)

// ======================
// CREATE DESK
// ======================

router.post(
  "/desk",
  auth,
  role("admin"),
  (req, res) => {

    const {
      workspace_id,
      name,
      type
    } = req.body

    db.run(
      `
      INSERT INTO desks
      (
        workspace_id,
        desk_name,
        seating_type,
        status
      )
      VALUES (?, ?, ?, 'available')
      `,
      [
        workspace_id,
        name,
        type
      ],
      function (err) {

        if (err) {
          return res.status(500).json({
            message: err.message
          })
        }

        res.json({
          message: "Desk created",
          id: this.lastID
        })
      }
    )
  }
)

// ======================
// CREATE ROOM
// ======================

router.post(
  "/room",
  auth,
  role("admin"),
  (req, res) => {

    const {
      workspace_id,
      room_name,
      capacity
    } = req.body

    db.run(
      `
      INSERT INTO meeting_rooms
      (
        workspace_id,
        room_name,
        capacity,
        status
      )
      VALUES (?, ?, ?, 'available')
      `,
      [
        workspace_id,
        room_name,
        capacity
      ],
      function (err) {

        if (err) {
          return res.status(500).json({
            message: err.message
          })
        }

        res.json({
          message: "Room created",
          id: this.lastID
        })
      }
    )
  }
)

// ======================
// DELETE WORKSPACE
// ======================

router.delete(
  "/:id",
  auth,
  role("admin"),
  (req, res) => {

    db.run(
      `
      DELETE FROM workspaces
      WHERE id = ?
      `,
      [req.params.id],
      function (err) {

        if (err) {
          return res.status(500).json({
            message: err.message
          })
        }

        res.json({
          message: "Workspace deleted"
        })
      }
    )
  }
)

// ======================
// DELETE DESK
// ======================

router.delete(
  "/desk/:id",
  auth,
  role("admin"),
  (req, res) => {

    db.run(
      `
      DELETE FROM desks
      WHERE id = ?
      `,
      [req.params.id],
      function (err) {

        if (err) {
          return res.status(500).json({
            message: err.message
          })
        }

        res.json({
          message: "Desk deleted"
        })
      }
    )
  }
)

// ======================
// DELETE ROOM
// ======================

router.delete(
  "/room/:id",
  auth,
  role("admin"),
  (req, res) => {

    db.run(
      `
      DELETE FROM meeting_rooms
      WHERE id = ?
      `,
      [req.params.id],
      function (err) {

        if (err) {
          return res.status(500).json({
            message: err.message
          })
        }

        res.json({
          message: "Room deleted"
        })
      }
    )
  }
)

module.exports = router