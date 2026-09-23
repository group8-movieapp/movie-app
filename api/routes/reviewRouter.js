import express from 'express'
import { newReview, getAllReviews, getByMovieId, removeReview } from '../controllers/reviewController.js'
import { auth } from '../middleware/auth.js'

const router = express.Router()

router.get('/', getAllReviews)
router.get('/movie/:movie_id', getByMovieId)
router.post('/', auth, newReview)
router.delete('/:id', auth, removeReview)

export default router