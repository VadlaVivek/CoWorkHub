import {
  useEffect,
  useState
} from "react"

import api from "../../api/axios"
import DashboardLayout from "../../layouts/DashboardLayout"

import "./Confirmation.css"

function Confirmation() {

  const [reservations,
    setReservations] =
    useState([])

  const [loading,
    setLoading] =
    useState(true)

  const [page,
    setPage] =
    useState(1)

  const limit = 4

  useEffect(() => {
    loadReservations()
  }, [])

  const loadReservations =
    async () => {

      try {

        const res =
          await api.get(
            "/reservations"
          )

        setReservations(
          res.data
        )

      } catch (err) {

        console.log(err)

      } finally {

        setLoading(false)
      }
    }

  // PAGINATION
  const start =
    (page - 1) * limit

  const paginated =
    reservations.slice(
      start,
      start + limit
    )

  return (
    <DashboardLayout>

      <div
        className="history-page"
      >

        <div className="history-header">

          <h2>
            My Reservations
          </h2>

          <div className="history-count">
            {reservations.length}
            {" "}
            Bookings
          </div>

        </div>

        {loading ? (

          <p>
            Loading...
          </p>

        ) : reservations.length === 0 ? (

          <p>
            No reservations found
          </p>

        ) : (

          <>
            <div
              className="history-grid"
            >

              {paginated.map(
                item => (

                  <div
                    key={item.id}
                    className="history-card"
                  >

                    <h3>
                      {
                        item.desk_name
                        ||
                        item.room_name
                      }
                    </h3>

                    <p>
                      Date:
                      {" "}
                      {
                        item.reservation_date
                      }
                    </p>

                    <p>
                      Duration:
                      {" "}
                      {
                        item.duration
                      }
                      hr
                    </p>

                    <p>
                      Purpose:
                      {" "}
                      {
                        item.purpose
                      }
                    </p>

                    <p
                      className={
                        "status "
                        +
                        item.status
                      }
                    >
                      {
                        item.status
                      }
                    </p>

                  </div>
                )
              )}

            </div>

            {/* PAGINATION */}

            <div className="pagination">

              <button
                disabled={
                  page === 1
                }
                onClick={() =>
                  setPage(
                    page - 1
                  )
                }
              >
                Prev
              </button>

              <span>
                Page {page}
              </span>

              <button
                disabled={
                  start + limit
                  >=
                  reservations.length
                }
                onClick={() =>
                  setPage(
                    page + 1
                  )
                }
              >
                Next
              </button>

            </div>

          </>
        )}

      </div>

    </DashboardLayout>
  )
}

export default Confirmation