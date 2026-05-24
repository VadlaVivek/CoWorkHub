import "./Navbar.css"

import {
  useAuth
} from "../../context/AuthContext"

function Navbar() {

  const {
    user,
    logout
  } = useAuth()

  return (
    <div className="navbar">

      <h2>
        CoWorkHub
      </h2>

      <div
        className="nav-right"
      >

        <span>
          {user?.name}
        </span>

        <button
          onClick={logout}
        >
          Logout
        </button>

      </div>
    </div>
  )
}

export default Navbar