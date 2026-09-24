import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

export function useFavorites(user, setPage, setSelectedMovie) {
  const [favorites, setFavorites] = useState([])

  // Haetaan suosikit aina kun käyttäjä vaihtuu
  useEffect(() => {
    if (user) {
      fetchFavorites()
    } else {
      setFavorites([])
    }
  }, [user])

  const fetchFavorites = async () => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const response = await axios.get(`${API_URL}/api/favorites`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setFavorites(response.data)
    } catch (err) {
      console.error('Failed to fetch favorites', err)
    }
  }

  const isFavorite = (movieId) => {
    return favorites.some(fav => fav.movie_id === movieId)
  }

  const handleToggleFavorite = async (movie) => {
    const token = localStorage.getItem('token')
    if (!token) {
      setPage('login')
      setSelectedMovie(null)
      return
    }

    try {
      if (isFavorite(movie.id)) {
        await axios.delete(`${API_URL}/api/favorites/${movie.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setFavorites(favorites.filter(fav => fav.movie_id !== movie.id))
      } else {
        await axios.post(
          `${API_URL}/api/favorites`,
          { movieId: movie.id, title: movie.title, poster_path: movie.poster_path },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        await fetchFavorites()
      }
    } catch (err) {
      console.error('Suosikin päivitys epäonnistui', err)
      alert('Toiminto epäonnistui.')
    }
  }

  const handleDeleteFavorite = async (movieId) => {
    const token = localStorage.getItem('token')
    try {
      await axios.delete(`${API_URL}/api/favorites/${movieId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setFavorites(favorites.filter(fav => fav.movie_id !== movieId))
    } catch (err) {
      console.error(err)
    }
  }

  return {
    favorites,
    setFavorites,
    isFavorite,
    handleToggleFavorite,
    handleDeleteFavorite
  }
}