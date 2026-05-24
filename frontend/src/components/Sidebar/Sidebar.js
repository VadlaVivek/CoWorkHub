import "./Sidebar.css"

import {
  Link
} from "react-router-dom"

import {
  useAuth
} from "../../context/AuthContext"

function Sidebar() {

  const { user } =
    useAuth()

  return (
    <div className="sidebar">

      <h3>
        Dashboard
      </h3>

      {/* WORKSPACES */}

      <Link to="/">
        Workspaces
      </Link>

      {/* MEMBER */}

      {user?.role ===
        "member" && (

        <Link
          to="/reservations"
        >
          Reservations
        </Link>
      )}

      {/* ADMIN */}

      {user?.role ===
        "admin" && (
        <>

          <Link
            to="/manage"
          >
            Manage
          </Link>

          <Link
            to="/analytics"
          >
            Analytics
          </Link>

        </>
      )}

      {/* STAFF */}

      {(user?.role ===
        "staff" ||
        user?.role ===
        "admin") && (

        <Link
          to="/staff"
        >
          Staff Dashboard
        </Link>
      )}

    </div>
  )
}

export default Sidebar