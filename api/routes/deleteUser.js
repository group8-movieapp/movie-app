import { pool } from './db.js'

app.delete('/users/:id', (req, res) => {
  const { id } = req.params
  console.log(`Deleting user with id: ${id}`)
  pool.query('DELETE FROM users WHERE id = $1', [id], (err, result) => {
    if (err) {
      console.error(err.message)
      return res.status(500).json({ error: 'Internal server error' })
    }
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' })
    }
    return res.status(200).json({ id })
  })
})