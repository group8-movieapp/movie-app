import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'
import NowPlayingMovies from './components/NowPlayingMovies'
import Login from './components/Login'
import Register from './components/Register'
import FavoritesList from './components/FavoritesList'

const API_URL = import.meta.env.VITE_API_URL

function App() {
  const [page, setPage] = useState('home')
  const [user, setUser] = useState(null)
  const [query, setQuery] = useState('')
  const [movies, setMovies] = useState([])
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searched, setSearched] = useState(false)

  // Tarkistetaan kirjautuminen käynnistyksessä
  useEffect(() => {
    const loggedUserJSON = localStorage.getItem('user')
    if (loggedUserJSON) {
      const userData = JSON.parse(loggedUserJSON)
      setUser(userData)
      fetchFavorites()
    }
  }, [])

  // Haetaan käyttäjän suosikit backendistä
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

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setFavorites([])
    setPage('home')
  }

  // Elokuvien haku TMDB:stä
  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

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

  // Lisää suosikkeihin (ohjaa kirjautumiseen jos ei tokenia)
  const handleAddFavorite = async (movie) => {
    const token = localStorage.getItem('token')
    if (!token) {
      setPage('login')
      return
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/favorites`,
        { 
          movieId: movie.id,
          title: movie.title,
          poster_path: movie.poster_path 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setFavorites([...favorites, response.data])
    } catch (err) {
      console.error('Failed to add favorite', err)
      alert('Suosikin lisäys epäonnistui.')
    }
  }

  // Poista suosikeista
  const handleDeleteFavorite = async (movieId) => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      await axios.delete(`${API_URL}/api/favorites/${movieId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setFavorites(favorites.filter(fav => fav.movie_id !== movieId))
    } catch (err) {
      console.error('Failed to remove favorite', err)
      alert('Suosikin poisto epäonnistui.')
    }
  }

  const isFavorite = (movieId) => {
    return favorites.some(fav => fav.movie_id === movieId)
  }

  // Näkymän vaihto kirjautumiseen
  if (page === 'login') {
    return (
      <div className="app">
        <Login setPage={(newPage) => {
          setPage(newPage)
          if (newPage === 'home') fetchFavorites()
        }} setUser={setUser} />
        <button onClick={() => setPage('register')}>Sign up</button>
        <button onClick={() => setPage('home')}>Back to frontpage</button>
      </div>
    )
  }

  // Näkymän vaihto rekisteröitymiseen
  if (page === 'register') {
    return (
      <div className="app">
        <Register />
        <button onClick={() => setPage('login')}>Back to login</button>
      </div>
    )
  }

  // Päänäkymä (Home)
  return (
    <div className="app">
      <header className='header' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px' }}>
        
        {/* Aina näkyvä Favouritelist-painike */}
        <button 
          onClick={() => {
            if (!user) {
              setPage('login')
            } else {
              const favSection = document.getElementById('favorites-section')
              if (favSection) {
                favSection.scrollIntoView({ behavior: 'smooth' })
              }
            }
          }}
          style={{ fontWeight: 'bold' }}
        >
          ⭐ Favouritelist {user && `(${favorites.length})`}
        </button>

        {/* Kirjautumistila / Logout-nappi */}
        {user ? (
          <div className='user-info' style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span>Logged in as {user.username}</span>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <button onClick={() => setPage('login')}>Login</button>
        )}
      </header>

      <h1>Movie Search</h1>

      {/* Suosikkilista omassa ID:llä rullausta varten (näkyy vain kirjautuneille) */}
      {user && (
        <div id="favorites-section">
          <FavoritesList 
            favorites={favorites} 
            onDeleteFavorite={handleDeleteFavorite} 
          />
        </div>
      )}

      {/* Hakulomake */}
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

      {/* Hakutulokset */}
      <div className="movie-grid">
        {movies.map((movie) => {
          const favorited = isFavorite(movie.id)
          return (
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

              <button 
                onClick={() => favorited ? handleDeleteFavorite(movie.id) : handleAddFavorite(movie)}
              >
                {favorited ? '💔 Remove from favorites' : '🤍 Add to favorites'}
              </button>
            </div>
          )
        })}
      </div>

      <NowPlayingMovies />
    </div>
  )
}

export default App