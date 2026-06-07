const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")

dotenv.config()

const app = express()

const db = require("./database/db")
const seed = require("./database/seed")

// Routes
const authRoutes =
require("./routes/authRoutes")

const workspaceRoutes =
require("./routes/workspaceRoutes")

const reservationRoutes =
require("./routes/reservationRoutes")

const dashboardRoutes =
require("./routes/dashboardRoutes")

// Middleware
app.use(express.json())

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://coworkhub-vebg.onrender.com"
    ],
    credentials: true
  })
)

// Root Route
app.get("/", (req, res) => {
  res.json({
    message: "API Running"
  })
})

// Test Users Route
app.get(
  "/test-users",
  (req, res) => {

    db.all(
      `
      SELECT
      id,
      email,
      role
      FROM users
      `,
      [],
      (err, rows) => {

        if (err) {
          return res
            .status(500)
            .json(err)
        }

        res.json(rows)
      }
    )
  }
)

// API Routes
app.use(
  "/api/auth",
  authRoutes
)

app.use(
  "/api/workspaces",
  workspaceRoutes
)

app.use(
  "/api/reservations",
  reservationRoutes
)

app.use(
  "/api/dashboard",
  dashboardRoutes
)

// Start Server After DB Ready
const PORT =
  process.env.PORT
  || 5000

db.serialize(() => {

  console.log(
    "Initializing DB..."
  )

  seed()

  app.listen(
    PORT,
    () => {

      console.log(
        `Server running on ${PORT}`
      )
    }
  )
})

app.get("/debug-reservations", (req, res) => {

  db.all(
    "SELECT * FROM reservations",
    [],
    (err, rows) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.json(rows);
    }
  );

});