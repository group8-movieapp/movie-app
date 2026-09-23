import {
  addFavorite,
  getFavoritesByUser,
  deleteFavorite
} from '../models/favoriteModel.js'

const createFavorite = async (req, res, next) => {
  try {
    
    const userId = req.user.userId || req.user.id 
    const { movieId } = req.body

    const favorite = await addFavorite(userId, movieId)

    res.status(201).json(favorite)
  } catch (error) {
    next(error)
  }
}

const getUserFavorites = async (req, res, next) => {
  try {
    const userId = req.user.userId

    const favorites = await getFavoritesByUser(userId)

    res.json(favorites)
  } catch (error) {
    next(error)
  }
}

const removeFavorite = async (req, res, next) => {
  try {
    const userId = req.user.userId
    const { movieId } = req.params

    const favorite = await deleteFavorite(userId, movieId)

    res.json(favorite)
  } catch (error) {
    next(error)
  }
}

export {
  createFavorite,
  getUserFavorites,
  removeFavorite
}