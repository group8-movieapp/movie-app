import express from 'express'
import {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist
} from '../controllers/watchlistController.js'
import { auth } from '../middleware/auth.js'

const router = express.Router()

router.get('/', auth, getWatchlist)
router.post('/', auth, addToWatchlist)
router.delete('/:movieId', auth, removeFromWatchlist)

export default router