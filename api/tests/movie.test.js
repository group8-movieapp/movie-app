import { describe, test, expect, vi, afterEach } from "vitest"
import request from "supertest"
import app from "../app.js"
import * as tmdbService from '../service/tmdbService.js'

describe('Movies API (TMDB Service Mocked)', () => {
    afterEach(() => {
        vi.restoreAllMocks()
    })

    describe('Positive tests', () => {
        test('should return search results when query matches movies (200)', async () => {
            const mockMovies = [
                { id: 550, title: 'The Bridge Over River Kwai' },
                { id: 551, title: 'The Matrix' },
                { id: 552, title: 'Clockwork Orange' }
            ]

            const spy = vi.spyOn(tmdbService, 'searchMoviesFromTMDB').mockResolvedValue(mockMovies)

            const res = await request(app).get('/api/movies/search?query=TheBridge')

            expect(res.status).toBe(200)
            expect(res.body).toEqual(mockMovies)
            expect(spy).toHaveBeenCalledOnce()

        })

        test('should return now playing movies (200)', async () => {
            const mockNowPlaying = [
                { id: 101, title: 'Dune: Part Two' }
            ]

            const spy = vi.spyOn(tmdbService, 'nowPlayingMoviesFromTMDB').mockResolvedValue(mockNowPlaying)

            const res = await request(app).get('/api/movies/now-playing')

            expect(res.status).toBe(200)
            expect(res.body).toEqual(mockNowPlaying)
            expect(spy).toHaveBeenCalledOnce()
        })

        test('should return movie details by id (200)', async () => {
            const mockMovie = {
                id: 550,
                title: 'The Godfather',
                genre_ids: [18, 53]
            }

            const spy = vi.spyOn(tmdbService, 'getMovieByIdFromTMDB').mockResolvedValue(mockMovie)

            const res = await request(app).get('/api/movies/550')

            expect(res.status).toBe(200)
            expect(res.body).toEqual(mockMovie)
            expect(spy).toHaveBeenCalledWith('550')
        })
    })

    describe('Negative tests', () => { 
        test('should return 500 when TMBD search fails', async () => { 
            vi.spyOn(tmdbService, 'searchMoviesFromTMDB').mockRejectedValue(new Error('TMDB connection error'))

            const res = await request(app).get('/api/movies/search?query=Shining')

            expect(res.status).toBe(500)
            expect(res.body).toEqual({error: 'Error while searching a movie'})
         })

         test('should return 500 when fetching movie details fails', async () => { 
            vi.spyOn(tmdbService, 'getMovieByIdFromTMDB').mockRejectedValue(new Error('TMFB connection error'))

            const res = await request(app).get('/api/movies/7098343')

            expect(res.status).toBe(500)
            expect(res.body).toEqual({error: 'Error while fetching movie details'})
          })
     })
})