import { useEffect, useState } from 'react'
import axios from 'axios'
import '../styles/movieDetailView.css'

const API_URL = import.meta.env.VITE_API_URL
const STAR_PATH = 'M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z'

export default function MovieDetailView({ movie, onBack, user, isFavorite, onToggleFavorite }) {
  const [details, setDetails] = useState(null)

  // Haetaan elokuvan täydet tiedot TMDB:stä, jotta saadaan mm. genret ja runtime.
  // Tehdään samalla periaatteella kuin FavoritesList.jsx jo tekee suosikeille.
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

  // Yhdistetään haetut täydet tiedot alkuperäisen propin päälle. Näin esim.
  // juliste ja otsikko näkyvät heti, eikä vasta kun haku on valmistunut.
  const fullMovie = details ? { ...movie, ...details } : movie

  // Poimitaan vuosi julkaisupäivämäärästä
  const year = fullMovie.release_date ? fullMovie.release_date.slice(0, 4) : (fullMovie.year || '')

  // Genret tulevat vain täysistä tiedoista objektilistana ({ id, name })
  const genresText = fullMovie.genres
    ? fullMovie.genres.map(g => g.name).join(' · ').toUpperCase()
    : ''

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

          <div className="movie-action-buttons">
            {user && (
              <button 
                className={`btn-action ${isFavorite(fullMovie.id) ? 'active' : ''}`}
                onClick={() => onToggleFavorite(fullMovie)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                {isFavorite(fullMovie.id) ? 'Remove from favorites' : 'Add to favorites'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

//Tämä on se sivu, jonne siirrytään aina kun klikataan jotain tiettyä elokuvaa, 
// jotta näkee sen tarkemmat tiedot ja voi lisätä sen suosikkeihinsa.
