
const db = require("./db")

db.serialize(() => {

  // USERS
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL
      CHECK(role IN ('admin','staff','member')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // WORKSPACES
  db.run(`
    CREATE TABLE IF NOT EXISTS workspaces (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      floor INTEGER NOT NULL,
      pricing REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // DESKS
  db.run(`
    CREATE TABLE IF NOT EXISTS desks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      workspace_id INTEGER,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      available INTEGER DEFAULT 1,
      FOREIGN KEY(workspace_id)
      REFERENCES workspaces(id)
      ON DELETE CASCADE
    )
  `)

  // MEETING ROOMS
  db.run(`
    CREATE TABLE IF NOT EXISTS rooms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      workspace_id INTEGER,
      name TEXT NOT NULL,
      capacity INTEGER NOT NULL,
      available INTEGER DEFAULT 1,
      FOREIGN KEY(workspace_id)
      REFERENCES workspaces(id)
      ON DELETE CASCADE
    )
  `)

  // RESERVATIONS
  db.run(`
    CREATE TABLE IF NOT EXISTS reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      workspace_id INTEGER,
      desk_id INTEGER,
      room_id INTEGER,
      reservation_date TEXT NOT NULL,
      duration INTEGER NOT NULL,
      purpose TEXT,
      attendee_count INTEGER,
      status TEXT DEFAULT 'Reserved'
      CHECK(
        status IN (
          'Reserved',
          'Checked-In',
          'Active',
          'Completed',
          'Cancelled'
        )
      ),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY(user_id)
      REFERENCES users(id),

      FOREIGN KEY(workspace_id)
      REFERENCES workspaces(id),

      FOREIGN KEY(desk_id)
      REFERENCES desks(id),

      FOREIGN KEY(room_id)
      REFERENCES rooms(id)
    )
  `)

  // STATUS LOGS
  db.run(`
    CREATE TABLE IF NOT EXISTS reservation_status_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reservation_id INTEGER,
      status TEXT NOT NULL,
      updated_by INTEGER,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY(reservation_id)
      REFERENCES reservations(id),

      FOREIGN KEY(updated_by)
      REFERENCES users(id)
    )
  `)

  console.log("Schema Ready")
})

module.exports = db