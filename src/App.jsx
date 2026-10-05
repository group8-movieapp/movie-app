import { useEffect, useState } from 'react'
import { useNavigate, BrowserRouter } from 'react-router-dom'
import './App.css'
import NowPlayingMovies from './components/NowPlayingmovies'
import Login from './components/Login'
import Register from './components/Register'
import MovieSearch from './components/MovieSearch'
import Header from './components/Header'
import FavoritesList from './components/FavoritesList'
import MovieDetailView from './components/MovieDetailView'
import GroupsView from './components/GroupsView'
import GroupDetailView from './components/GroupDetailView'
import Profile from './components/Profile'
import { useFavorites } from './hooks/useFavorites'
import { useNavigation } from './hooks/useNavigation'
import AppRouter from './AppRouter'

const API_URL = import.meta.env.VITE_API_URL

function AppContent() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  // Navigaatio-hook omistaa page- ja selectedMovie-tilan
  const {
    page,
    setPage,
    selectedMovie,
    setSelectedMovie,
    selectedGroupId,
    handleNavigate,
    handleSelectGroup
  } = useNavigation()

  const {
    favorites,
    setFavorites,
    isFavorite,
    handleToggleFavorite,
    handleDeleteFavorite
  } = useFavorites(user, setPage, setSelectedMovie)

  useEffect(() => {
    const loggedUserJSON = localStorage.getItem('user')
    if (loggedUserJSON) {
      setUser(JSON.parse(loggedUserJSON))
    }
  }, [])

  // Vie käyttäjä takaisin osoitteeseen "/" (esim. /shared-sivulta) ja vaihda sivu
  const handleHeaderNavigate = (nextPage) => {
    handleNavigate(nextPage)
    navigate('/')
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setFavorites([])
    handleHeaderNavigate('home')
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your account?')) return

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

    if (page === 'groupDetail' && selectedGroupId) {
      return (
        <GroupDetailView
          groupId={selectedGroupId}
          user={user}
          onBack={() => handleNavigate('groups')}
        />
      )
    }

    if (page === 'groups') {
      return <GroupsView user={user} onSelectGroup={handleSelectGroup} />
    }

    if (page === 'favorites') {
      return (
        <FavoritesList
          favorites={favorites}
          onDeleteFavorite={handleDeleteFavorite}
          onSelectMovie={setSelectedMovie}
        />
      )
    }

    if (page === 'login') {
      return <Login setPage={setPage} setUser={setUser} />
    }

    if (page === 'register') {
      return <Register setPage={setPage} />
    }

    if (page === 'profile') {
      return <Profile user={user} setPage={setPage} onDelete={handleDelete} />
    }

    return (
      <>
        <MovieSearch onSelectMovie={setSelectedMovie} />
        <NowPlayingMovies onSelectMovie={setSelectedMovie} />
      </>
    )
  }

  return (
    <div className="app">
      <Header
        page={page}
        setPage={handleHeaderNavigate}
        user={user}
        onLogout={handleLogout}
        onDelete={handleDelete}
      />
      <main>
        <AppRouter home={renderContent()} />
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}