const express = require("express")
const router = express.Router()

const db = require("../database/db")
const auth = require("../middleware/authMiddleware")

// ======================
// GET ALL WORKSPACES
// ======================

router.get("/", (req, res) => {

  db.all(
    "SELECT * FROM workspaces",
    [],
    (err, rows) => {

      if (err) {
        return res
          .status(500)
          .json({
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
        return res
          .status(500)
          .json({
            message: err.message
          })
      }

      res.json(rows)
    }
  )
})

// ======================
// GET ALL ROOMS
// ======================

router.get("/rooms", (req, res) => {

  db.all(
    "SELECT * FROM rooms",
    [],
    (err, rows) => {

      if (err) {
        return res
          .status(500)
          .json({
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
  auth(["admin"]),
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
      (name,location,floor,pricing)
      VALUES (?,?,?,?)
      `,
      [
        name,
        location,
        floor,
        pricing
      ],
      function (err) {

        if (err) {
          return res
            .status(500)
            .json({
              message:
                err.message
            })
        }

        res.json({
          message:
            "Workspace created"
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
  auth(["admin"]),
  (req, res) => {

    const {
      workspace_id,
      name,
      type
    } = req.body

    db.run(
      `
      INSERT INTO desks
      (workspace_id,name,type)
      VALUES (?,?,?)
      `,
      [
        workspace_id,
        name,
        type
      ],
      function (err) {

        if (err) {
          return res
            .status(500)
            .json({
              message:
                err.message
            })
        }

        res.json({
          message:
            "Desk created"
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
  auth(["admin"]),
  (req, res) => {

    const {
      workspace_id,
      name,
      capacity
    } = req.body

    db.run(
      `
      INSERT INTO rooms
      (workspace_id,name,capacity)
      VALUES (?,?,?)
      `,
      [
        workspace_id,
        name,
        capacity
      ],
      function (err) {

        if (err) {
          return res
            .status(500)
            .json({
              message:
                err.message
            })
        }

        res.json({
          message:
            "Room created"
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
  auth(["admin"]),
  (req, res) => {

    db.run(
      `
      DELETE FROM workspaces
      WHERE id=?
      `,
      [req.params.id],
      function (err) {

        if (err) {
          return res
            .status(500)
            .json({
              message:
                err.message
            })
        }

        res.json({
          message:
            "Workspace deleted"
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
  auth(["admin"]),
  (req, res) => {

    db.run(
      `
      DELETE FROM desks
      WHERE id=?
      `,
      [req.params.id],
      function (err) {

        if (err) {
          return res
            .status(500)
            .json({
              message:
                err.message
            })
        }

        res.json({
          message:
            "Desk deleted"
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
  auth(["admin"]),
  (req, res) => {

    db.run(
      `
      DELETE FROM rooms
      WHERE id=?
      `,
      [req.params.id],
      function (err) {

        if (err) {
          return res
            .status(500)
            .json({
              message:
                err.message
            })
        }

        res.json({
          message:
            "Room deleted"
        })
      }
    )
  }
)

module.exports = router