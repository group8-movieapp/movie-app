import express from 'express'
import { registerUser, loginUser, deleteUser, logoutUser } from '../controllers/userController.js'
import { auth } from '../middleware/auth.js'

// Luodaan uusi reititin
const router = express.Router()

// Määritellään POST-pyyntö /signup-polulle, joka kutsuu registerUser-funktiota
router.post('/signup', registerUser)
router.post('/login', loginUser)
router.post('/logout', auth, logoutUser)
router.delete('/', auth, deleteUser)


export default router