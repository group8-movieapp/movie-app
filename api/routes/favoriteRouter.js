import express from 'express'
import {
  createFavorite,
  getUserFavorites,
  removeFavorite
} from '../controllers/favoriteController.js'
import { auth } from '../middleware/auth.js'

const router = express.Router()

router.get('/', auth, getUserFavorites)
router.post('/', auth, createFavorite)
router.delete('/:movieId', auth, removeFavorite)

export default router