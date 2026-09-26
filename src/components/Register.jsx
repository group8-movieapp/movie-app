import { useState } from 'react'
import axios from 'axios'
import '../styles/register.css'


const API_URL = import.meta.env.VITE_API_URL

// Luodaan Register-komponentti
const Register = ({ setPage }) => {

  // Tallennetaan käyttäjänimi
  const [username, setUsername] = useState('')

  // Tallennetaan sähköpostiosoite
  const [email, setEmail] = useState('')

  // Tallennetaan salasana
  const [password, setPassword] = useState('')

  // Tallennetaan onnistumisviesti
  const [message, setMessage] = useState('')

  // Tallennetaan virheilmoitus
  const [error, setError] = useState('')

  // Luodaan funktio, joka käsittelee rekisteröitymisen
  const handleRegister = async (event) => {

    // Estetään lomakkeen oletustoiminto eli sivun uudelleenlataus
    event.preventDefault()

    // Tyhjennetään aikaisempi onnistumisviesti
    setMessage('')

    // Tyhjennetään aikaisempi virheilmoitus
    setError('')

    try {

      // Lähetetään käyttäjän tiedot backendin signup-reitille
      await axios.post(`${API_URL}/api/users/signup`, {
        username,
        email,
        password
      })

      // Näytetään käyttäjälle onnistumisviesti
      setMessage('Registration succesful!')

      // Tyhjennetään käyttäjänimikenttä
      setUsername('')

      // Tyhjennetään sähköpostikenttä
      setEmail('')

      // Tyhjennetään salasanakenttä
      setPassword('')

      setTimeout(() => {
        if (setPage) {
          setPage('login')
        }
      }, 1500)

    } catch (error) {
      // Tarkistetaan turvallisesti eri vaihtoehdot virheviestille
      const errorMessage =
        error.response?.data?.error?.message ||
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Registration failed.'

      setError(errorMessage)
    }
  }

  return (
    <div className='register-page'>
      <div className='register-card'>
        <h2>Sign up</h2>

        <form onSubmit={handleRegister} className='register-form'>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className='register-input'
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className='register-input'
          />


          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className='register-input'
          />

          <button type="submit" className='btn btn-primary register-submit'>Sign up</button>
        </form>

        {/* Näytetään onnistumisviesti, jos message ei ole tyhjä */}
        {message && <p className='register-success'>{message}</p>}

        {/* Näytetään virheilmoitus, jos error ei ole tyhjä */}
        {error && <p className='register-error'>{error}</p>}
      </div>
    </div>
  )
}

// Viedään Register-komponentti muiden tiedostojen käyttöön
export default Register