import { describe, test, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../app.js";
import { pool } from "../models/db.js";
import { initializeTestDb } from "../helper/test.js";

describe('Auth API - Sign Up', () => {

    beforeAll(async () => {
        await initializeTestDb()
        await pool.query('TRUNCATE TABLE users RESTART IDENTITY CASCADE;')
    })

    afterAll(async () => {
        await pool.end()
    })

    test('1) POST /api/users/signup - Create new user succesfully (201)', async () => {
        const res = await request(app)
            .post('/api/users/signup')
            .send({
                username: 'User',
                email: 'user@example.com',
                password: 'Test1234'
            })

        expect([201]).toContain(res.status)
        expect(res.body).toHaveProperty('id')
    })
})