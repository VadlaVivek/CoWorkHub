const bcrypt = require("bcryptjs")
const db = require("./db")

async function seed() {

  const adminPassword =
    await bcrypt.hash("admin123", 10)

  const memberPassword =
    await bcrypt.hash("member123", 10)

  const staffPassword =
    await bcrypt.hash("staff123", 10)

  db.serialize(() => {

    // USERS

    db.run(`
      CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT
      )
    `)

    // WORKSPACES

    db.run(`
      CREATE TABLE IF NOT EXISTS workspaces(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        location TEXT,
        floor INTEGER,
        pricing INTEGER
      )
    `)

    // DESKS

    db.run(`
      CREATE TABLE IF NOT EXISTS desks(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        workspace_id INTEGER,
        name TEXT,
        type TEXT,
        status TEXT DEFAULT 'available',
        FOREIGN KEY(workspace_id)
        REFERENCES workspaces(id)
      )
    `)

    // ROOMS

    db.run(`
      CREATE TABLE IF NOT EXISTS rooms(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        workspace_id INTEGER,
        name TEXT,
        capacity INTEGER,
        status TEXT DEFAULT 'available',
        FOREIGN KEY(workspace_id)
        REFERENCES workspaces(id)
      )
    `)

    // RESERVATIONS

    db.run(`
      CREATE TABLE IF NOT EXISTS reservations(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        workspace_id INTEGER,
        desk_id INTEGER,
        room_id INTEGER,
        reservation_date TEXT,
        duration INTEGER,
        purpose TEXT,
        attendee_count INTEGER,
        status TEXT DEFAULT 'Reserved',

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
      CREATE TABLE IF NOT EXISTS reservation_status_logs(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        reservation_id INTEGER,
        status TEXT,
        updated_by INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // ADMIN

    db.run(
      `
      INSERT OR IGNORE INTO users
      (email,password,role)
      VALUES
      ('admin@test.com', ?, 'admin')
      `,
      [adminPassword]
    )

    // MEMBER

    db.run(
      `
      INSERT OR IGNORE INTO users
      (email,password,role)
      VALUES
      ('member@test.com', ?, 'member')
      `,
      [memberPassword]
    )

    // STAFF

    db.run(
      `
      INSERT OR IGNORE INTO users
      (email,password,role)
      VALUES
      ('staff@test.com', ?, 'staff')
      `,
      [staffPassword]
    )

    // insert sample workspace

    db.run(`
    INSERT OR IGNORE INTO workspaces
    (id,name,location,floor,pricing)
    VALUES
    (
      1,
      'Innovative Hub',
      'S.V Towers, Hi-Tech City',
      8,
      500
    )`);

    // insert sample desks

    db.run(`
    INSERT OR IGNORE INTO desks
    (id,workspace_id,name,type,status)
    VALUES
    (
      1,
      1,
      'V1',
      'Window',
      'available'
    )
    `);

    // insert sample rooms

    db.run(`
    INSERT OR IGNORE INTO rooms
    (id,workspace_id,name,capacity,status)
    VALUES
    (
      1,
      1,
      'Seminar',
      30,
      'available'
    )
  `);

  // DEMO RESERVATIONS

    db.run(`
    INSERT OR IGNORE INTO reservations
    (
      id,
      user_id,
      workspace_id,
      desk_id,
      room_id,
      reservation_date,
      duration,
      purpose,
      attendee_count,
      status
    )
    VALUES
    (
      1,
      2,
      1,
      1,
      NULL,
      '2026-06-15',
      4,
      'Development Work',
      1,
      'Reserved'
    )
    `);

    db.run(`
    INSERT OR IGNORE INTO reservations
    (
      id,
      user_id,
      workspace_id,
      desk_id,
      room_id,
      reservation_date,
      duration,
      purpose,
      attendee_count,
      status
    )
    VALUES
    (
      2,
      2,
      1,
      NULL,
      1,
      '2026-06-20',
      2,
      'Team Seminar',
      20,
      'Approved'
    )
    `);

    db.run(`
    INSERT OR IGNORE INTO reservations
    (
      id,
      user_id,
      workspace_id,
      desk_id,
      room_id,
      reservation_date,
      duration,
      purpose,
      attendee_count,
      status
    )
    VALUES
    (
      3,
      2,
      1,
      1,
      NULL,
      '2026-06-25',
      8,
      'Project Sprint',
      1,
      'Completed'
    )
`);

    // STATUS LOGS

    db.run(`
INSERT OR IGNORE INTO reservation_status_logs
(id,reservation_id,status,updated_by)
VALUES
(1,1,'Reserved',1)
`);

db.run(`
INSERT OR IGNORE INTO reservation_status_logs
(id,reservation_id,status,updated_by)
VALUES
(2,2,'Approved',3)
`);

db.run(`
INSERT OR IGNORE INTO reservation_status_logs
(id,reservation_id,status,updated_by)
VALUES
(3,3,'Completed',1)
`);

    console.log("Database seeded")
  })
}


db.all(
  "SELECT name FROM sqlite_master WHERE type='table'",
  [],
  (err, rows) => {
    console.log("TABLES:", rows);
  }
);

db.all("PRAGMA table_info(reservations)", [], (err, rows) => {
  console.log("RESERVATION COLUMNS:", rows);
});



module.exports = seed