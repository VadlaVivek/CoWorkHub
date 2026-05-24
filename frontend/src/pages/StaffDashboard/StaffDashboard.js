import {
  useEffect,
  useState
} from "react"

import api
from "../../api/axios"

import DashboardLayout
from "../../layouts/DashboardLayout"

import "./StaffDashboard.css"

function StaffDashboard() {

  const [metrics,
    setMetrics] =
    useState({})

  const [reservations,
    setReservations] =
    useState([])

  useEffect(()=>{

    loadDashboard()
    loadReservations()

  },[])

  const loadDashboard =
    async ()=>{

      const res =
        await api.get(
          "/dashboard/workspace"
        )

      setMetrics(
        res.data
      )
    }

  const loadReservations =
    async ()=>{

      const res =
        await api.get(
          "/reservations"
        )

      setReservations(
        res.data
      )
    }

  const updateStatus =
    async (
      id,
      status
    )=>{

      await api.put(
        `/reservations/${id}/status`,
        {status}
      )

      loadReservations()
      loadDashboard()
    }

  return (
    <DashboardLayout>

      <div
        className="staff-page"
      >

        <h2>
          Staff Dashboard
        </h2>

        <div
          className="metric-grid"
        >

          <div className="metric-card">
            <h3>
              Total
            </h3>
            <p>
              {
                metrics.totalReservations
              }
            </p>
          </div>

          <div className="metric-card">
            <h3>
              Active
            </h3>
            <p>
              {
                metrics.activeReservations
              }
            </p>
          </div>

          <div className="metric-card">
            <h3>
              Members
            </h3>
            <p>
              {
                metrics.activeMembers
              }
            </p>
          </div>

        </div>

        <table
          className="staff-table"
        >

          <thead>
            <tr>
              <th>
                Member
              </th>
              <th>
                Resource
              </th>
              <th>
                Status
              </th>
              <th>
                Update
              </th>
            </tr>
          </thead>

          <tbody>

            {reservations.map(
              item => (

                <tr className="table-row"
                  key={item.id}
                >

                  <td>
                    {
                      item.member_name
                    }
                  </td>

                  <td>
                    {
                      item.desk_name
                      ||
                      item.room_name
                    }
                  </td>

                  <td>
                    {item.status}
                  </td>

                  <td>

                    <select
                      value={
                        item.status
                      }
                      onChange={
                        e =>
                        updateStatus(
                          item.id,
                          e.target.value
                        )
                      }
                    >

                      <option>
                        Reserved
                      </option>

                      <option>
                        Checked-In
                      </option>

                      <option>
                        Active
                      </option>

                      <option>
                        Completed
                      </option>

                      <option>
                        Cancelled
                      </option>

                    </select>

                  </td>

                </tr>
              )
            )}

          </tbody>

        </table>

      </div>

    </DashboardLayout>
  )
}

export default StaffDashboard