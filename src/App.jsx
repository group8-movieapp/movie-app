import { useEffect, useState } from 'react'
import './App.css'
import NowPlayingMovies from './components/NowPlayingmovies'
import Login from './components/Login'
import Register from './components/Register'
import MovieSearch from './components/MovieSearch'
import Header from './components/Header'
import FavoritesList from './components/FavoritesList'
import MovieDetailView from './components/MovieDetailView' 
import { useFavorites } from './hooks/useFavorites' // hook

const API_URL = import.meta.env.VITE_API_URL

function App() {
  const [page, setPage] = useState('home')
  const [user, setUser] = useState(null)
  const [selectedMovie, setSelectedMovie] = useState(null)

  // Tässä otetaan suosikkilogiikka käyttöön hookista. Muuten on sama kuin aiemmin, mutta suosikkien hallinta on siirretty hookiin.
  const { 
    favorites, 
    setFavorites, 
    isFavorite, 
    handleToggleFavorite, 
    handleDeleteFavorite 
  } = useFavorites(user, setPage, setSelectedMovie)

  // Tarkistetaan kirjautuminen käynnistyksessä
  useEffect(() => {
    const loggedUserJSON = localStorage.getItem('user')
    if (loggedUserJSON) {
      setUser(JSON.parse(loggedUserJSON))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setFavorites([]) 
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
      return <Register setPage={setPage}/>
    }

    // Päänäkymä (Home)
    return (
      <>
        <MovieSearch onSelectMovie={setSelectedMovie} />
        <NowPlayingMovies onSelectMovie={setSelectedMovie} />
      </>
    )
  }

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