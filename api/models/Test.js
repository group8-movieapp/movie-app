import { pool } from './db.js'

const getAllTests = async () => {
  const result = await pool.query('SELECT * FROM user')
  return result
}

export { getAllTests }