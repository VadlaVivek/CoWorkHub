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
        <h1 >CoWorkHub</h1>
        <p>Reserve your workspace anytime</p>
      </div>
      <form
        className="login-card"
        onSubmit={handleSubmit}
      >
        <h2>Welcome to CoWorkHub</h2>

        <p className="login-subtitle">
          Please login to continue
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

        
      </form>
    </div>
  )
}

export default Login