import React, { useEffect, useState } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL


const FavoriteMovieCard = ({ movieId, onDeleteFavorite, onSelectMovie }) => {
  const [movie, setMovie] = useState(null)

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const res = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
          headers: { Authorization: `Bearer ${TMDB_TOKEN}` }
        })
        setMovie(res.data)
      } catch (err) {
        console.error('Virhe haettaessa elokuvan tietoja:', err)
      }
    }
    if (movieId) fetchMovieDetails()
  }, [movieId])

  if (!movie) {
    return (
      <div className="movie-card" style={{ textAlign: 'center', padding: '40px 10px' }}>
        <p style={{ fontSize: '12px' }}>Ladataan...</p>
      </div>
    )
  }

  return (
    <div className="movie-card">
      {movie.poster_path ? (
        <img
          src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
          alt={movie.title}
          style={{ cursor: 'pointer' }}
          onClick={() => onSelectMovie(movie)}
        />
      ) : (
        <div className="no-poster">No poster available</div>
      )}
      <h3 style={{ cursor: 'pointer' }} onClick={() => onSelectMovie(movie)} title={movie.title}>
        {movie.title}
      </h3>
      <button onClick={() => onDeleteFavorite(movieId)}>
        💔 Remove from favorites
      </button>
    </div>
  )
}

export default function FavoritesList({ onSelectMovie, setPage }) {
  const [favorites, setFavorites] = useState([])

  // Haetaan suosikit suoraan komponentin sisällä
  useEffect(() => {
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
    fetchFavorites()
  }, [])

  // Poistotoiminto
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

  if (!favorites || favorites.length === 0) {
    return (
      <div className="favorites-section" style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Your Favorites</h2>
        <p style={{ marginTop: '20px' }}>No favorites yet. Add movies from the search results!</p>
        <button onClick={() => setPage('home')} style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}>
          ← Takaisin etusivulle
        </button>
      </div>
    )
  }

  return (
    <div className="favorites-section" style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Your Favorite Movies ({favorites.length})</h2>
      <div className="movie-grid" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
        {favorites.map((fav) => (
          <FavoriteMovieCard
            key={fav.id || fav.movie_id}
            movieId={fav.movie_id}
            onDeleteFavorite={handleDeleteFavorite}
            onSelectMovie={onSelectMovie}
          />
        ))}
      </div>
      <button onClick={() => setPage('home')} style={{ marginTop: '30px', padding: '10px 20px', cursor: 'pointer' }}>
        ← Takaisin etusivulle
      </button>
    </div>
  )
}