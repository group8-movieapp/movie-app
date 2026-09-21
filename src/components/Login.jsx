import { useState } from "react"
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

const Login = ({ setPage, setUser }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()
    setError('')

    try {
      const response = await axios.post(`${API_URL}/api/users/login`, {
        email,
        password
      })

      const { token, user } = response.data

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      if (setUser) {
        setUser(user)
        
      }

      if (setPage) {
        setPage('home')
      }

    } catch (err) {
      const errorMessage =
        err.response?.data?.error?.message ||
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Login failed'

      setError(errorMessage)
    }
  }


  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
      </form>

      {error && <p>{error}</p>}

      <p>Don't have a account?{''}</p>
      <button type="button" onClick={() => setPage('register')}>
        Sign up
      </button>
    </div>
  )
}

export default Login