import { useState } from "react"
import { useReviews } from "../hooks/useReviews"
import '../styles/reviews.css'

const STAR_PATH = 'M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z'

export default function Reviews({ movieId, user }) {
    const { reviews, loading, error, addReview, deleteReview } = useReviews(movieId)

    const [reviewText, setReviewText] = useState('')
    const [rating, setRating] = useState(5)
    const [formError, setFormError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setFormError('')

        if (!reviewText.trim()) {
            setFormError('Please write a review before submitting')
            return
        }

        setSubmitting(true)
        try {
            await addReview({ reviewText, rating })
            setReviewText('')
            setRating(5)
        } catch (err) {
            setFormError(err.message || 'Failed to submit review')
        } finally {
            setSubmitting(false)
        }

    }

    const handleDelete = async (reviewId) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return

        try {
            await deleteReview(reviewId)
        } catch (err) {
            alert(err.message || 'Failed to delete review')
        }
    }

    return (
        <div className="reviews-container">
            <h2 className="reviews-title">Reviews</h2>

            {user ? (
                <form onSubmit={handleSubmit} className="review-form">
                    <h3 className="review-form-title">Write a Review</h3>

                    {formError && <p className="reviews-status reviews-error">{formError}</p>}

                    <div className="rating-select-group">
                        <label className="review-form-label">Your Rating:</label>
                        <div className="star-picker">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    type="button"
                                    key={star}
                                    className="star-btn"
                                    onClick={() => setRating(star)}
                                    title={`${star} / 5`}
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        className={`star-icon ${star <= rating ? 'star-filled' : 'star-empty'}`}
                                    >
                                        <path d={STAR_PATH} />
                                    </svg>
                                </button>
                            ))}
                            <span className="rating-preview-score">{rating} / 5</span>
                        </div>
                    </div>

                    <div className="review-textarea-group">
                        <label htmlFor="review-text" className="review-form-label">Your Review:</label>
                        <textarea
                            id="review-text"
                            className="review-textarea"
                            rows="4"
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="What did you think of the movie?"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting || loading}
                        className="review-submit-btn"
                    >
                        {submitting ? 'Submitting...' : 'Post Review'}
                    </button>
                </form>
            ) : (
                <p className="review-login-hint">Log in to leave a review.</p>
            )}

            {loading && !submitting && <p className="reviews-status reviews-loading">Loading reviews...</p>}
            {error && <p className="reviews-status reviews-error">{error}</p>}

            <div className="reviews-list">
                {!loading && reviews.length === 0 && (
                    <p className="reviews-empty">No reviews yet. Be the first to review!</p>
                )}

                {reviews.map((rev) => (
                    <div key={rev.id} className="review-card">
                        <div className="review-card-header">
                            <div className="review-card-author-group">
                                <span className="review-author">{rev.username}</span>
                                <div className="review-stars-display">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <svg
                                            key={s}
                                            viewBox="0 0 24 24"
                                            className={`star-icon-small ${s <= rev.rating ? 'star-filled' : 'star-empty'}`}
                                        >
                                            <path d={STAR_PATH} />
                                        </svg>
                                    ))}
                                </div>
                            </div>

                            {user && user.username === rev.username && (
                                <button
                                    type="button"
                                    className="review-delete-btn"
                                    onClick={() => handleDelete(rev.id)}
                                    title="Delete review"
                                >
                                    Delete
                                </button>
                            )}
                        </div>

                        <p className="review-text">{rev.review_text}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}