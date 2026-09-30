import { useState } from 'react'
import axios from 'axios'
import MovieCard, { GENRE_NAMES } from './MovieCard'
import '../styles/movieSearch.css'

const API_URL = import.meta.env.VITE_API_URL

// Pudotusvalikkoa varten muutetaan GENRE_NAMES-objekti ({id: name})
// listaksi [{id, name}, ...], jotta sen voi helposti .map():ata <option>-elementeiksi.
const GENRE_OPTIONS = Object.entries(GENRE_NAMES).map(([id, name]) => ({
  id: Number(id),
  name
}))

const CURRENT_YEAR = new Date().getFullYear()
// Vuosivalikko.
const YEAR_OPTIONS = Array.from(
  { length: CURRENT_YEAR - 1950 + 1 },
  (_, i) => CURRENT_YEAR - i
)

export default function MovieSearch({ onSelectMovie }) {
  const [query, setQuery] = useState('')
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searched, setSearched] = useState(false)
  const [selectedGenre, setSelectedGenre] = useState('')
  const [selectedYear, setSelectedYear] = useState('')

  const handleSearch = async (e) => {
  e.preventDefault()

  const hasQuery = query.trim().length > 0
  // Sallitaan haku myös ilman hakusanaa, kunhan jokin suodatin on valittu.
  // Jos ei hakusanaa eikä yhtään suodatinta, ei ole mitä hakea.
  if (!hasQuery && !selectedGenre && !selectedYear) return

  setLoading(true)
  setError(null)
  setSearched(true)

  try {
    let results

    if (hasQuery) {
      // Tekstihaku: /search/movie ei tue genre-suodatusta TMDB:n puolella,
      // joten se tehdään tässä itse jo haetuista tuloksista.
      const response = await axios.get(`${API_URL}/api/movies/search`, {
        params: { query, year: selectedYear || undefined }
      })

      results = selectedGenre
        ? response.data.filter((movie) => movie.genre_ids?.includes(Number(selectedGenre)))
        : response.data
    } else {
      // Ei hakusanaa: käytetään /discover/movie-reittiä, joka suodattaa
      // genren ja vuoden mukaan.
      const response = await axios.get(`${API_URL}/api/movies/discover`, {
        params: {
          genre: selectedGenre || undefined,
          year: selectedYear || undefined
        }
      })

      results = response.data
    }

    setMovies(results)
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

        <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
          <option value="">All genres</option>
          {GENRE_OPTIONS.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>

        <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
          <option value="">All years</option>
          {YEAR_OPTIONS.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Find'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

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