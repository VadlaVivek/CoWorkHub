const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const db = require("../database/db")

// REGISTER
exports.register = async (req, res) => {

  try {

    const {
      name,
      email,
      password,
      role
    } = req.body

    if (
      !name ||
      !email ||
      !password ||
      !role
    ) {
      return res.status(400).json({
        message: "All fields required"
      })
    }

    const hashedPassword =
      await bcrypt.hash(password, 10)

    const query = `
      INSERT INTO users
      (
        name,
        email,
        password,
        role
      )
      VALUES (?, ?, ?, ?)
    `

    db.run(
      query,
      [
        name,
        email,
        hashedPassword,
        role
      ],
      function(err) {

        if (err) {
          return res.status(400).json({
            message: err.message
          })
        }

        res.status(201).json({
          message: "User registered",
          userId: this.lastID
        })
      }
    )

  } catch (error) {

    res.status(500).json({
      message: error.message
    })
  }
}

// LOGIN
exports.login = (req, res) => {

  const {
    email,
    password
  } = req.body

  db.get(
    `
      SELECT * FROM users
      WHERE email = ?
    `,
    [email],
    async (err, user) => {

      if (err) {
        return res.status(500).json(err)
      }

      if (!user) {
        return res.status(404).json({
          message: "User not found"
        })
      }

      const isMatch =
        await bcrypt.compare(
          password,
          user.password
        )

      if (!isMatch) {
        return res.status(401).json({
          message: "Invalid password"
        })
      }

      const token =
        jwt.sign(
          {
            id: user.id,
            role: user.role
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1d"
          }
        )

      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          role: user.role
        }
      })
    }
  )
}