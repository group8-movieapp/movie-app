import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import errorHandler from './middleware/errorHandler.js'
import movieRouter from './routes/movieRouter.js' //Muutettu MVC-malliin sopivaksi, jotta reitit ja controllerit ovat erillään.
import userRouter from './routes/userRouter.js' // Importataan userRouter
import reviewRouter from './routes/reviewRouter.js'
import favoriteRouter from './routes/favoriteRouter.js' // Importataan favoriteRouter
import groupRouter from './routes/groupRoutes.js' // Importataan groupRouter
import watchlistRouter from './routes/watchlistRouter.js'

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/movies', movieRouter) 

// Käytetään userRouteria /api/users-polussa
app.use('/api/users', userRouter)
app.use('/api/favorites', favoriteRouter) // Käytetään favoriteRouteria /api/favorites-polussa
app.use('/api/watchlist', watchlistRouter) // Käytetään watchlistRoutesia /api/watchlist-polussa
app.use('/api/reviews', reviewRouter)
app.use('/api/groups', groupRouter) // Käytetään groupRouteria /api/groups-polussa

// Health check endpoint for database connectivity
app.get('/api/health', async (req, res) => {
  try {
    const { pool } = await import('./models/db.js')
    await pool.query('SELECT 1')
    res.status(200).json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    })
  }
})

app.use((req, res, next) => {
  const error = new Error('Not found')
  error.status = 404
  next(error)
})

app.use(errorHandler)

export default app