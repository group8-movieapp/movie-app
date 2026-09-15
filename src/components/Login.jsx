const Login = ({ setPage }) => {
  return (
    <div>
      <h2>Kirjaudu</h2>

      <form>
        <input
          type="email"
          placeholder="Sähköposti"
        />

        <input
          type="password"
          placeholder="Salasana"
        />

        <button type="submit">Kirjaudu</button>
      </form>

      <p>
        Eikö sinulla ole tiliä?{' '}
        <button type="button" onClick={() => setPage('register')}>
          Rekisteröidy
        </button>
      </p>
    </div>
  )
}

export default Login