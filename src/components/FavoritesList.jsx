import React from 'react'

const FavoritesList = ({ favorites, onDeleteFavorite }) => {
  if (!favorites || favorites.length === 0) {
    return (
      <div className="favorites-section">
        <h2>Your Favorites</h2>
        <p>No favorites yet. Add movies from the search results!</p>
      </div>
    )
  }

  return (
    <div className="favorites-section">
      <h2>Your Favorite Movies ({favorites.length})</h2>
      <div className="movie-grid">
        {favorites.map((fav) => (
          <div key={fav.id || fav.movie_id} className="movie-card">
            {fav.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w200${fav.poster_path}`}
                alt={fav.title}
              />
            ) : (
              <div className="no-poster">No poster available</div>
            )}
            <h3>{fav.title || `Movie ID: ${fav.movie_id}`}</h3>
            <button onClick={() => onDeleteFavorite(fav.movie_id)}>
              💔 Remove from favorites
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FavoritesList