const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")

dotenv.config()

require("./database/db")
require("./database/schema")


const testRoutes =
  require("./routes/testRoutes")

const authRoutes =
  require("./routes/authRoutes")

const workspaceRoutes =
  require("./routes/workspaceRoutes")

const reservationRoutes =
  require("./routes/reservationRoutes")

const dashboardRoutes =
require("./routes/dashboardRoutes")

const app = express()

app.use(cors())
app.use(express.json())

app.use(
  "/api/dashboard",
  dashboardRoutes
)

app.use(
  "/api/reservations",
  reservationRoutes
)

app.use(
  "/api/workspaces",
  workspaceRoutes
)

app.use(
  "/api/auth",
  authRoutes
)

app.use(
  "/api/test",
  testRoutes
)

app.get("/", (req, res) => {
  res.json({
    message:
      "API Running"
  })
})

const PORT =
  process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(
    `Server running on ${PORT}`
  )
})

const db =
require("./database/db")

app.get(
"/test-users",
(req,res)=>{

  db.all(
    "SELECT id,email,role FROM users",
    [],
    (err,rows)=>{

      if(err){
        return res.status(500)
        .json(err)
      }

      res.json(rows)
    }
  )
})