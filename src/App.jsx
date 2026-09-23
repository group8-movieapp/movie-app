import { useEffect, useState } from 'react'
import './App.css'
import NowPlayingMovies from './components/NowPlayingmovies'
import Login from './components/Login' //importataan login komponentti
import Register from './components/Register' //import './App.css' //importa App.css tiedoston
import MovieSearch from './components/MovieSearch'
import Header from './components/Header'

function App() {
  const [page, setPage] = useState('home')
  const [user, setUser] = useState(null)

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

  const handleDelete = async (e) => {
    const ok = window.confirm('Delete account?')
    if (!ok)
      return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:3000/api/users', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': `application/json`

        }
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Delelte account failed')
      }

      alert('Account deleted succesfully')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setUser(null)
      setPage('home')

    } catch (error) {
      alert('Error: ${error.message}')
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
        <Header page={page} setPage={setPage} user={user} onLogout={handleLogout} />
        <Login setPage={setPage} setUser={setUser} />
      </div>
    )
  }

  // Näkymän vaihto rekisteröitymiseen
  if (page === 'register') {
    return (
      <div className="app">
        <Header page={page} setPage={setPage} user={user} onLogout={handleLogout} />
        <Register />
        <button onClick={() => setPage('login')}>Back to login</button>
      </div>
    )
  }

  // Päänäkymä (Home)
  return (
    <div className="app">
      <Header page={page} setPage={setPage} user={user} onLogout={handleLogout} onDelete={handleDelete} />

      <MovieSearch />

      <NowPlayingMovies />
    </div>
  )
}

export default App