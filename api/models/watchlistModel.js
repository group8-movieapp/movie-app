import { pool } from './db.js'

const getUserWatchlist = async (userId) => {
  const result = await pool.query(
    `SELECT id, user_id, movie_id
     FROM watchlist
     WHERE user_id = $1
     ORDER BY id DESC`,
    [userId]
  )
  return result.rows
}

const addWatchlist = async (userId, movieId) => {
  const result = await pool.query(
    `INSERT INTO watchlist (user_id, movie_id)
     VALUES ($1, $2)
     RETURNING id, user_id, movie_id`,
    [userId, movieId]
  )
  return result.rows[0]
}

const removeWatchlist = async (userId, movieId) => {
  const result = await pool.query(
    `DELETE FROM watchlist
     WHERE user_id = $1 AND movie_id = $2
     RETURNING id, user_id, movie_id`,
    [userId, movieId]
  )
  return result.rows[0]
}

export {
  getUserWatchlist,
  addWatchlist,
  removeWatchlist
}