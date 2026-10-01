import { pool } from './db.js'

// 1. Luo uusi ryhmä ja lisää luoja automaattisesti hyväksyttynä jäseneksi
const createGroup = async (name, userId) => {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    
    const groupResult = await client.query(
      `INSERT INTO groups (name, owner_id) VALUES ($1, $2) RETURNING id, name, owner_id`,
      [name, userId]
    )
    const newGroup = groupResult.rows[0]

    await client.query(
      `INSERT INTO group_members (group_id, user_id, status) VALUES ($1, $2, 'accepted')`,
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

// 2. Hae kaikki ryhmät
const getAllGroups = async () => {
  const result = await pool.query(`SELECT id, name, owner_id FROM groups ORDER BY id DESC`)
  return result.rows
}

// 3. Hae yksittäisen ryhmän tiedot ID:n perusteella
const getGroupById = async (groupId) => {
  const result = await pool.query(`SELECT id, name, owner_id FROM groups WHERE id = $1`, [groupId])
  return result.rows[0]
}

// 4. Tarkista, kuuluuko käyttäjä ryhmään (vain hyväksytyt jäsenet)
const isGroupMember = async (groupId, userId) => {
  const result = await pool.query(
    `SELECT * FROM group_members WHERE group_id = $1 AND user_id = $2 AND status = 'accepted'`,
    [groupId, userId]
  )
  return result.rows.length > 0
}

// 5. Hae VAIN hyväksytyt jäsenet ryhmäsivulle
const getAcceptedMembers = async (groupId) => {
  const result = await pool.query(
    `SELECT u.id, u.username 
     FROM group_members gm
     JOIN users u ON gm.user_id = u.id
     WHERE gm.group_id = $1 AND gm.status = 'accepted'`,
    [groupId]
  )
  return result.rows
}

// 6. Lähetä liittymispyyntö ryhmään (status = 'pending')
const requestToJoin = async (groupId, userId) => {
  const result = await pool.query(
    `INSERT INTO group_members (group_id, user_id, status) 
     VALUES ($1, $2, 'pending') 
     RETURNING *`,
    [groupId, userId]
  )
  return result.rows[0]
}

// 7. Hae ryhmän odottavat pyynnöt (omistajalle)
const getPendingRequests = async (groupId) => {
  const result = await pool.query(
    `SELECT gm.user_id, u.username, gm.group_id, gm.status 
     FROM group_members gm
     JOIN users u ON gm.user_id = u.id
     WHERE gm.group_id = $1 AND gm.status = 'pending'`,
    [groupId]
  )
  return result.rows
}

// 8. Hyväksy pyyntö (muutetaan status='accepted')
const acceptRequest = async (groupId, userId) => {
  const result = await pool.query(
    `UPDATE group_members 
     SET status = 'accepted' 
     WHERE group_id = $1 AND user_id = $2 AND status = 'pending'
     RETURNING *`,
    [groupId, userId]
  )
  return result.rows[0]
}

// 9. Poista jäsen, hylkää pyyntö tai poistu ryhmästä
const removeGroupMember = async (groupId, userId) => {
  await pool.query(
    `DELETE FROM group_members 
     WHERE group_id = $1 AND user_id = $2`,
    [groupId, userId]
  )
  return { success: true }
}

// 10. Poista ryhmä kokonaan
const deleteGroup = async (groupId, userId) => {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    const ownerCheck = await client.query(
      `SELECT id FROM groups WHERE id = $1 AND owner_id = $2`,
      [groupId, userId]
    )

    if (ownerCheck.rows.length === 0) {
      await client.query('ROLLBACK')
      return null
    }

    await client.query(
      `DELETE FROM group_members WHERE group_id = $1`,
      [groupId]
    )

    const result = await client.query(
      `DELETE FROM groups WHERE id = $1 RETURNING id`,
      [groupId]
    )

    await client.query('COMMIT')
    return result.rows[0]
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

export {
  createGroup,
  getAllGroups,
  getGroupById,
  isGroupMember,
  getAcceptedMembers,
  requestToJoin,
  getPendingRequests,
  acceptRequest,
  removeGroupMember,
  deleteGroup
}