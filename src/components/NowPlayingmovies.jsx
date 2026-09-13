import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import '../styles/nowPlayingMovies.css'

const API_URL = import.meta.env.VITE_API_URL

export default function NowPlayingMovies() {

  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  const fetchNowPlayingMovies = async (e) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await axios.get(`${API_URL}/api/movies/now-playing`)
      setMovies(response.data)
    } catch (err) {
      console.error(err)
      setError('Failed to search for movies.')
      setMovies([])
    } finally {
      setIsLoading(false)
    }
  }
  
  useEffect(() => {
    fetchNowPlayingMovies()
  }, []);

  function scroll(direction) {
    const { current } = scrollRef;
    if (!current) return;
    const amount = 320;
    current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  }

  return (
    <div id="nowPlaying">
      <h2>NOW PLAYING IN THEATERS</h2>
       
      {!!isLoading && <p>Loading now playing movies...</p>}
      {error && <p>Something went wrong: {error}</p>}


      // Scrolls the card row left or right by a fixed amount when a button is
      // clicked. Bails out early if the ref isn't attached to anything yet.
    <div className="movie-row-wrapper">
        <button onClick={() => scroll('left')} className="scroll-btn scroll-btn-left">‹</button>

      <div id="now-playing-movie-grid" ref={scrollRef}>
        {movies.map((movie) => (
          <div key={movie.id} className="now-playing-movie-card">
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
              />
            ) : (
              <div className="no-poster">No poster available</div>
            )}
            <h3>{movie.title}</h3>
            <p className="release-date">
              {movie.release_date || 'Release date not available'}
            </p>
          </div>
        ))}
        </div>

        <button onClick={() => scroll('right')} className="scroll-btn scroll-btn-right">›</button>
      </div>
    </div>
  );
}