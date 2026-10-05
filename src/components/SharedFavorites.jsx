import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import axios from 'axios'
import MovieCard from './MovieCard'
import '../styles/favoritesList.css'

const API_URL = import.meta.env.VITE_API_URL

export default function SharedFavorites() {
  const [searchParams] = useSearchParams()
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)

  const idsParam = searchParams.get('ids') || ''

  useEffect(() => {
    const ids = idsParam.split(',').filter(Boolean)
    if (ids.length === 0) {
      setMovies([])
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)

    Promise.all(
      ids.map((id) =>
        axios
          .get(`${API_URL}/api/movies/${id}`)
          .then((res) => res.data)
          .catch(() => null)
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
  }, [idsParam])

  return (
    <div className="favorites-section">
      <h2>Shared Favorite Movies</h2>
      <Link to="/">Back to home</Link>

      {loading && <p>Loading...</p>}
      {!loading && movies.length === 0 && <p>No movies found in this link.</p>}

      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  )
}