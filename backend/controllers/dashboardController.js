const db =
require("../database/db")

exports.getDashboardMetrics =
(req,res)=>{

  const metrics={}

  // TOTAL
  db.get(
    `
    SELECT COUNT(*)
    AS totalReservations
    FROM reservations
    `,
    [],
    (err,total)=>{

      if(err){
        return res
          .status(500)
          .json(err)
      }

      metrics.totalReservations =
        total.totalReservations

      // ACTIVE
      db.get(
        `
        SELECT COUNT(*)
        AS activeReservations
        FROM reservations
        WHERE status='Active'
        `,
        [],
        (err,active)=>{

          metrics.activeReservations =
            active.activeReservations

          // MEMBERS
          db.get(
            `
            SELECT COUNT(*)
            AS activeMembers
            FROM users
            WHERE role='member'
            `,
            [],
            (err,members)=>{

              metrics.activeMembers =
                members.activeMembers

              // STATUS BREAKDOWN
              db.all(
                `
                SELECT
                status,
                COUNT(*)
                AS value
                FROM reservations
                GROUP BY status
                `,
                [],
                (err,statuses)=>{

                  metrics.statusData =
                    statuses

                  res.json(
                    metrics
                  )
                }
              )
            }
          )
        }
      )
    }
  )
}