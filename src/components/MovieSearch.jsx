import { useState } from 'react'
import axios from 'axios'
import MovieCard from './MovieCard'
import '../styles/movieSearch.css'

const API_URL = import.meta.env.VITE_API_URL

export default function MovieSearch({ onSelectMovie }) {
  const [query, setQuery] = useState('')
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  // Tracks whether a search has ever been submitted, separately from
  // movies.length, so the "no results" message doesn't show before the
  // very first search.
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()

    if (!query.trim()) {
      return
    }

    setLoading(true)
    setError(null)
    setSearched(true)

    try {
      const response = await axios.get(`${API_URL}/api/movies/search`, {
        params: { query }
      })
      setMovies(response.data)
    } catch (err) {
      console.error(err)
      setError('Failed to search for movies.')
      setMovies([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a movie..."
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Find'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {/* Only show this once a search has actually run,
          it's finished loading, it didn't error, and it came back empty. */}
      {searched && !loading && !error && movies.length === 0 && (
        <p>No search results for &quot;{query}&quot;.</p>
      )}

      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} onClick={() => onSelectMovie(movie)} />
        ))}
      </div>
    </>
  )
}
