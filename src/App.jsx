import { useEffect, useState } from 'react'
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
import { useFavorites } from './hooks/useFavorites'
import { useNavigation } from './hooks/useNavigation' 

const API_URL = import.meta.env.VITE_API_URL

function App() {
  const [user, setUser] = useState(null)

  
  const { 
    page, 
    setPage, 
    selectedMovie, 
    setSelectedMovie, 
    selectedGroupId, 
    handleNavigate, 
    handleSelectGroup 
  } = useNavigation()

  // Käytetään suosikki-hookia
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

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setFavorites([])
    handleNavigate('home')
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

  // Sisällön renderöinti
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

    // UUSI:
  if (page === 'groupDetail' && selectedGroupId) {
  return (
    <GroupDetailView 
      groupId={selectedGroupId} 
      user={user} 
      onBack={() => {
        handleNavigate('groups') // Tämä tyhjentää selectedGroupId:n ja vie ryhmälistaan
      }} 
    />
  )
}

    if (page === 'groups') {
      return (
        <GroupsView 
          user={user} 
          onSelectGroup={handleSelectGroup} 
        />
      )
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

    // Päänäkymä (Home)
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
        setPage={handleNavigate} 
        user={user} 
        onLogout={handleLogout} 
        onDelete={handleDelete} 
      />
      <main>
        {renderContent()}
      </main>
    </div>
  )
}

export default App