
const sqlite3 = require("sqlite3").verbose()
const path = require("path")

const dbPath = path.join(
  __dirname,
  "workspace.sqlite"
)

const db = new sqlite3.Database(
  dbPath,
  (err) => {
    if (err) {
      console.log("Database Error:", err.message)
    } else {
      console.log("SQLite Connected")
    }
  }
)

module.exports = db