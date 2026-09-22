import express from 'express'
import { registerUser, loginUser, deleteUser } from '../controllers/userController.js'
import { auth } from '../middleware/auth.js'

// Luodaan uusi reititin
const router = express.Router()

// Määritellään POST-pyyntö /signup-polulle, joka kutsuu registerUser-funktiota
router.post('/signup', registerUser)
router.post('/login', loginUser)
router.delete('/', auth, deleteUser)

export default router