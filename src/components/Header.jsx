import '../styles/header.css';

export default function Header({ page, setPage, user, onLogout, onDelete }) {
  return (
    <header className='site-header'>
      <div className="site-header-inner">
        <button className="brand" onClick={() => setPage('home')} type="button">
          MovieHub
        </button>

        <nav className="site-nav">
          <button type="button" className={page === 'profile' ? 'nav-link active' : 'nav-link'} onClick={() => setPage('profile')}>
            Profile
          </button>
          <button type="button" className={page === 'groups' ? 'nav-link active' : 'nav-link'} onClick={() => setPage('groups')}>
            Groups
          </button>
          {/* Suosikit näkyy vain kirjautuneelle käyttäjälle */}
          {user && (
            <button type="button" className={page === 'favorites' ? 'nav-link active' : 'nav-link'} onClick={() => setPage('favorites')}>
              ❤️ Favorites
            </button>
        )}



        </nav>

        <div className="site-header-actions">
          {user ? (
            <div className="user-info">
              <span>Signed as {user.username}</span>
              <button type="button" className="btn btn-outline" onClick={onLogout}>
                Sign out
              </button>
              {onDelete && (
                <button type="button" className="btn btn-outline" onClick={onDelete}>
                  Delete account
                </button>
              )}
            </div>
          ) : (
            <>
              <button type="button" className="btn btn-outline" onClick={() => setPage('login')}>
                Sign in
              </button>
              <button type="button" className="btn btn-primary" onClick={() => setPage('register')}>
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}


