import '../styles/profile.css'

export default function Profile({ user, setPage, onDelete }) {
    if (!user) {
        return (
            <div className="profile-section">
                <h2>Profile</h2>
                <p>You need to be logged in to view your profile.</p>
                <button type="button" className="btn btn-primary" onClick={() => setPage('login')}>
                    Sign in
                </button>
            </div>
        )
    }

    return (
    <div className="profile-section">
      <h2>Profile</h2>

      <div className="profile-card">
        <div className="profile-avatar">
          {user.username.charAt(0).toUpperCase()}
        </div>

        <div className="profile-details">
          <p className="profile-username">{user.username}</p>
          <p className="profile-email">{user.email}</p>
        </div>
        <button type="button" className="btn btn-danger profile-delete-btn" onClick={onDelete}>
          Delete account
        </button>
      </div>
    </div>
  )
}