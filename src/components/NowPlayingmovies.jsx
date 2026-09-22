import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import MovieCard from './MovieCard'
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

  // Scrolls the card row left or right by a fixed amount when a button is
  // clicked. Bails out early if the ref isn't attached to anything yet.
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

      <div className="movie-row-wrapper">
        <button
          type="button"
          onClick={() => scroll('left')}
          className="scroll-btn scroll-btn-left"
          aria-label="Scroll left"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div id="now-playing-movie-grid" ref={scrollRef}>
          {movies.map((movie) => (
            <div key={movie.id} className="now-playing-movie-card">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => scroll('right')}
          className="scroll-btn scroll-btn-right"
          aria-label="Scroll right"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
