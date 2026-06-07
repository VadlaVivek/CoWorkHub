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
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
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

    console.log("Database seeded")
  })
}

module.exports = seed