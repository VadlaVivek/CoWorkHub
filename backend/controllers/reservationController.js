const db = require("../database/db")

// CREATE RESERVATION

exports.createReservation = (req, res) => {
  console.log("BODY:", req.body);
  console.log("USER:", req.user);

  const {
    workspace_id,
    desk_id,
    room_id,
    reservation_date,
    duration,
    purpose,
    attendee_count
  } = req.body;

  if (!req.user) {
    return res.status(401).json({
      message: "User not authenticated"
    });
  }

  const user_id = req.user.id;

  if (!workspace_id || !reservation_date || !duration) {
    return res.status(400).json({
      message: "Required fields missing"
    });
  }

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
      attendee_count,
      status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      user_id,
      workspace_id,
      desk_id || null,
      room_id || null,
      reservation_date,
      duration,
      purpose || "",
      attendee_count || 1,
      "Reserved"
    ],
    function (err) {
      if (err) {
        console.log("INSERT ERROR:", err);
        return res.status(500).json({
          message: err.message
        });
      }

      if (desk_id) {
        db.run(
          `
          UPDATE desks
          SET status = 'reserved'
          WHERE id = ?
          `,
          [desk_id]
        );
      }

      if (room_id) {
        db.run(
          `
          UPDATE rooms
          SET status = 'reserved'
          WHERE id = ?
          `,
          [room_id]
        );
      }

      console.log("Inserted reservation:", this.lastID);

      res.status(201).json({
        message: "Reservation created",
        reservationId: this.lastID
      });
    }
  );
};

// GET RESERVATIONS
exports.getReservations = (req, res) => {
  let query = `
    SELECT
      r.*,
      d.name AS desk_name,
      rm.name AS room_name
    FROM reservations r
    LEFT JOIN desks d
      ON r.desk_id = d.id
    LEFT JOIN rooms rm
      ON r.room_id = rm.id
  `;

  let params = [];

  if (req.user.role === "member") {
    query += ` WHERE r.user_id = ?`;
    params.push(req.user.id);
  }

  console.log("QUERY:", query);
  console.log("PARAMS:", params);

  db.all(query, params, (err, rows) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        message: err.message
      });
    }

    console.log("Reservations found:", rows);

    res.json(rows);
  });
};

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