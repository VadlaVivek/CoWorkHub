import {
  useEffect,
  useState
} from "react"

import {
  PieChart,
  Pie,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer
} from "recharts"

import api
from "../../api/axios"

import DashboardLayout
from "../../layouts/DashboardLayout"

import "./AnalyticsDashboard.css"

function AnalyticsDashboard() {

  const [data,
    setData] =
    useState(null)

  useEffect(()=>{

    loadAnalytics()

  },[])

  const loadAnalytics =
    async ()=>{

      const res =
        await api.get(
          "/dashboard/workspace"
        )

      setData(
        res.data
      )
    }

  if(!data){

    return (
      <DashboardLayout>
        Loading...
      </DashboardLayout>
    )
  }

  const barData = [
    {
      name:"Total",
      value:
        data.totalReservations
    },
    {
      name:"Active",
      value:
        data.activeReservations
    },
    {
      name:"Members",
      value:
        data.activeMembers
    }
  ]

  return (
    <DashboardLayout>

      <div
        className="analytics-page"
      >

        <h2>
          Workspace Analytics
        </h2>

        {/* CARDS */}

        <div
          className="analytics-cards"
        >

          <div className="analytics-card">
            <h3>
              Total Reservations
            </h3>
            <p>
              {
                data.totalReservations
              }
            </p>
          </div>

          <div className="analytics-card">
            <h3>
              Active Reservations
            </h3>
            <p>
              {
                data.activeReservations
              }
            </p>
          </div>

          <div className="analytics-card">
            <h3>
              Members
            </h3>
            <p>
              {
                data.activeMembers
              }
            </p>
          </div>

        </div>

        {/* CHARTS */}

        <div
          className="charts-grid"
        >

          {/* PIE */}

          <div
            className="chart-card"
          >

            <h3>
              Reservation Status
            </h3>

            <ResponsiveContainer
              width="100%"
              height={300}
            >

              <PieChart>

                <Pie
                  data={
                    data.statusData
                  }
                  dataKey="value"
                  nameKey="status"
                  outerRadius={100}
                />

                <Tooltip/>

              </PieChart>

            </ResponsiveContainer>

          </div>

          {/* BAR */}

          <div
            className="chart-card"
          >

            <h3>
              Occupancy Overview
            </h3>

            <ResponsiveContainer
              width="100%"
              height={300}
            >

              <BarChart
                data={barData}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="name"
                />

                <YAxis/>

                <Tooltip/>

                <Bar
                  dataKey="value"
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

    </DashboardLayout>
  )
}

export default AnalyticsDashboard