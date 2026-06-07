import {
  useState
} from "react"

import {
  useEffect
} from "react"

import {
  useNavigate
} from "react-router-dom"

import api
from "../../api/axios"

import {
  useAuth
} from "../../context/AuthContext"

import "./Login.css"

function Login() {

  useEffect(() => {

  alert(
    `Demo Login Credentials

    Admin Login
    Email: admin@test.com
    Password: admin123

    Member Login
    Email: member@test.com
    Password: member123

    Staff Login
    Email: staff@test.com
    Password: staff123`
      )

    }, [])

  const navigate =
    useNavigate()

  const { login } =
    useAuth()

  const [form,
    setForm] =
    useState({
      email:"",
      password:""
    })

  const [error,
    setError] =
    useState("")

  const handleChange =
    e => {

      setForm({
        ...form,
        [e.target.name]:
          e.target.value
      })
    }

  const handleSubmit =
    async e => {

      e.preventDefault()

      try {

        const res =
          await api.post(
            "/auth/login",
            form
          )

        login(
          res.data.user,
          res.data.token
        )

        navigate("/")

      } catch (err) {

        setError(
          err.response?.data
          ?.message ||
          "Login failed"
        )
      }
    }

  return (
    <div
      className="login-page"
    >

      <div className="title">
        <h1>CoWorkHub</h1>
        <p>Reserve your Space</p>
      </div>
      <form
        className="login-card"
        onSubmit={handleSubmit}
      >
        <h2>CoWorkHub</h2>

        <p className="login-subtitle">
          Reserve your workspace anytime
        </p>

        {error && (
          <p className="error">
            {error}
          </p>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <button type="submit">
          Login
        </button>

        <div className="demo-box">
          <h4>Demo Credentials</h4>

          <p>
            <strong>Admin</strong><br />
            admin@test.com<br />
            admin123
          </p>

          <p>
            <strong>Member</strong><br />
            member@test.com<br />
            member123
          </p>

          <p>
            <strong>Staff</strong><br />
            staff@test.com<br />
            staff123
          </p>
        </div>
      </form>
    </div>
  )
}

export default Login