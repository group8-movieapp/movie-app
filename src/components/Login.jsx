import { useState } from "react"
import axios from 'axios'
import '../styles/login.css'

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
    <div className="login-page">
      <div className="login-card">
        <h2>Login</h2>

        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />

          <button type="submit" className="btn btn-primary login-submit">Login</button>
        </form>

        {error && <p className="login-error">{error}</p>}

        <p className="login-signup-prompt">Don't have an account?</p>
        <button type="button" className="btn btn-outline login-signup-btn" onClick={() => setPage('register')}>
          Sign up
        </button>
      </div>
    </div>
  )
}

export default Login
