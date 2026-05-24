const db = require("../database/db")

// CREATE WORKSPACE
exports.createWorkspace = (
  req,
  res
) => {

  const {
    name,
    location,
    floor,
    pricing
  } = req.body

  if (
    !name ||
    !location ||
    !floor ||
    !pricing
  ) {
    return res.status(400).json({
      message:
        "All workspace fields required"
    })
  }

  db.run(
    `
    INSERT INTO workspaces
    (
      name,
      location,
      floor,
      pricing
    )
    VALUES (?, ?, ?, ?)
    `,
    [
      name,
      location,
      floor,
      pricing
    ],
    function(err){

      if(err){
        return res
          .status(500)
          .json({
            message:
              err.message
          })
      }

      res.status(201).json({
        message:
          "Workspace created",
        id:this.lastID
      })
    }
  )
}

// CREATE DESK
exports.createDesk = (
  req,
  res
) => {

  const {
    workspace_id,
    desk_name,
    seating_type
  } = req.body

  // VALIDATION
  if (
    !workspace_id ||
    !desk_name ||
    !seating_type
  ) {
    return res.status(400).json({
      message:
        "All desk fields required"
    })
  }

  db.run(
    `
    INSERT INTO desks
    (
      workspace_id,
      desk_name,
      seating_type
    )
    VALUES (?, ?, ?)
    `,
    [
      workspace_id,
      desk_name,
      seating_type
    ],
    function(err){

      if(err){
        return res
          .status(500)
          .json({
            message:
              err.message
          })
      }

      res.status(201).json({
        message:
          "Desk created",
        id:this.lastID
      })
    }
  )
}

// CREATE ROOM
exports.createMeetingRoom = (
  req,
  res
) => {

  const {
    workspace_id,
    room_name,
    capacity
  } = req.body

  if (
    !workspace_id ||
    !room_name ||
    !capacity
  ) {
    return res.status(400).json({
      message:
        "All room fields required"
    })
  }

  db.run(
    `
    INSERT INTO meeting_rooms
    (
      workspace_id,
      room_name,
      capacity
    )
    VALUES (?, ?, ?)
    `,
    [
      workspace_id,
      room_name,
      capacity
    ],
    function(err){

      if(err){
        return res
          .status(500)
          .json({
            message:
              err.message
          })
      }

      res.status(201).json({
        message:
          "Room created",
        id:this.lastID
      })
    }
  )
}

// GET WORKSPACES
exports.getWorkspaces = (
  req,
  res
) => {

  db.all(
    `
    SELECT *
    FROM workspaces
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

// DESK AVAILABILITY
exports.getDeskAvailability = (
  req,
  res
) => {

  const {
    workspace_id
  } = req.query

  db.all(
    `
    SELECT *
    FROM desks
    WHERE workspace_id = ?
    AND available = 1
    `,
    [workspace_id],
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

// ROOM AVAILABILITY
exports.getRooms =
(req,res)=>{

  db.all(
    `
    SELECT *
    FROM meeting_rooms
    `,
    [],
    (err,rows)=>{

      if(err){
        return res
          .status(500)
          .json(err)
      }

      res.json(rows)
    }
  )
}

// Delete workspace, desks, rooms
exports.deleteWorkspace =
(req,res)=>{

  const id =
    req.params.id

  db.run(
    `
    DELETE FROM workspaces
    WHERE id=?
    `,
    [id],
    function(err){

      if(err){
        return res
          .status(500)
          .json(err)
      }

      res.json({
        message:
          "Workspace deleted"
      })
    }
  )
}

// Delete Desk
exports.deleteDesk =
(req,res)=>{

  db.run(
    `
    DELETE FROM desks
    WHERE id=?
    `,
    [req.params.id],
    function(err){

      if(err){
        return res
          .status(500)
          .json(err)
      }

      res.json({
        message:
          "Desk deleted"
      })
    }
  )
}

// Delete Room
exports.deleteRoom =
(req,res)=>{

  db.run(
    `
    DELETE FROM meeting_rooms
    WHERE id=?
    `,
    [req.params.id],
    function(err){

      if(err){
        return res
          .status(500)
          .json(err)
      }

      res.json({
        message:
          "Room deleted"
      })
    }
  )
}