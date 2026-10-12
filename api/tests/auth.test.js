import { describe, test, expect, beforeAll, afterAll } from "vitest"
import request from "supertest"
import app from "../app.js"
import { pool } from "../models/db.js"
import { initializeTestDb } from "../helper/test.js"

describe('Auth API', () => {
    let token = ''

    const testUser = {
        username: 'TestUser',
        email: 'testuser@example.com',
        password: 'TestPassword1234'
    }

    beforeAll(async () => {
        await initializeTestDb()
        await pool.query('TRUNCATE TABLE users RESTART IDENTITY CASCADE;')
    })

    afterAll(async () => {
        await pool.end()
    })

    // Sign up tests
    describe('POST /api/users/signup', () => {
        test('should create a new user succesfully (201)', async () => {
            const res = await request(app)
                .post('/api/users/signup')
                .send(testUser)
            expect(res.status).toBe(201)
            expect(res.body).toHaveProperty('id')
            expect(res.body).not.toHaveProperty('password')
        })

        test('should fail when email is already in use (400)', async () => {
            const res = await request(app)
                .post('/api/users/signup')
                .send(testUser)

            expect(res.status).toBe(400)
        })

        test('should fail when password is missing (400)', async () => {
            const res = await request(app)
                .post('/api/users/signup')
                .send({
                    username: 'IncompleteUser',
                    email: 'incomplete@example.com'
                })

            expect(res.status).toBe(400)
        })
    })

    // Log in tests
    describe('POST /api/users/login', () => {
        test('should log in succesfully and return token (200)', async () => {
            const res = await request(app)
                .post('/api/users/login')
                .send({
                    email: testUser.email,
                    password: testUser.password
                })

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('token')
            token = res.body.token
        })

        test('should fail with invalid password (401)', async () => {
            const res = await request(app)
                .post('/api/users/login')
                .send({
                    email: testUser.email,
                    password: 'wrong-password'
                })

            expect(res.status).toBe(401)
        })

    })

    // Log out tests
    describe('POST /api/users/logout', () => {
        test('should log out succesfully with token (200) ', async () => {
            const res = await request(app)
                .post('/api/users/logout')
                .set('Authorization', `Bearer ${token}`)

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('message')
        })

        test('should fail to log out without token (401)', async () => {
            const res = await request(app)
                .post('/api/users/logout')

            expect(res.status).toBe(401)
        })

    })

    // Delete user tests
    describe('DELETE /api/users', () => {
        test('should fail to delete user without token (401)', async () => {
            const res = await request(app)
                .delete('/api/users')

            expect(res.status).toBe(401)
        })

        test('should delete user succesfully with token (200)', async () => {
            const res = await request(app)
                .delete('/api/users')
                .set('Authorization', `Bearer ${token}`)

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('message')
        })
    })
})