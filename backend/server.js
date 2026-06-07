const db = require("../database/db");

// =========================
// CREATE RESERVATION
// =========================

exports.createReservation = (req, res) => {

  const {
    workspace_id,
    desk_id,
    room_id,
    reservation_date,
    duration,
    purpose,
    attendee_count
  } = req.body;

  const user_id = req.user.id;

  if (
    !workspace_id ||
    !reservation_date ||
    !duration
  ) {
    return res.status(400).json({
      message: "Required fields missing"
    });
  }

  const checkQuery = `
    SELECT *
    FROM reservations
    WHERE reservation_date = ?
    AND (
      desk_id = ?
      OR room_id = ?
    )
    AND status != 'Cancelled'
  `;

  db.get(
    checkQuery,
    [
      reservation_date,
      desk_id || null,
      room_id || null
    ],
    (err, existing) => {

      if (err) {
        console.log(err);

        return res.status(500).json({
          message: err.message
        });
      }

      if (existing) {
        return res.status(400).json({
          message: "Desk or room already booked"
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
          attendee_count
        )
        VALUES
        (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          user_id,
          workspace_id,
          desk_id || null,
          room_id || null,
          reservation_date,
          duration,
          purpose || "",
          attendee_count || 1
        ],
        function (err) {

          if (err) {

            console.log(err);

            return res.status(500).json({
              message: err.message
            });
          }

          console.log(
            "Reservation Created:",
            this.lastID
          );

          res.status(201).json({
            message: "Reservation created",
            reservationId: this.lastID
          });
        }
      );
    }
  );
};

// =========================
// GET RESERVATIONS
// =========================

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

  const params = [];

  if (req.user.role === "member") {

    query += `
      WHERE r.user_id = ?
    `;

    params.push(req.user.id);
  }

  query += `
    ORDER BY r.id DESC
  `;

  db.all(
    query,
    params,
    (err, rows) => {

      if (err) {

        console.log(err);

        return res.status(500).json({
          message: err.message
        });
      }

      res.json(rows);
    }
  );
};

// =========================
// UPDATE STATUS
// =========================

exports.updateReservationStatus = (
  req,
  res
) => {

  const { status } = req.body;

  const reservationId =
    req.params.id;

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
    function (err) {

      if (err) {

        console.log(err);

        return res.status(500).json({
          message: err.message
        });
      }

      res.json({
        message: "Status updated"
      });
    }
  );
};