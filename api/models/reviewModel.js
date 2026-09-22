import { pool } from "./db.js";

const addReview = async (user_id, movie_id, review_text, rating) => {
    const result = await pool.query(
        `INSERT INTO reviews (user_id, movie_id, review_text, rating)
        VALUES ($1,$2,$3,$4)
        RETURNING id, user_id, movie_id, review_text, rating, created_at`,
        [user_id, movie_id, review_text, rating]
    )

    return result.rows[0]
}

const getReviews = async () => {
    const result = await pool.query(
        `SELECT reviews.id, reviews.movie_id, reviews.review_text, reviews.rating, reviews.created_at, users.username
         FROM reviews
         JOIN users ON reviews.user_id = users.id
         ORDER BY reviews.created_at DESC`
    )

    return result.rows
}



export {addReview, getReviews}