const db = require("../database/db")

// CREATE RESERVATION
exports.createReservation = (
  req,
  res
) => {

  const {
    workspace_id,
    desk_id,
    room_id,
    reservation_date,
    duration,
    purpose,
    attendee_count
  } = req.body

  const user_id =
    req.user.id

  if (
    !workspace_id ||
    !reservation_date ||
    !duration
  ) {
    return res.status(400).json({
      message:
        "Required fields missing"
    })
  }

  // CHECK DOUBLE BOOKING
  const checkQuery = `
    SELECT *
    FROM reservations
    WHERE reservation_date = ?
    AND (
      desk_id = ?
      OR room_id = ?
    )
    AND status != 'Cancelled'
  `

  db.get(
    checkQuery,
    [
      reservation_date,
      desk_id,
      room_id
    ],
    (err, existing) => {

      if (err) {
        return res
          .status(500)
          .json(err)
      }

      if (existing) {
        return res
          .status(400)
          .json({
            message:
              "Desk or room already booked"
          })
      }

      // CREATE
      db.run(
        `
        INSERT INTO reservations
        (
          user_id,
          workspace_id,
          desk_id,
          room_id,
          reservation_date,
          duration,
          purpose,
          attendee_count
        )
        VALUES
        (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          user_id,
          workspace_id,
          desk_id,
          room_id,
          reservation_date,
          duration,
          purpose,
          attendee_count
        ],
        function(err) {

            if (err) {
                return res
                .status(500)
                .json(err)
            }

            const reservationId =
                this.lastID

            // STATUS LOG
            db.run(
                `
                INSERT INTO
                reservation_status_logs
                (
                reservation_id,
                status,
                updated_by
                )
                VALUES (?, ?, ?)
                `,
                [
                reservationId,
                "Reserved",
                user_id
                ]
            )

            // IMPORTANT:
            // MARK DESK UNAVAILABLE
            if (desk_id) {

                db.run(
                `
                UPDATE desks
                SET available = 0
                WHERE id = ?
                `,
                [desk_id]
                )
            }

            res.status(201).json({
                message:
                "Reservation created",
                reservationId
            })
            }
      )
    }
  )
}

// GET RESERVATIONS
exports.getReservations =
(req,res)=>{

  let query = `
    SELECT
      r.*,
      u.name AS member_name,
      d.desk_name,
      mr.room_name
    FROM reservations r
    LEFT JOIN users u
      ON r.user_id = u.id
    LEFT JOIN desks d
      ON r.desk_id = d.id
    LEFT JOIN meeting_rooms mr
      ON r.room_id = mr.id
  `

  let params = []

  if (
    req.user.role ===
    "member"
  ) {

    query +=
      ` WHERE r.user_id = ?`

    params.push(
      req.user.id
    )
  }

  db.all(
    query,
    params,
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

// UPDATE STATUS
exports.updateReservationStatus =
(
  req,
  res
) => {

  const {
    status
  } = req.body

  const reservationId =
    req.params.id

  const updatedBy =
    req.user.id

  db.run(
    `
    UPDATE reservations
    SET status = ?
    WHERE id = ?
    `,
    [
      status,
      reservationId
    ],
    function(err) {

      if (err) {
        return res
          .status(500)
          .json(err)
      }

      db.run(
        `
        INSERT INTO
        reservation_status_logs
        (
          reservation_id,
          status,
          updated_by
        )
        VALUES
        (?, ?, ?)
        `,
        [
          reservationId,
          status,
          updatedBy
        ]
      )

      res.json({
        message:
          "Status updated"
      })
    }
  )
}