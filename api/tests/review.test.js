import { describe, test, expect, beforeAll, afterAll } from "vitest"
import request from "supertest"
import app from "../app.js"
import { pool } from "../models/db.js"
import { initializeTestDb } from "../helper/test.js"

describe('Reviews API', () => {
    let token = ''
    let createdReviewId = null

    const testUser = {
        username: 'ReviewTester',
        email: 'reviewtester@example.com',
        password: 'Password1234'
    }

    beforeAll(async () => {
        await initializeTestDb()

        await request(app)
            .post('/api/users/signup')
            .send(testUser)

        const logingRes = await request(app)
            .post('/api/users/login')
            .send({
                email: testUser.email,
                password: testUser.password
            })

        token = logingRes.body.token
    })

    afterAll(async () => {
        await pool.end()
    })

    // Browse reviews
    describe('GET /api/reviews', () => {
        test('should return all reviews as an array (200)', async () => {
            const res = await request(app)
                .get('/api/reviews')

            expect(res.status).toBe(200)
            expect(Array.isArray(res.body)).toBe(true)
        })

        test('should return an empty array for a non-existent movie ID (200)', async () => {
            const res = await request(app)
                .get('/api/reviews/movie/325436543')

            expect(res.status).toBe(200)
            expect(Array.isArray(res.body)).toBe(true)
            expect(res.body).toHaveLength(0)
        })
    })

    // Add reviews
    describe('POST /api/reviews', () => {
        test('should fail to add review without a token (401)', async () => {
            const res = await request(app)
                .post('/api/reviews')
                .send({
                    movie_id: 550,
                    review_text: 'Test review',
                    rating: 5
                })

            expect(res.status).toBe(401)
        })

        test('should fail when rating is invalid (400)', async () => {
            const res = await request(app)
                .post('/api/reviews')
                .send({
                    movie_id: 550,
                    review_text: 'Invalid rating review',
                    rating: 6
                })
        })

        test('should should create review succesfully with valid token', async () => {
            const res = await request(app)
                .post('/api/reviews')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    movie_id: 550,
                    review_text: 'Succesfull review',
                    rating: 5
                })

            expect(res.status).toBe(201)
            expect(res.body).toHaveProperty('id')
            expect(res.body.rating).toBe(5)
            createdReviewId = res.body.id
        })
    })

    describe('DELETE /api/reviews/:id', () => {
        test('should fail to delete review without token (401)', async () => {
            const res = await request(app)
                .delete(`/api/reviews/${createdReviewId}`)

            expect(res.status).toBe(401)
        })

        test('should delete review succesfully with owner token (200)', async () => {
            const res = await request(app)
                .delete(`/api/reviews/${createdReviewId}`)
                .set('Authorization', `Bearer ${token}`)

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('message')

        })
    })
})