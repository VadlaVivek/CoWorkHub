const bcrypt = require("bcryptjs")
const db = require("./db")

async function seed() {

  const adminPassword =
    await bcrypt.hash("admin123",10)

  const memberPassword =
    await bcrypt.hash("member123",10)

  const staffPassword =
    await bcrypt.hash("staff123",10)

  db.serialize(()=>{

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
        status TEXT DEFAULT 'available'
      )
    `)

    // ROOMS
    db.run(`
      CREATE TABLE IF NOT EXISTS rooms(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        workspace_id INTEGER,
        name TEXT,
        capacity INTEGER,
        status TEXT DEFAULT 'available'
      )
    `)

    // RESERVATIONS
    db.run(`
      CREATE TABLE IF NOT EXISTS reservations(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        desk_id INTEGER,
        room_id INTEGER,
        date TEXT,
        duration TEXT,
        purpose TEXT,
        status TEXT DEFAULT 'Reserved'
      )
    `)

    // USERS SEED
    db.run(
      `
      INSERT OR IGNORE INTO users
      (email,password,role)
      VALUES
      ('admin@test.com',?,'admin')
      `,
      [adminPassword]
    )

    db.run(
      `
      INSERT OR IGNORE INTO users
      (email,password,role)
      VALUES
      ('member@test.com',?,'member')
      `,
      [memberPassword]
    )

    db.run(
      `
      INSERT OR IGNORE INTO users
      (email,password,role)
      VALUES
      ('staff@test.com',?,'staff')
      `,
      [staffPassword]
    )

    console.log(
      "Database seeded"
    )
  })
}

module.exports = seed