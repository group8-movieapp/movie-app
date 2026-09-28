import '../styles/movieDetailView.css'

const STAR_PATH = 'M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z'

export default function MovieDetailView({ movie, onBack, user, isFavorite, onToggleFavorite }) {
  // Poimitaan vuosi julkaisupäivämäärästä
  const year = movie.release_date ? movie.release_date.slice(0, 4) : (movie.year || '')

  // Muutetaan genret merkkijonoksi, jos ne tulevat objektilistana
  const genresText = movie.genres 
    ? movie.genres.map(g => g.name).join(' · ').toUpperCase()
    : (movie.genre_ids ? 'MOVIE' : '')

  return (
    <div className="movie-detail-container">
      {/* Takaisin-nappi */}
      <button onClick={onBack} className="back-btn">
        ← Back
      </button>

      {/* Elokuvan tiedot */}
      <div className="movie-hero">
        <div className="movie-hero-poster">
          {movie.poster_path ? (
            <img 
              src={`https://image.tmdb.org/t/p/w400${movie.poster_path}`} 
              alt={movie.title} 
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
          
          <h1>{movie.title}</h1>
          
          <div className="movie-meta">
            {year && <span>{year}</span>}
            {movie.runtime && (
              <>
                <span>·</span>
                <span>{Math.floor(movie.runtime / 60)} h {movie.runtime % 60} min</span>
              </>
            )}
          </div>

          <div className="movie-rating-row">
            <div className="stars">
              {[1, 2, 3, 4, 5].map((s) => (
                <svg key={s} width="16" height="16" viewBox="0 0 24 24" fill={movie.vote_average && s <= Math.round(movie.vote_average / 2) ? '#f59e0b' : 'none'} stroke="#f59e0b" strokeWidth="2">
                  <path d={STAR_PATH} />
                </svg>
              ))}
            </div>
            <span className="rating-score">{movie.vote_average ? movie.vote_average.toFixed(1) : '-'}</span>
            {movie.vote_count && <span className="rating-count">({movie.vote_count} reviews)</span>}
          </div>

          <p className="movie-overview">
            {movie.overview || 'No overview available for this movie.'}
          </p>

          <div className="movie-action-buttons">
            {user && (
              <button 
                className={`btn-action ${isFavorite(movie.id) ? 'active' : ''}`}
                onClick={() => onToggleFavorite(movie)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                {isFavorite(movie.id) ? 'Remove from favorites' : 'Add to favorites'}
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