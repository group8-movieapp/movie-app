//Käyttäjän rekisteröityminen tietokantaan ja kirjautuminen tietokannasta löytyvän käyttäjän perusteella.

// Importataan useState-hook Reactista
import { useState } from 'react'

// Importataan axios-kirjasto HTTP-pyyntöjä varten
import axios from 'axios'

// Haetaan backendin osoite ympäristömuuttujasta
const API_URL = import.meta.env.VITE_API_URL

// Luodaan Register-komponentti
const Register = () => {

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
      setMessage('Rekisteröityminen onnistui!')

      // Tyhjennetään käyttäjänimikenttä
      setUsername('')

      // Tyhjennetään sähköpostikenttä
      setEmail('')

      // Tyhjennetään salasanakenttä
      setPassword('')

    } catch (error) {

      // Näytetään backendiltä tullut virheilmoitus
      // Jos virheilmoitusta ei saada, näytetään oletusviesti
      setError(
        error.response?.data?.error ||
        'Rekisteröityminen epäonnistui.'
      )
    }
  }

  return (
    <div>
      <h2>Rekisteröidy</h2>

      {/* Rekisteröitymislomake */}
      <form onSubmit={handleRegister}>

        {/* Käyttäjänimikenttä */}
        <input
          type="text"
          placeholder="Käyttäjänimi"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />

        {/* Sähköpostikenttä */}
        <input
          type="email"
          placeholder="Sähköposti"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        {/* Salasanakenttä */}
        <input
          type="password"
          placeholder="Salasana"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        {/* Lomakkeen lähetyspainike */}
        <button type="submit">Rekisteröidy</button>
      </form>

      {/* Näytetään onnistumisviesti, jos message ei ole tyhjä */}
      {message && <p>{message}</p>}

      {/* Näytetään virheilmoitus, jos error ei ole tyhjä */}
      {error && <p>{error}</p>}
    </div>
  )
}

// Viedään Register-komponentti muiden tiedostojen käyttöön
export default Register