import { useEffect, useState } from 'react'
import axios from 'axios'
import MovieCard from './MovieCard'
import '../styles/WatchlistView.css'

const API_URL = import.meta.env.VITE_API_URL

export default function WatchlistView({ watchlist, onRemoveWatchlist, onSelectMovie }) {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!watchlist || watchlist.length === 0) {
      setMovies([])
      return
    }

    let cancelled = false
    setLoading(true)

    Promise.all(
      watchlist.map((item) =>
        axios
          .get(`${API_URL}/api/movies/${item.movie_id}`)
          .then((res) => res.data)
          .catch((err) => {
            console.error(
              `Failed to load watchlist movie ${item.movie_id}`,
              err
            )
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
  }, [watchlist])

  if (!watchlist || watchlist.length === 0) {
    return (
      <div className="watchlist-section">
        <h2>Your Watchlist</h2>
        <p>No movies in your watchlist yet. Add movies you want to watch!</p>
      </div>
    )
  }

  return (
    <div className="watchlist-section">
      <div className="watchlist-header">
        <h2>Your Watchlist ({watchlist.length})</h2>
      </div>

      {loading && <p>Loading your watchlist...</p>}

      <div className="movie-grid">
        {movies.map((movie) => (
          <div key={movie.id} className="watchlist-card">
            <MovieCard
              movie={movie}
              onClick={() => onSelectMovie?.(movie)}
            />

            <button
              type="button"
              className="btn btn-outline watchlist-remove-btn"
              onClick={() => onRemoveWatchlist?.(movie.id)}
            >
              Remove from watchlist
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}