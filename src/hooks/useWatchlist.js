import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

export function useWatchlist(user, setPage, setSelectedMovie) {
  const [watchlist, setWatchlist] = useState([])

  // Haetaan watchlist kun käyttäjä kirjautuu sisään
  useEffect(() => {
    if (!user) {
      setWatchlist([])
      return
    }

    const fetchWatchlist = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await axios.get(`${API_URL}/api/watchlist`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setWatchlist(res.data)
      } catch (err) {
        console.error('Failed to fetch watchlist', err)
      }
    }

    fetchWatchlist()
  }, [user])

  // Tarkista onko elokuva watchlistilla
  const isInWatchlist = (movieId) => {
    return watchlist.some(item => item.movie_id === movieId)
  }

  // Lisää tai poista watchlistilta (toggle)
  const handleToggleWatchlist = async (movie) => {
    if (!user) {
      setPage('login')
      return
    }

    const token = localStorage.getItem('token')
    const movieId = movie.id

    try {
      if (isInWatchlist(movieId)) {
        // Poista
        await axios.delete(`${API_URL}/api/watchlist/${movieId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setWatchlist(prev => prev.filter(item => item.movie_id !== movieId))
      } else {
        // Lisää
        const res = await axios.post(`${API_URL}/api/watchlist`, 
          { movieId },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        // Päivitetään tila uudella rivillä (tai haetaan list uudelleen)
        if (res.data) {
          setWatchlist(prev => [res.data, ...prev])
        }
      }
    } catch (err) {
      console.error('Failed to update watchlist', err)
      alert('Failed to update watchlist')
    }
  }

  // Poista suoraan listanäkymästä
  const handleDeleteFromWatchlist = async (movieId) => {
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${API_URL}/api/watchlist/${movieId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setWatchlist(prev => prev.filter(item => item.movie_id !== movieId))
    } catch (err) {
      console.error('Failed to remove movie from watchlist', err)
    }
  }

  return {
    watchlist,
    setWatchlist,
    isInWatchlist,
    handleToggleWatchlist,
    handleDeleteFromWatchlist
  }
}