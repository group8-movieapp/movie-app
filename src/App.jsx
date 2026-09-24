import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'
import NowPlayingMovies from './components/NowPlayingmovies'
import Login from './components/Login'
import Register from './components/Register'
import MovieSearch from './components/MovieSearch'
import Header from './components/Header'
import FavoritesList from './components/FavoritesList'
import MovieDetailView from './components/MovieDetailView' 

const API_URL = import.meta.env.VITE_API_URL

function App() {
  const [page, setPage] = useState('home')
  const [user, setUser] = useState(null)
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [favorites, setFavorites] = useState([])

  // Tarkistetaan kirjautuminen käynnistyksessä
  useEffect(() => {
    const loggedUserJSON = localStorage.getItem('user')
    if (loggedUserJSON) {
      setUser(JSON.parse(loggedUserJSON))
    }
  }, [])

  // Haetaan suosikit aina kun kirjautunut käyttäjä vaihtuu (myös kirjautuessa
  // sisään ilman sivun päivitystä), ja tyhjennetään ne uloskirjautuessa niin
  // ettei seuraava käyttäjä näe hetkeäkään edellisen suosikkeja. Tämä siis tapahtuu vain selaimen muistissa, ei backendissä.
  useEffect(() => {
    if (user) {
      fetchFavorites()
    } else {
      setFavorites([])
    }
  }, [user])

  // Haetaan suosikit
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
    setPage('home')
    setSelectedMovie(null)
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete account?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/api/users`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Delete account failed')
      }

      alert('Account deleted successfully')
      handleLogout()
    } catch (error) {
      alert(`Error: ${error.message}`)
    }
  }

  const isFavorite = (movieId) => favorites.some(fav => fav.movie_id === movieId)

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

  // Apufunktio oikean sisällön renderöintiin
  const renderContent = () => {
    if (selectedMovie) {
      return (
        <MovieDetailView 
          movie={selectedMovie} 
          onBack={() => setSelectedMovie(null)} 
          user={user} 
          isFavorite={isFavorite} 
          onToggleFavorite={handleToggleFavorite} 
        />
      )
    }

    if (page === 'favorites') {
      return <FavoritesList favorites={favorites} onDeleteFavorite={handleDeleteFavorite} onSelectMovie={setSelectedMovie} />
    }

    if (page === 'login') {
      return <Login setPage={setPage} setUser={setUser} />
    }

    if (page === 'register') {
      return (
        <div>
          <Register />
          <button onClick={() => setPage('login')}>Back to login</button>
        </div>
      )
    }

    // Päänäkymä (Home)
    return (
      <>
        <MovieSearch onSelectMovie={setSelectedMovie} />
        <NowPlayingMovies onSelectMovie={setSelectedMovie} />
      </>
    )
  }

  // Headerista navigoitaessa suljetaan aina avoinna oleva elokuvan tietosivu,
  // muuten renderContent() jää näyttämään sitä page-tilasta riippumatta.
  const handleNavigate = (nextPage) => {
    setSelectedMovie(null)
    setPage(nextPage)
  }

  return (
    <div className="app">
      <Header page={page} setPage={handleNavigate} user={user} onLogout={handleLogout} onDelete={handleDelete} />
      <main>
        {renderContent()}
      </main>
    </div>
  )
}

export default App