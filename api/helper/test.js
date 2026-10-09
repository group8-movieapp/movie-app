import fs from 'fs/promises'
import path from 'path'
import { pool } from '../models/db.js'
import { hash } from 'bcrypt'
import jwt from 'jsonwebtoken'

const __dirname = import.meta.dirname

const initializeTestDb = async () => {
    const sql = await fs.readFile(path.resolve(__dirname, '../init.test.db.sql'), 'utf8')
    await pool.query(sql)
}

const insertTestUser = async (user) => {
    const hashedPassword = await hash(user.password, 10)
    await pool.query(
        `INSERT INTO users (username, email, password) VALUES ($1, $2, $3)
        RETURNING id, username, email`,
        [user.username, user.email.toLowerCase(), hashedPassword]
    )
}

const getToken = (email) => {
    return jwt.sign({ email, id }, process.env.JWT_SECRET, { expiresIn: '1h' }
    )
}

export { initializeTestDb, insertTestUser, getToken }