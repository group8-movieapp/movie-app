import express from 'express'

import { registerUser, loginUser } from '../controllers/userController.js'

// Luodaan uusi reititin
const router = express.Router()

// Määritellään POST-pyyntö /signup-polulle, joka kutsuu registerUser-funktiota
router.post('/signup', registerUser)
router.post('/login', loginUser)

// Viedään reititin, jotta sitä voidaan käyttää muissa tiedostoissa
export default router