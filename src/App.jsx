import { useEffect, useState } from 'react'
import './App.css'
import NowPlayingMovies from './components/NowPlayingmovies'
import Login from './components/Login' //importataan login komponentti
import Register from './components/Register' //import './App.css' //importa App.css tiedoston
import MovieSearch from './components/MovieSearch'

function App() {
  const [page, setPage] = useState('home') //luo page state, joka määrittää, mikä sivu näytetään (home, login, register)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const loggedUserJSON = localStorage.getItem('user')
    if (loggedUserJSON) {
      const userData = JSON.parse(loggedUserJSON)
      setUser(userData)
    }
  },[])

  const handleLogout = async (e) => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setPage('home')
  }

  if (page === 'login') { //luo login sivu, joka sisältää Login komponentin ja kaksi nappia, joilla voi siirtyä rekisteröitymiseen tai takaisin etusivulle
    return (
      <div className="app">
        <Login setPage={setPage} setUser={setUser} />
        <button onClick={() => setPage('register')}>
          Sign up
        </button>
        <button onClick={() => setPage('home')}>
          Back to frontpage
        </button>
      </div>
    )
  }

  if (page === 'register') { //luo register sivu, joka sisältää Register komponentin ja kaksi nappia, joilla voi siirtyä kirjautumiseen tai takaisin etusivulle
    return (
      <div className="app">
        <Register />
        <button onClick={() => setPage('login')}>
          Back to login
        </button>
      </div>
    )
  }

  return (
    <div className="app">
      <header className='header'>
        {user ? (
          <div className='user-info'>
            <span>Logged in as {user.username}</span>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <button onClick={() => setPage('login')}>
            Login
          </button>
        )}
      </header>

      <MovieSearch />

      <NowPlayingMovies />
    </div>
  )
}

export default App
