import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL

export function useReviews(movieId) {
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchReviews = useCallback(async () => {
        if (!movieId) return

        setLoading(true)
        setError(null)

        try {
            const response = await axios.get(`${API_URL}/api/reviews/movie/${movieId}`)
            setReviews(response.data)
        } catch (err) {
            console.error('Error while fetching reviews', err)
            setError('Failed to fetch reviews')
        } finally {
            setLoading(false)
        }
    }, [movieId])

    useEffect(() => {
        fetchReviews()
    }, [fetchReviews])

    const addReview = async ({ reviewText, rating }) => {
        setError(null)
        setLoading(true)

        const token = localStorage.getItem('token')
        if (!token) {
            setLoading(false)
            throw new Error("You must be logged in to post a review");
        }

        try {
            await axios.post(
                `${API_URL}/api/reviews`,
                {
                    movie_id: movieId,
                    review_text: reviewText,
                    rating: Number(rating)
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            )

            await fetchReviews()

        } catch (err) {
            const errorMessage =
                err.response?.data?.error ||
                err.response?.data?.message ||
                'Failed to submit review'
            setError(errorMessage)
            throw new Error(errorMessage);
        } finally {
            setLoading(false)
        }
    }

    const deleteReview = async (reviewId) => {
        const token = localStorage.getItem('token')
        if (!token) {
            setError("You must be logged in to delete a review")
            return
        }

        setError(null)
        setLoading(true)

        try {
            await axios.delete(
                `${API_URL}/api/reviews/${reviewId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setReviews((prev) => prev.filter((r) => r.id !== reviewId))

        } catch (err) {
            console.error('Failed to delete review', err)
            const errorMessage =
                err.response?.data?.error ||
                err.response?.data?.message ||
                'Failed to delete review'
            setError(errorMessage)
            throw new Error(errorMessage);

        } finally {
            setLoading(false)
        }
    }

    return {
        reviews,
        loading,
        error,
        addReview,
        deleteReview
    }
}