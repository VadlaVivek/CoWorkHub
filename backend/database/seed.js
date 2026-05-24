
const bcrypt = require("bcryptjs")
const db = require("./db")

async function seedDatabase() {

  const adminPass =
    await bcrypt.hash("admin123", 10)

  const staffPass =
    await bcrypt.hash("staff123", 10)

  const memberPass =
    await bcrypt.hash("member123", 10)

  db.serialize(() => {

    // USERS
    db.run(`
      INSERT OR IGNORE INTO users
      (name,email,password,role)
      VALUES
      (
        'Admin User',
        'admin@test.com',
        '${adminPass}',
        'admin'
      )
    `)

    db.run(`
      INSERT OR IGNORE INTO users
      (name,email,password,role)
      VALUES
      (
        'Staff User',
        'staff@test.com',
        '${staffPass}',
        'staff'
      )
    `)

    db.run(`
      INSERT OR IGNORE INTO users
      (name,email,password,role)
      VALUES
      (
        'Member User',
        'member@test.com',
        '${memberPass}',
        'member'
      )
    `)

    // WORKSPACE
    db.run(`
      INSERT OR IGNORE INTO workspaces
      (
        name,
        location,
        floor,
        pricing
      )
      VALUES
      (
        'Tech Hub',
        'Hyderabad',
        2,
        500
      )
    `)

    // DESKS
    db.run(`
      INSERT OR IGNORE INTO desks
      (
        workspace_id,
        desk_name,
        seating_type
      )
      VALUES
      (
        1,
        'Desk A1',
        'Window'
      )
    `)

    db.run(`
      INSERT OR IGNORE INTO desks
      (
        workspace_id,
        desk_name,
        seating_type
      )
      VALUES
      (
        1,
        'Desk A2',
        'Private'
      )
    `)

    // ROOM
    db.run(`
      INSERT OR IGNORE INTO meeting_rooms
      (
        workspace_id,
        room_name,
        capacity
      )
      VALUES
      (
        1,
        'Room Alpha',
        8
      )
    `)

    console.log("Seed Data Added")
  })
}

seedDatabase()