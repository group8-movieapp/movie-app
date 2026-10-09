import { useEffect, useState } from 'react'
import axios from 'axios'
import Reviews from './Reviews'
import '../styles/movieDetailView.css'

const API_URL = import.meta.env.VITE_API_URL
const STAR_PATH = 'M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z'

export default function MovieDetailView({ 
  movie, 
  onBack, 
  user, 
  isFavorite, 
  onToggleFavorite, 
  isInWatchlist, 
  onToggleWatchlist 
}) {
  const [details, setDetails] = useState(null)
  const [myGroups, setMyGroups] = useState([])
  const [selectedGroupId, setSelectedGroupId] = useState('')
  const [groupMovieIds, setGroupMovieIds] = useState([])

  // Haetaan elokuvan täydet tiedot TMDB:stä, jotta saadaan mm. genret ja runtime.
  useEffect(() => {
    let cancelled = false
    setDetails(null)

    axios.get(`${API_URL}/api/movies/${movie.id}`)
      .then((res) => {
        if (!cancelled) setDetails(res.data)
      })
      .catch((err) => console.error('Failed to fetch movie details', err))

    return () => { cancelled = true }
  }, [movie.id])

  // Haetaan käyttäjän omat ryhmät, jotta "lisää ryhmään" -valikkoon tulee
  // oikeat vaihtoehdot. Haetaan vain kirjautuneena.
  useEffect(() => {
    if (!user) {
      setMyGroups([])
      return
    }

    const token = localStorage.getItem('token')
    axios.get(`${API_URL}/api/groups/mine`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        setMyGroups(res.data)
        // Esivalitaan ensimmäinen ryhmä, jotta yhden ryhmän tapauksessa
        // riittää yksi klikkaus.
        if (res.data.length > 0) setSelectedGroupId(String(res.data[0].id))
      })
      .catch((err) => console.error('Failed to fetch groups', err))
  }, [user])

  // Haetaan valitun ryhmän elokuvat, jotta napin tila (lisätty / ei lisätty)
  // voidaan päätellä samaan tapaan kuin suosikeissa ja watchlistissä.
  useEffect(() => {
    if (!user || !selectedGroupId) {
      setGroupMovieIds([])
      return
    }

    const token = localStorage.getItem('token')
    axios.get(`${API_URL}/api/groups/${selectedGroupId}/movies`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        setGroupMovieIds(res.data.map((m) => m.movie_id))
      })
      .catch((err) => console.error('Failed to fetch group movies', err))
  }, [user, selectedGroupId])

  const fullMovie = details ? { ...movie, ...details } : movie

  // Poimitaan vuosi julkaisupäivämäärästä
  const year = fullMovie.release_date ? fullMovie.release_date.slice(0, 4) : (fullMovie.year || '')

  // Genret tulevat vain täysistä tiedoista objektilistana ({ id, name })
  const genresText = fullMovie.genres
    ? fullMovie.genres.map(g => g.name).join(' · ').toUpperCase()
    : ''

  const isInSelectedGroup = groupMovieIds.includes(fullMovie.id)

  const handleToggleGroupMovie = async () => {
    if (!selectedGroupId) return
    const token = localStorage.getItem('token')

    try {
      if (isInSelectedGroup) {
        await axios.delete(
          `${API_URL}/api/groups/${selectedGroupId}/movies/${fullMovie.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        setGroupMovieIds((prev) => prev.filter((id) => id !== fullMovie.id))
      } else {
        await axios.post(
          `${API_URL}/api/groups/${selectedGroupId}/movies`,
          { movieId: fullMovie.id },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        setGroupMovieIds((prev) => [...prev, fullMovie.id])
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update group movies')
    }
  }

  return (
    <div className="movie-detail-container">
      {/* Takaisin-nappi */}
      <button onClick={onBack} className="back-btn">
        ← Back
      </button>

      {/* Elokuvan tiedot */}
      <div className="movie-hero">
        <div className="movie-hero-poster">
          {fullMovie.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w400${fullMovie.poster_path}`}
              alt={fullMovie.title}
            />
          ) : (
            <div className="movie-hero-placeholder">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M7 4v16M17 4v16" />
              </svg>
            </div>
          )}
        </div>

        <div className="movie-hero-info">
          {genresText && <span className="movie-genre-tag">{genresText}</span>}

          <h1>{fullMovie.title}</h1>

          <div className="movie-meta">
            {year && <span>{year}</span>}
            {fullMovie.runtime && (
              <>
                <span>·</span>
                <span>{Math.floor(fullMovie.runtime / 60)} h {fullMovie.runtime % 60} min</span>
              </>
            )}
          </div>

          <div className="movie-rating-row">
            <div className="stars">
              {[1, 2, 3, 4, 5].map((s) => (
                <svg key={s} width="16" height="16" viewBox="0 0 24 24" fill={fullMovie.vote_average && s <= Math.round(fullMovie.vote_average / 2) ? '#f59e0b' : 'none'} stroke="#f59e0b" strokeWidth="2">
                  <path d={STAR_PATH} />
                </svg>
              ))}
            </div>
            <span className="rating-score">{fullMovie.vote_average ? fullMovie.vote_average.toFixed(1) : '-'}</span>
            {fullMovie.vote_count && <span className="rating-count">({fullMovie.vote_count} reviews)</span>}
          </div>

          <p className="movie-overview">
            {fullMovie.overview || 'No overview available for this movie.'}
          </p>

          {/* Ryhmävalikko on omassa rivissään erillään toiminto-napeista,
              jotta se ei sekoitu suosikki-/watchlist-/ryhmänappien joukkoon. */}
          {user && myGroups.length > 0 && (
            <div className="movie-group-picker">
              <label htmlFor="group-select">Group</label>
              <select
                id="group-select"
                value={selectedGroupId}
                onChange={(e) => setSelectedGroupId(e.target.value)}
              >
                {myGroups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="movie-action-buttons" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {user && (
              <>
                {/* Suosikkinappi */}
                <button
                  className={`btn-action ${isFavorite && isFavorite(fullMovie.id) ? 'active' : ''}`}
                  onClick={() => onToggleFavorite && onToggleFavorite(fullMovie)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                  {isFavorite && isFavorite(fullMovie.id) ? 'Remove from favorites' : 'Add to favorites'}
                </button>

                {/* Watchlist-nappi */}
                <button
                  className={`btn-action ${isInWatchlist && isInWatchlist(fullMovie.id) ? 'active' : ''}`}
                  onClick={() => onToggleWatchlist && onToggleWatchlist(fullMovie)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                  </svg>
                  {isInWatchlist && isInWatchlist(fullMovie.id) ? 'Remove from watchlist' : 'Add to watchlist'}
                </button>

                {/* Lisää ryhmään -nappi. Käyttää samaa väritystä kuin muutkin
                    toimintonapit (btn-action), jotta rivi näyttää yhtenäiseltä. */}
                {myGroups.length > 0 ? (
                  <button
                    type="button"
                    className={`btn-action ${isInSelectedGroup ? 'active' : ''}`}
                    onClick={handleToggleGroupMovie}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M19 8v6M22 11h-6"></path>
                    </svg>
                    {isInSelectedGroup ? 'Remove from group' : 'Add to group'}
                  </button>
                ) : (
                  <p className="no-groups-hint">Join a group to add this movie there.</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <div className="movie-detail-reviews-section">
        <Reviews movieId={movie.id} user={user} />
      </div>
    </div>
  )
}
