import { pool } from './db.js'

const createUser = async (username, email, password) => {
  const result = await pool.query(
    `INSERT INTO users (username, email, password)
     VALUES ($1, $2, $3)
     RETURNING id, username, email`,
    [username, email, password]
  )

  return result.rows[0]
}

const findUserByEmail = async (email) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  )

  return result.rows[0]
}

export { createUser, findUserByEmail }