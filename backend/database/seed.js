const bcrypt = require("bcryptjs")
const db = require("./db")

async function seed() {

  const adminPassword =
    await bcrypt.hash(
      "admin123",
      10
    )

  const memberPassword =
    await bcrypt.hash(
      "member123",
      10
    )

  const staffPassword =
    await bcrypt.hash(
      "staff123",
      10
    )

  db.serialize(() => {

    db.run(`
      CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT
      )
    `)

    db.run(`
      INSERT OR IGNORE INTO users
      (email,password,role)
      VALUES
      (
        'admin@test.com',
        ?,
        'admin'
      )
    `,
    [adminPassword])

    db.run(`
      INSERT OR IGNORE INTO users
      (email,password,role)
      VALUES
      (
        'member@test.com',
        ?,
        'member'
      )
    `,
    [memberPassword])

    db.run(`
      INSERT OR IGNORE INTO users
      (email,password,role)
      VALUES
      (
        'staff@test.com',
        ?,
        'staff'
      )
    `,
    [staffPassword])

    console.log(
      "Users seeded"
    )
  })
}

module.exports = seed