import { useEffect, useState } from 'react'
import axios from 'axios'
import MovieCard from './MovieCard'
import '../styles/favoritesList.css'

const API_URL = import.meta.env.VITE_API_URL

export default function FavoritesList({ favorites, onDeleteFavorite, onSelectMovie }) {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)

  
  useEffect(() => {
    if (!favorites || favorites.length === 0) {
      setMovies([])
      return
    }

    let cancelled = false
    setLoading(true)

    Promise.all(
      favorites.map((fav) =>
        axios
          .get(`${API_URL}/api/movies/${fav.movie_id}`)
          .then((res) => res.data)
          .catch((err) => {
            console.error(`Failed to load favorite movie ${fav.movie_id}`, err)
            return null
          })
      )
    ).then((results) => {
      if (!cancelled) {
        setMovies(results.filter(Boolean))
        setLoading(false)
      }
    })

    return () => {
      cancelled = true
    }
  }, [favorites])

  if (!favorites || favorites.length === 0) {
    return (
      <div className="favorites-section">
        <h2>Your Favorites</h2>
        <p>No favorites yet. Add movies from the search results!</p>
      </div>
    )
  }

  return (
    <div className="favorites-section">
      <h2>Your Favorite Movies ({favorites.length})</h2>

      {loading && <p>Loading your favorites...</p>}

      <div className="movie-grid">
        {movies.map((movie) => (
          <div key={movie.id} className="favorite-card">
            <MovieCard movie={movie} onClick={() => onSelectMovie?.(movie)} />
            <button
              type="button"
              className="btn btn-outline favorite-remove-btn"
              onClick={() => onDeleteFavorite(movie.id)}
            >
              Remove from favorites
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
