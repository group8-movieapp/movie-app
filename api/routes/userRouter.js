// Importataan Express-kirjasto
import express from 'express'

// Importataan registerUser-funktio userControllerista
import { registerUser } from '../controllers/userController.js'

// Luodaan uusi reititin
const router = express.Router()

// Määritellään POST-pyyntö /signup-polulle, joka kutsuu registerUser-funktiota
router.post('/signup', registerUser)

// Viedään reititin, jotta sitä voidaan käyttää muissa tiedostoissa
export default router