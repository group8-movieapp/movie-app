import { pool } from './db.js'

const addFavorite = async (userId, movieId) => {
  const result = await pool.query(
    `INSERT INTO favorites (user_id, movie_id)
     VALUES ($1, $2)
     RETURNING id, user_id, movie_id`,
    [userId, movieId]
  )

  return result.rows[0]
}

const getFavoritesByUser = async (userId) => {
  const result = await pool.query(
    `SELECT id, user_id, movie_id
     FROM favorites
     WHERE user_id = $1
     ORDER BY id DESC`,
    [userId]
  )

  return result.rows
}

const deleteFavorite = async (userId, movieId) => {
  const result = await pool.query(
    `DELETE FROM favorites
     WHERE user_id = $1 AND movie_id = $2
     RETURNING id, user_id, movie_id`,
    [userId, movieId]
  )

  return result.rows[0]
}

export {
  addFavorite,
  getFavoritesByUser,
  deleteFavorite
}