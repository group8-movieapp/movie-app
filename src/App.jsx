// import { useEffect, useState } from 'react'
// import './App.css'
// import NowPlayingMovies from './components/NowPlayingmovies'
// import Login from './components/Login' //importataan login komponentti
// import Register from './components/Register' //import './App.css' //importa App.css tiedoston
// import MovieSearch from './components/MovieSearch'
// import Header from './components/Header'
// import axios from 'axios'

// const API_URL = import.meta.env.VITE_API_URL

// function App() {
//   const [page, setPage] = useState('home')
//   const [user, setUser] = useState(null)
//   const [favorites, setFavorites] = useState([])
//   const [selectedMovie, setSelectedMovie] = useState(null)

//   // Tarkistetaan kirjautuminen käynnistyksessä
//   useEffect(() => {
//     const loggedUserJSON = localStorage.getItem('user')
//     if (loggedUserJSON) {
//       const userData = JSON.parse(loggedUserJSON)
//       setUser(userData)
//       fetchFavorites()
//     }
//   }, [])

//   // Haetaan käyttäjän suosikit backendistä
//   const fetchFavorites = async () => {
//     const token = localStorage.getItem('token')
//     if (!token) return

//     try {
//       const response = await axios.get(`${API_URL}/api/favorites`, {
//         headers: { Authorization: `Bearer ${token}` }
//       })
//       setFavorites(response.data)
//     } catch (err) {
//       console.error('Failed to fetch favorites', err)
//     }
//   }

//   const handleLogout = () => {
//     localStorage.removeItem('token')
//     localStorage.removeItem('user')
//     setUser(null)
//     setFavorites([])
//     setPage('home')
//   }

//   const handleDelete = async (e) => {
//     const ok = window.confirm('Delete account?')
//     if (!ok)
//       return

//     try {
//       const token = localStorage.getItem('token')
//       const response = await fetch('http://localhost:3000/api/users', {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': `application/json`

//         }
//       })

//       if (!response.ok) {
//         const data = await response.json()
//         throw new Error(data.error || 'Delelte account failed')
//       }

//       alert('Account deleted succesfully')
//       localStorage.removeItem('token')
//       localStorage.removeItem('user')
//       setUser(null)
//       setPage('home')

//     } catch (error) {
//       alert('Error: ${error.message}')
//     }
//   }

//   // Lisää suosikkeihin (ohjaa kirjautumiseen jos ei tokenia)
//   const handleAddFavorite = async (movie) => {
//     const token = localStorage.getItem('token')
//     if (!token) {
//       setPage('login')
//       return
//     }

//     try {
//       const response = await axios.post(
//         `${API_URL}/api/favorites`,
//         { 
//           movieId: movie.id,
//           title: movie.title,
//           poster_path: movie.poster_path 
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       )
//       setFavorites([...favorites, response.data])
//     } catch (err) {
//       console.error('Failed to add favorite', err)
//       alert('Suosikin lisäys epäonnistui.')
//     }
//   }

//   // Poista suosikeista
//   const handleDeleteFavorite = async (movieId) => {
//     const token = localStorage.getItem('token')
//     if (!token) return

//     try {
//       await axios.delete(`${API_URL}/api/favorites/${movieId}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       })
//       setFavorites(favorites.filter(fav => fav.movie_id !== movieId))
//     } catch (err) {
//       console.error('Failed to remove favorite', err)
//       alert('Suosikin poisto epäonnistui.')
//     }
//   }

//   const isFavorite = (movieId) => {
//     return favorites.some(fav => fav.movie_id === movieId)
//   }

//   // Jos käyttäjä on klikannut elokuvaa, näytetään sen yksityiskohdat
//   if (selectedMovie) {
//     return (
//       <div className="app">
//         <Header page={page} setPage={setPage} user={user} onLogout={handleLogout} onDelete={handleDelete} />
//         <div className="movie-detail-view" style={{ padding: '20px', textAlign: 'center' }}>
//           <button onClick={() => setSelectedMovie(null)} style={{ marginBottom: '20px' }}>
//             ← Back to movies
//           </button>
//           <h2>{selectedMovie.title}</h2>
//           {selectedMovie.poster_path && (
//             <img 
//               src={`https://image.tmdb.org/t/p/w400${selectedMovie.poster_path}`} 
//               alt={selectedMovie.title} 
//               style={{ borderRadius: '8px', marginBottom: '15px' }}
//             />
//           )}
//           <p><strong>Release date:</strong> {selectedMovie.release_date || 'N/A'}</p>
//           <p><strong>Rating:</strong> {selectedMovie.vote_average ? `${selectedMovie.vote_average} / 10` : 'N/A'}</p>
//           <p style={{ maxWidth: '600px', margin: '0 auto' }}>{selectedMovie.overview || 'No description available.'}</p>
//         </div>
//       </div>
//     )
//   }

//   // Näkymän vaihto kirjautumiseen
//   if (page === 'login') {
//     return (
//       <div className="app">
//         <Header page={page} setPage={setPage} user={user} onLogout={handleLogout} />
//         <Login setPage={setPage} setUser={setUser} />
//       </div>
//     )
//   }

//   // Näkymän vaihto rekisteröitymiseen
//   if (page === 'register') {
//     return (
//       <div className="app">
//         <Header page={page} setPage={setPage} user={user} onLogout={handleLogout} />
//         <Register />
//         <button onClick={() => setPage('login')}>Back to login</button>
//       </div>
//     )
//   }

//   // Päänäkymä (Home)
//   return (
//     <div className="app">
//       <Header page={page} setPage={setPage} user={user} onLogout={handleLogout} onDelete={handleDelete} />

//       <MovieSearch onSelectMovie={setSelectedMovie} />

//       <NowPlayingMovies onSelectMovie={setSelectedMovie} />
//     </div>
//   )
// }

// export default App

// import { useEffect, useState } from 'react'
// import './App.css'
// import NowPlayingMovies from './components/NowPlayingmovies'
// import Login from './components/Login'
// import Register from './components/Register'
// import MovieSearch from './components/MovieSearch'
// import Header from './components/Header'
// import FavoritesList from './components/FavoritesList'

// const API_URL = import.meta.env.VITE_API_URL

// function App() {
//   const [page, setPage] = useState('home')
//   const [user, setUser] = useState(null)
//   const [selectedMovie, setSelectedMovie] = useState(null)

//   // Tarkistetaan kirjautuminen käynnistyksessä
//   useEffect(() => {
//     const loggedUserJSON = localStorage.getItem('user')
//     if (loggedUserJSON) {
//       setUser(JSON.parse(loggedUserJSON))
//     }
//   }, [])

//   const handleLogout = () => {
//     localStorage.removeItem('token')
//     localStorage.removeItem('user')
//     setUser(null)
//     setPage('home')
//     setSelectedMovie(null)
//   }

//   const handleDelete = async () => {
//     const ok = window.confirm('Delete account?')
//     if (!ok) return

//     try {
//       const token = localStorage.getItem('token')
//       const response = await fetch(`${API_URL}/api/users`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       })

//       if (!response.ok) {
//         const data = await response.json()
//         throw new Error(data.error || 'Delete account failed')
//       }

//       alert('Account deleted successfully')
//       handleLogout()
//     } catch (error) {
//       alert(`Error: ${error.message}`)
//     }
//   }

//   // Elokuvan yksityiskohtanäkymä
//   if (selectedMovie) {
//     return (
//       <div className="app">
//         <Header page={page} setPage={setPage} user={user} onLogout={handleLogout} onDelete={handleDelete} />
//         <div className="movie-detail-view" style={{ padding: '20px', textAlign: 'center' }}>
//           <button onClick={() => setSelectedMovie(null)} style={{ marginBottom: '20px', padding: '8px 16px', cursor: 'pointer' }}>
//             ← Back to movies
//           </button>
//           <h2>{selectedMovie.title}</h2>
//           {selectedMovie.poster_path && (
//             <img 
//               src={`https://image.tmdb.org/t/p/w400${selectedMovie.poster_path}`} 
//               alt={selectedMovie.title} 
//               style={{ borderRadius: '8px', marginBottom: '15px' }}
//             />
//           )}
//           <p><strong>Release date:</strong> {selectedMovie.release_date || 'N/A'}</p>
//           <p><strong>Rating:</strong> {selectedMovie.vote_average ? `${selectedMovie.vote_average} / 10` : 'N/A'}</p>
//           <p style={{ maxWidth: '600px', margin: '0 auto' }}>{selectedMovie.overview || 'No description available.'}</p>
//         </div>
//       </div>
//     )
//   }

//   // Suosikkisivu
//   if (page === 'favorites') {
//     return (
//       <div className="app">
//         <Header page={page} setPage={setPage} user={user} onLogout={handleLogout} onDelete={handleDelete} />
//         <FavoritesList onSelectMovie={setSelectedMovie} setPage={setPage} />
//       </div>
//     )
//   }

//   // Kirjautumissivu
//   if (page === 'login') {
//     return (
//       <div className="app">
//         <Header page={page} setPage={setPage} user={user} onLogout={handleLogout} />
//         <Login setPage={setPage} setUser={setUser} />
//       </div>
//     )
//   }

//   // Rekisteröitymissivu
//   if (page === 'register') {
//     return (
//       <div className="app">
//         <Header page={page} setPage={setPage} user={user} onLogout={handleLogout} />
//         <Register />
//         <button onClick={() => setPage('login')}>Back to login</button>
//       </div>
//     )
//   }

//   // Päänäkymä (Home)
//   return (
//     <div className="app">
//       <Header page={page} setPage={setPage} user={user} onLogout={handleLogout} onDelete={handleDelete} />
//       <MovieSearch onSelectMovie={setSelectedMovie} />
//       <NowPlayingMovies onSelectMovie={setSelectedMovie} />
//     </div>
//   )
// }

// export default App

// import { useEffect, useState } from 'react'
// import './App.css'
// import NowPlayingMovies from './components/NowPlayingmovies'
// import Login from './components/Login'
// import Register from './components/Register'
// import MovieSearch from './components/MovieSearch'
// import Header from './components/Header'
// import FavoritesList from './components/FavoritesList'

// const API_URL = import.meta.env.VITE_API_URL

// function App() {
//   const [page, setPage] = useState('home')
//   const [user, setUser] = useState(null)
//   const [selectedMovie, setSelectedMovie] = useState(null)

//   // Tarkistetaan kirjautuminen käynnistyksessä
//   useEffect(() => {
//     const loggedUserJSON = localStorage.getItem('user')
//     if (loggedUserJSON) {
//       setUser(JSON.parse(loggedUserJSON))
//     }
//   }, [])

//   const handleLogout = () => {
//     localStorage.removeItem('token')
//     localStorage.removeItem('user')
//     setUser(null)
//     setPage('home')
//     setSelectedMovie(null)
//   }

//   const handleDelete = async () => {
//     const ok = window.confirm('Delete account?')
//     if (!ok) return

//     try {
//       const token = localStorage.getItem('token')
//       const response = await fetch(`${API_URL}/api/users`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       })

//       if (!response.ok) {
//         const data = await response.json()
//         throw new Error(data.error || 'Delete account failed')
//       }

//       alert('Account deleted successfully')
//       handleLogout()
//     } catch (error) {
//       alert(`Error: ${error.message}`)
//     }
//   }

//   return (
//     <div className="app">
//       <Header page={page} setPage={setPage} user={user} onLogout={handleLogout} onDelete={handleDelete} />

//       {/* 1. Elokuvan yksityiskohtanäkymä */}
//       {selectedMovie ? (
//         <div className="movie-detail-view" style={{ padding: '20px', textAlign: 'center' }}>
//           <button onClick={() => setSelectedMovie(null)} style={{ marginBottom: '20px', padding: '8px 16px', cursor: 'pointer' }}>
//             ← Back to movies
//           </button>
//           <h2>{selectedMovie.title}</h2>
//           {selectedMovie.poster_path && (
//             <img 
//               src={`https://image.tmdb.org/t/p/w400${selectedMovie.poster_path}`} 
//               alt={selectedMovie.title} 
//               style={{ borderRadius: '8px', marginBottom: '15px' }}
//             />
//           )}
//           <p><strong>Release date:</strong> {selectedMovie.release_date || 'N/A'}</p>
//           <p><strong>Rating:</strong> {selectedMovie.vote_average ? `${selectedMovie.vote_average} / 10` : 'N/A'}</p>
//           <p style={{ maxWidth: '600px', margin: '0 auto' }}>{selectedMovie.overview || 'No description available.'}</p>
//         </div>
//       ) : page === 'favorites' ? (
//         /* 2. Suosikkisivu */
//         <FavoritesList onSelectMovie={setSelectedMovie} setPage={setPage} />
//       ) : page === 'login' ? (
//         /* 3. Kirjautumissivu */
//         <Login setPage={setPage} setUser={setUser} />
//       ) : page === 'register' ? (
//         /* 4. Rekisteröitymissivu */
//         <div>
//           <Register />
//           <button onClick={() => setPage('login')} style={{ margin: '20px', cursor: 'pointer' }}>Back to login</button>
//         </div>
//       ) : (
//         /* 5. Päänäkymä (Home) */
//         <>
//           <MovieSearch onSelectMovie={setSelectedMovie} />
//           <NowPlayingMovies onSelectMovie={setSelectedMovie} />
//         </>
//       )}
//     </div>
//   )
// }

// export default App

import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'
import NowPlayingMovies from './components/NowPlayingmovies'
import Login from './components/Login'
import Register from './components/Register'
import MovieSearch from './components/MovieSearch'
import Header from './components/Header'
import FavoritesList from './components/FavoritesList'

const API_URL = import.meta.env.VITE_API_URL

function App() {
  const [page, setPage] = useState('home')
  const [user, setUser] = useState(null)
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [favorites, setFavorites] = useState([])

  // Tarkistetaan kirjautuminen ja haetaan suosikit käynnistyksessä
  useEffect(() => {
    const loggedUserJSON = localStorage.getItem('user')
    if (loggedUserJSON) {
      const parsedUser = JSON.parse(loggedUserJSON)
      setUser(parsedUser)
      fetchFavorites()
    }
  }, [])

  // Haetaan käyttäjän suosikit backendistä
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

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setFavorites([])
    setPage('home')
    setSelectedMovie(null)
  }

  const handleDelete = async () => {
    const ok = window.confirm('Delete account?')
    if (!ok) return

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

  // Tarkistetaanko onko elokuva jo suosikeissa
  const isFavorite = (movieId) => {
    return favorites.some(fav => fav.movie_id === movieId)
  }

  // Lisää tai poista suosikeista (pysytään samalla sivulla, nappi vain päivittyy)
  const handleToggleFavorite = async (movie) => {
    const token = localStorage.getItem('token')
    if (!token) {
      setPage('login')
      setSelectedMovie(null)
      return
    }

    try {
      if (isFavorite(movie.id)) {
        await axios.delete(`${API_URL}/api/favorites/${movie.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setFavorites(favorites.filter(fav => fav.movie_id !== movie.id))
      } else {
        await axios.post(
          `${API_URL}/api/favorites`,
          { movieId: movie.id },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        await fetchFavorites()
      }
    } catch (err) {
      console.error('Suosikin päivitys epäonnistui', err)
      alert('Toiminto epäonnistui.')
    }
  }

  // Elokuvan yksityiskohtanäkymä
  if (selectedMovie) {
    return (
      <div className="app">
        <Header page={page} setPage={setPage} user={user} onLogout={handleLogout} onDelete={handleDelete} />
        <div className="movie-detail-view" style={{ padding: '20px', textAlign: 'center' }}>
          <button onClick={() => setSelectedMovie(null)} style={{ marginBottom: '20px', padding: '8px 16px', cursor: 'pointer' }}>
            ← Back to movies
          </button>
          <h2>{selectedMovie.title}</h2>

          {/* Lisää suosikkeihin -nappi */}
          {user && (
            <div style={{ marginBottom: '15px' }}>
              <button 
                onClick={() => handleToggleFavorite(selectedMovie)}
                style={{ 
                  backgroundColor: isFavorite(selectedMovie.id) ? '#ef4444' : '#22c55e', 
                  color: 'white', 
                  padding: '10px 20px', 
                  border: 'none', 
                  borderRadius: '6px', 
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                {isFavorite(selectedMovie.id) ? 'Poista suosikeista' : 'Lisää suosikkeihin'}
              </button>
            </div>
          )}

          {selectedMovie.poster_path && (
            <img 
              src={`https://image.tmdb.org/t/p/w400${selectedMovie.poster_path}`} 
              alt={selectedMovie.title} 
              style={{ borderRadius: '8px', marginBottom: '15px' }}
            />
          )}
          <p><strong>Release date:</strong> {selectedMovie.release_date || 'N/A'}</p>
          <p><strong>Rating:</strong> {selectedMovie.vote_average ? `${selectedMovie.vote_average} / 10` : 'N/A'}</p>
          <p style={{ maxWidth: '600px', margin: '0 auto' }}>{selectedMovie.overview || 'No description available.'}</p>
        </div>
      </div>
    )
  }

  // Suosikkisivu
  if (page === 'favorites') {
    return (
      <div className="app">
        <Header page={page} setPage={setPage} user={user} onLogout={handleLogout} onDelete={handleDelete} />
        <FavoritesList onSelectMovie={setSelectedMovie} setPage={setPage} />
      </div>
    )
  }

  // Kirjautumissivu
  if (page === 'login') {
    return (
      <div className="app">
        <Header page={page} setPage={setPage} user={user} onLogout={handleLogout} />
        <Login setPage={setPage} setUser={setUser} />
      </div>
    )
  }

  // Rekisteröitymissivu
  if (page === 'register') {
    return (
      <div className="app">
        <Header page={page} setPage={setPage} user={user} onLogout={handleLogout} />
        <Register />
        <button onClick={() => setPage('login')}>Back to login</button>
      </div>
    )
  }

  // Päänäkymä (Home)
  return (
    <div className="app">
      <Header page={page} setPage={setPage} user={user} onLogout={handleLogout} onDelete={handleDelete} />
      <MovieSearch onSelectMovie={setSelectedMovie} />
      <NowPlayingMovies onSelectMovie={setSelectedMovie} />
    </div>
  )
}

export default App