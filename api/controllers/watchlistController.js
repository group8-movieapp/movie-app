import {
  getUserWatchlist,
  addWatchlist,
  removeWatchlist
} from '../models/watchlistModel.js'

export const getWatchlist = async (req, res, next) => {
  try {
    const userId = req.user.id
    const watchlist = await getUserWatchlist(userId)

    res.json(watchlist)
  } catch (error) {
    next(error)
  }
}

export const addToWatchlist = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { movieId } = req.body

    const newEntry = await addWatchlist(userId, movieId)

    res.status(201).json(newEntry)
  } catch (error) {
    next(error)
  }
}

export const removeFromWatchlist = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { movieId } = req.params

    const deletedEntry = await removeWatchlist(userId, movieId)

    res.json(deletedEntry)
  } catch (error) {
    next(error)
  }
}