// import '../styles/movieCard.css'

// const STAR_PATH = 'M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z'

// // Draws one row of 5 star outlines. Two of these are stacked (an empty
// // row behind, a gold row on top clipped to a percentage width) to show
// // fractional ratings like 3.9/5 without needing separate half-star icons.
// function StarIcons() {
//   return (
//     <>
//       {[0, 1, 2, 3, 4].map((i) => (
//         <svg key={i} width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
//           <path d={STAR_PATH} />
//         </svg>
//       ))}
//     </>
//   )
// }

// // TMDB's standard genres (id -> short English name). Used only for the
// // card's secondary line ("Genre · Year") when a movie carries genre_ids
// // (e.g. in search results).
// const GENRE_NAMES = {
//   28: 'Action',
//   12: 'Adventure',
//   16: 'Animation',
//   35: 'Comedy',
//   80: 'Crime',
//   99: 'Documentary',
//   18: 'Drama',
//   10751: 'Family',
//   14: 'Fantasy',
//   36: 'History',
//   27: 'Horror',
//   10402: 'Music',
//   9648: 'Mystery',
//   10749: 'Romance',
//   878: 'Sci-Fi',
//   10770: 'TV Movie',
//   53: 'Thriller',
//   10752: 'War',
//   37: 'Western'
// }

// // If movie has no poster, we show a placeholder with a gradient background. This array
// const PLACEHOLDER_GRADIENTS = [
//   'linear-gradient(160deg, #3b5bdb, #1e3a8a)',
//   'linear-gradient(160deg, #4ade80, #14532d)',
//   'linear-gradient(160deg, #f87171, #7f1d1d)',
//   'linear-gradient(160deg, #a78bfa, #4c1d95)',
//   'linear-gradient(160deg, #22d3ee, #0e7490)',
//   'linear-gradient(160deg, #fb923c, #7c2d12)'
// ]

// export default function MovieCard({ movie }) {
//   const year = movie.release_date ? movie.release_date.slice(0, 4) : null
//   const genreName = movie.genre_ids?.length ? GENRE_NAMES[movie.genre_ids[0]] : null
//   const subtitle = [genreName, year].filter(Boolean).join(' · ')
//   const gradient = PLACEHOLDER_GRADIENTS[movie.id % PLACEHOLDER_GRADIENTS.length]

//   return (
//     <div className="movie-card">
//       <div className="movie-card-poster">
//         {movie.poster_path ? (
//           <img
//             src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
//             alt={movie.title}
//             loading="lazy"
//           />
//         ) : (
//           <div className="movie-card-placeholder" style={{ background: gradient }}>
//             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5">
//               <rect x="2" y="4" width="20" height="16" rx="2" />
//               <path d="M7 4v16M17 4v16" />
//             </svg>
//           </div>
//         )}

//         {typeof movie.vote_average === 'number' && movie.vote_average > 0 && (
//           // TMDB rates movies 0-10; the assignment wants a 1-5 scale, so we
//           // halve it here and render it as a 5-star row instead of a raw number.
//           (() => {
//             const ratingOutOfFive = movie.vote_average / 2
//             const fillPercent = Math.max(0, Math.min(100, (movie.vote_average / 10) * 100))

//             return (
//               <span className="movie-card-rating">
//                 <span className="movie-card-stars" title={`${ratingOutOfFive.toFixed(1)} / 5`}>
//                   <span className="stars-row stars-empty">
//                     <StarIcons />
//                   </span>
//                   <span className="stars-row stars-filled" style={{ width: `${fillPercent}%` }}>
//                     <StarIcons />
//                   </span>
//                 </span>
//                 <span className="movie-card-rating-value">{ratingOutOfFive.toFixed(1)}</span>
//               </span>
//             )
//           })()
//         )}
//       </div>

//       <h3 className="movie-card-title">{movie.title}</h3>
//       {subtitle && <p className="movie-card-subtitle">{subtitle}</p>}
//     </div>
//   )
// }
import '../styles/movieCard.css'

const STAR_PATH = 'M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z'

function StarIcons() {
  return (
    <>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
          <path d={STAR_PATH} />
        </svg>
      ))}
    </>
  )
}

const GENRE_NAMES = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western'
}

const PLACEHOLDER_GRADIENTS = [
  'linear-gradient(160deg, #3b5bdb, #1e3a8a)',
  'linear-gradient(160deg, #4ade80, #14532d)',
  'linear-gradient(160deg, #f87171, #7f1d1d)',
  'linear-gradient(160deg, #a78bfa, #4c1d95)',
  'linear-gradient(160deg, #22d3ee, #0e7490)',
  'linear-gradient(160deg, #fb923c, #7c2d12)'
]

export default function MovieCard({ movie, onClick }) {
  const year = movie.release_date ? movie.release_date.slice(0, 4) : null
  const genreName = movie.genre_ids?.length ? GENRE_NAMES[movie.genre_ids[0]] : null
  const subtitle = [genreName, year].filter(Boolean).join(' · ')
  const gradient = PLACEHOLDER_GRADIENTS[movie.id % PLACEHOLDER_GRADIENTS.length]

  return (
    <div className="movie-card" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="movie-card-poster">
        {movie.poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
            alt={movie.title}
            loading="lazy"
          />
        ) : (
          <div className="movie-card-placeholder" style={{ background: gradient }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M7 4v16M17 4v16" />
            </svg>
          </div>
        )}

        {typeof movie.vote_average === 'number' && movie.vote_average > 0 && (
          (() => {
            const ratingOutOfFive = movie.vote_average / 2
            const fillPercent = Math.max(0, Math.min(100, (movie.vote_average / 10) * 100))

            return (
              <span className="movie-card-rating">
                <span className="movie-card-stars" title={`${ratingOutOfFive.toFixed(1)} / 5`}>
                  <span className="stars-row stars-empty">
                    <StarIcons />
                  </span>
                  <span className="stars-row stars-filled" style={{ width: `${fillPercent}%` }}>
                    <StarIcons />
                  </span>
                </span>
                <span className="movie-card-rating-value">{ratingOutOfFive.toFixed(1)}</span>
              </span>
            )
          })()
        )}
      </div>

      <h3 className="movie-card-title">{movie.title}</h3>
      {subtitle && <p className="movie-card-subtitle">{subtitle}</p>}
    </div>
  )
}