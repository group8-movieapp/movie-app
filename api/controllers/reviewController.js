import { addReview, getReviews, getReviewsByMovieId, deleteReview } from "../models/reviewModel.js";


const newReview = async (req, res, next) => {
    try {
        const userId = req.user.userId
        const { movie_id, review_text, rating } = req.body
        const numericRating = Number(rating)

        if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
            const error = new Error('Rating is required and have to be between 1-5')
            error.status = 400
            return next(error)
        }

        if (!review_text || review_text.trim() === '') {
            const error = new Error('Review is required')
            error.status = 400
            return next(error)
        }

        if (!movie_id) {
            const error = new Error('movie_id is required')
            error.status = 400
            return next(error)
        }

        const review = await addReview(userId, movie_id, review_text.trim(), numericRating)

        res.status(201).json(review)
    } catch (error) {
        next(error)
    }
}

const getAllReviews = async (req, res, next) => {
    try {
        const reviews = await getReviews()
        res.status(200).json(reviews)
    } catch (error) {
        next(error)
    }
}

const getByMovieId = async (req, res, next) => {
    try {
        const { movie_id } = req.params
        const reviews = await getReviewsByMovieId(movie_id)

        res.status(200).json(reviews)

    } catch (error) {
        next(error)
    }
}

const removeReview = async (req, res, next) => {
    try {
        const { id } = req.params
        const userId = req.user.userId

        const rowCount = await deleteReview(id, userId)

        if (rowCount === 0) {
            const error = new Error('Review not found or not authorized to delete')
            error.status = 403
            return next(error)
        }

        res.status(200).json({message: 'Review deleted successfully'})
    } catch (error) {
        next(error)
    }
}

export { newReview, getAllReviews, getByMovieId, removeReview }