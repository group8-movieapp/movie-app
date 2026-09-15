import { useState } from 'react'
import axios from 'axios'
import './App.css'
import NowPlayingMovies from './components/NowPlayingMovies'
import Login from './components/Login' //importataan login komponentti
import Register from './components/Register' //import './App.css' //importa App.css tiedoston

const API_URL = import.meta.env.VITE_API_URL

function App() {
  const [page, setPage] = useState('home') //luo page state, joka määrittää, mikä sivu näytetään (home, login, register)

  const [query, setQuery] = useState('')
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
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

  if (page === 'login') { //luo login sivu, joka sisältää Login komponentin ja kaksi nappia, joilla voi siirtyä rekisteröitymiseen tai takaisin etusivulle
    return (
      <div className="app">
        <Login setPage={setPage} />
        <button onClick={() => setPage('register')}>
          Rekisteröidy
        </button>
        <button onClick={() => setPage('home')}>
          Takaisin etusivulle
        </button>
      </div>
    )
  }

  if (page === 'register') { //luo register sivu, joka sisältää Register komponentin ja kaksi nappia, joilla voi siirtyä kirjautumiseen tai takaisin etusivulle
    return (
      <div className="app">
        <Register />
        <button onClick={() => setPage('login')}>
          Takaisin kirjautumiseen
        </button>
      </div>
    )
  }

  return (
    <div className="app">
      <button onClick={() => setPage('login')}>
        Kirjaudu
      </button>

      <h1>Movie Search</h1>

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

      {searched && !loading && !error && movies.length === 0 && (
        <p>No search results for &quot;{query}&quot;.</p>
      )}

      <div className="movie-grid">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
              />
            ) : (
              <div className="no-poster">No poster available</div>
            )}

            <h3>{movie.title}</h3>

            <p className="release-date">
              {movie.release_date || 'Release date not available'}
            </p>
          </div>
        ))}
      </div>

      <NowPlayingMovies />
    </div>
  )
}

export default App
