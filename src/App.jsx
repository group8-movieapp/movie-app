import { useEffect, useState } from 'react'
import {Routes, Route, Navigate, useNavigate, useLocation, useParams} from 'react-router-dom'
import './App.css'
import NowPlayingMovies from './components/NowPlayingmovies'
import Login from './components/Login'
import Register from './components/Register'
import MovieSearch from './components/MovieSearch'
import Header from './components/Header'
import FavoritesList from './components/FavoritesList'
import WatchlistView from './components/WatchlistView' // <-- Tuo watchlist-näkymä
import MovieDetailView from './components/MovieDetailView'
import GroupsView from './components/GroupsView'
import GroupDetailView from './components/GroupDetailView'
import Profile from './components/Profile'
import SharedFavorites from './components/SharedFavorites'
import { useFavorites } from './hooks/useFavorites'
import { useWatchlist } from './hooks/useWatchlist' 


const API_URL = import.meta.env.VITE_API_URL

// Redirects to /login when nobody is logged in
function RequireAuth({ user, children }) {
  return user ? children : <Navigate to="/login" replace />
}
 
// Reads :groupId from the URL and passes it down
function GroupDetailRoute({ user, onBack }) {
  const { groupId } = useParams()
  return <GroupDetailView groupId={groupId} user={user} onBack={onBack} />
}

export default function App() {
  // Load the saved user immediately so a refresh on /profile
  // doesn't redirect to /login before the user has loaded
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })
  const [selectedMovie, setSelectedMovie] = useState(null)
 
  const navigate = useNavigate()
  const { pathname } = useLocation()
 
  const page = pathname.split('/')[1] || 'home'
 
  const goTo = (target) => navigate(target === 'home' ? '/' : `/${target}`)
 
  const {
    favorites,
    setFavorites,
    isFavorite,
    handleToggleFavorite,
    handleDeleteFavorite
  } = useFavorites(user, goTo, setSelectedMovie)
 
  const {
    watchlist,
    setWatchlist,
    isInWatchlist,
    handleToggleWatchlist,
    handleDeleteFromWatchlist
  } = useWatchlist(user, goTo, setSelectedMovie)
 
  const handleSelectMovie = (movie) => {
    setSelectedMovie(movie)
    navigate(`/movies/${movie.id}`)
  }
 
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setFavorites([])
    setWatchlist([])
    navigate('/')
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
 
  return (
    <div className="app">
      <Header
        page={page}
        setPage={goTo}
        user={user}
        onLogout={handleLogout}
        onDelete={handleDelete}
      />
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <MovieSearch onSelectMovie={handleSelectMovie} />
                <NowPlayingMovies onSelectMovie={handleSelectMovie} />
              </>
            }
          />
 
          <Route path="/login" element={<Login setPage={goTo} setUser={setUser} />} />
          <Route path="/register" element={<Register setPage={goTo} />} />
 
          <Route
            path="/movies/:movieId"
            element={
              selectedMovie ? (
                <MovieDetailView
                  movie={selectedMovie}
                  onBack={() => navigate(-1)}
                  user={user}
                  isFavorite={isFavorite}
                  onToggleFavorite={handleToggleFavorite}
                  isInWatchlist={isInWatchlist}
                  onToggleWatchlist={handleToggleWatchlist}
                />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
 
          <Route
            path="/favorites"
            element={
              <RequireAuth user={user}>
                <FavoritesList
                  favorites={favorites}
                  onDeleteFavorite={handleDeleteFavorite}
                  onSelectMovie={handleSelectMovie}
                />
              </RequireAuth>
            }
          />
 
          <Route
            path="/watchlist"
            element={
              <RequireAuth user={user}>
                <WatchlistView
                  watchlist={watchlist}
                  onRemoveWatchlist={handleDeleteFromWatchlist}
                  onSelectMovie={handleSelectMovie}
                />
              </RequireAuth>
            }
          />
 
          <Route
            path="/groups"
            element={
              <RequireAuth user={user}>
                <GroupsView
                  user={user}
                  onSelectGroup={(id) => navigate(`/groups/${id}`)}
                />
              </RequireAuth>
            }
          />
 
          <Route
            path="/groups/:groupId"
            element={
              <RequireAuth user={user}>
                <GroupDetailRoute user={user} onBack={() => navigate('/groups')} />
              </RequireAuth>
            }
          />
 
          <Route
            path="/profile"
            element={
              <RequireAuth user={user}>
                <Profile user={user} setPage={goTo} onDelete={handleDelete} />
              </RequireAuth>
            }
          />

          <Route path="/shared" element={<SharedFavorites />} />
 
          {/* Unknown URLs go home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}