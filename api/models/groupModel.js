import { pool } from './db.js'

// 1. Luo uusi ryhmä ja lisää luoja automaattisesti jäseneksi
const createGroup = async (name, userId) => {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    
    // MUUTETTU: user_id -> owner_id
    const groupResult = await client.query(
      `INSERT INTO groups (name, owner_id) VALUES ($1, $2) RETURNING id, name, owner_id`,
      [name, userId]
    )
    const newGroup = groupResult.rows[0]

    // Lisätään luoja heti jäseneksi group_members-tauluun
    await client.query(
      `INSERT INTO group_members (group_id, user_id) VALUES ($1, $2)`,
      [newGroup.id, userId]
    )

    await client.query('COMMIT')
    return newGroup
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
  }
}

// 2. Hae kaikki ryhmät (näkyy kaikille käyttäjille)
const getAllGroups = async () => {
  // MUUTETTU: user_id -> owner_id
  const result = await pool.query(`SELECT id, name, owner_id FROM groups ORDER BY id DESC`)
  return result.rows
}

// 3. Hae yksittäisen ryhmän tiedot ID:n perusteella
const getGroupById = async (groupId) => {
  // MUUTETTU: user_id -> owner_id
  const result = await pool.query(`SELECT id, name, owner_id FROM groups WHERE id = $1`, [groupId])
  return result.rows[0]
}

// 4. Tarkista, kuuluuko käyttäjä ryhmään (jäsenyystarkistus)
const isGroupMember = async (groupId, userId) => {
  const result = await pool.query(
    `SELECT * FROM group_members WHERE group_id = $1 AND user_id = $2`,
    [groupId, userId]
  )
  return result.rows.length > 0
}

// 5. Poista ryhmä (varmistetaan, että pyytäjä on ryhmän omistaja eli owner_id)
const deleteGroup = async (groupId, userId) => {
  // MUUTETTU: user_id -> owner_id
  const result = await pool.query(
    `DELETE FROM groups WHERE id = $1 AND owner_id = $2 RETURNING id`,
    [groupId, userId]
  )
  return result.rows[0]
}

export {
  createGroup,
  getAllGroups,
  getGroupById,
  isGroupMember,
  deleteGroup
}