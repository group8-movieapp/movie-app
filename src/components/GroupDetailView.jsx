import { useState, useEffect } from 'react'
import axios from 'axios'
import MovieCard from './MovieCard'
import '../styles/GroupDetailView.css'

const API_URL = import.meta.env.VITE_API_URL

export default function GroupDetailView({ groupId, user, onBack, onSelectMovie }) {
  const [group, setGroup] = useState(null)
  const [members, setMembers] = useState([])
  const [requests, setRequests] = useState([])
  const [movies, setMovies] = useState([])
  
  // Tilat elokuvahaulle
  const [searchQuery, setSearchQuery] = useState('')
  const [movieResults, setMovieResults] = useState([])

  const [hasRequested, setHasRequested] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGroupDetails()
  }, [groupId, user])

  const fetchGroupDetails = async () => {
    try {
      const token = localStorage.getItem('token')
      const headers = token ? { Authorization: `Bearer ${token}` } : {}

      // 1. Hae ryhmän tiedot
      const response = await axios.get(`${API_URL}/api/groups/${groupId}`, { headers })
      setGroup(response.data)

      // 2. Hae hyväksytyt jäsenet
      const membersRes = await axios.get(`${API_URL}/api/groups/${groupId}/members`, { headers })
      setMembers(membersRes.data)

      // 3. Hae ryhmän elokuvat ja rikastuta ne tarvittaessa TMDB-tiedoilla
      try {
        const moviesRes = await axios.get(`${API_URL}/api/groups/${groupId}/movies`, { headers })
        const rawMovies = moviesRes.data

        // Haetaan elokuville tarkemmat tiedot (poster_path, title jne.) jos niitä ei tule suoraan ryhmän elokuvista
        const detailedMovies = await Promise.all(
          rawMovies.map(async (item) => {
            // Jos backend palauttaa jo tarvittavat tiedot tai pelkän movie_id:n
            const movieId = item.movie_id || item.id
            try {
              const movieRes = await axios.get(`${API_URL}/api/movies/${movieId}`)
              return { ...item, ...movieRes.data, id: movieId }
            } catch (err) {
              return { ...item, id: movieId, title: item.title || `Movie ID: ${movieId}` }
            }
          })
        )
        setMovies(detailedMovies)
      } catch (movieErr) {
        console.error('Could not fetch movies (might not be a member yet)', movieErr)
      }

      // 4. Jos käyttäjä on omistaja, hae odottavat pyynnöt
      if (user && response.data.owner_id === user.id) {
        try {
          const reqResponse = await axios.get(`${API_URL}/api/groups/${groupId}/requests`, { headers })
          setRequests(reqResponse.data)
        } catch (reqErr) {
          console.error('Failed to fetch requests', reqErr)
        }
      }
    } catch (err) {
      console.error('Failed to fetch group details', err)
      setError('Log in first to view this group')
    } finally {
      setLoading(false)
    }
  }

  // Lähetä liittymispyyntö ryhmään
  const handleSendRequest = async () => {
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${API_URL}/api/groups/${groupId}/join`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setHasRequested(true)
      alert('Join request sent successfully!')
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to send join request')
    }
  }

  // Hyväksy liittymispyyntö (omistaja)
  const handleAccept = async (userId) => {
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${API_URL}/api/groups/${groupId}/requests/${userId}/accept`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchGroupDetails()
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to accept request')
    }
  }

  // Hylkää liittymispyyntö (omistaja)
  const handleReject = async (userId) => {
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${API_URL}/api/groups/${groupId}/requests/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchGroupDetails()
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to reject request')
    }
  }

  // Poista jäsen tai poistu ryhmästä
  const handleRemoveMember = async (targetUserId) => {
    const isSelf = user.id === targetUserId
    const confirmMsg = isSelf ? 'Are you sure you want to leave this group?' : 'Are you sure you want to remove this member?'
    
    if (!window.confirm(confirmMsg)) return

    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${API_URL}/api/groups/${groupId}/members/${targetUserId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (isSelf) {
        onBack()
      } else {
        fetchGroupDetails()
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to remove member')
    }
  }

  // Poista koko ryhmä (omistaja)
  const handleDeleteGroup = async () => {
    if (!window.confirm('Are you sure you want to delete this group?')) return

    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${API_URL}/api/groups/${groupId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      onBack()
    } catch (err) {
      console.error('Failed to delete group', err)
      setError(err.response?.data?.error || 'Failed to delete group')
    }
  }

  // Hae elokuvia nimellä oikeaa reittiä käyttäen
  const handleSearchMovies = async () => {
    if (!searchQuery.trim()) return
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${API_URL}/api/movies/search?query=${encodeURIComponent(searchQuery)}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMovieResults(res.data)
    } catch (err) {
      console.error('Search error:', err)
      alert('Failed to search movies')
    }
  }

  // Lisää valittu elokuva ryhmään haun kautta
  const handleAddMovieFromSearch = async (movie) => {
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${API_URL}/api/groups/${groupId}/movies`, 
        { movieId: parseInt(movie.id) }, 
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      setMovies(prev => [...prev, movie])
      setMovieResults([])
      setSearchQuery('')
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add movie')
    }
  }

  // Poista elokuva ryhmästä (jos teillä on tämä ominaisuus)
  const handleRemoveMovieFromGroup = async (movieId) => {
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${API_URL}/api/groups/${groupId}/movies/${movieId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMovies(prev => prev.filter(m => (m.movie_id || m.id) !== movieId))
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to remove movie from group')
    }
  }

  if (loading) return <div className="loading">Loading group...</div>

  if (error) {
    return (
      <div className="group-error-container">
        <button onClick={onBack} className="btn btn-outline">← Back to Groups</button>
        <div className="error-box">{error}</div>
      </div>
    )
  }

  const isOwner = user && group && user.id === group.owner_id
  const isMember = members.some(m => m.id === user?.id)

  return (
    <div className="group-detail-container">
      <button onClick={onBack} className="btn btn-outline">← Back to Groups</button>
      
      <div className="group-header">
        <h1>{group.name}</h1>
        
        {isOwner && (
          <button onClick={handleDeleteGroup} className="btn btn-danger">
            Delete Group
          </button>
        )}
      </div>

      {user && !isOwner && !isMember && (
        <div className="join-section">
          {hasRequested ? (
            <p className="status-pending">Join request pending approval...</p>
          ) : (
            <button onClick={handleSendRequest} className="btn btn-primary">
              Request to Join Group
            </button>
          )}
        </div>
      )}

      {isOwner && (
        <div className="owner-requests-section">
          <h3>Pending Join Requests</h3>
          {requests.length === 0 ? (
            <p className="no-requests">No pending requests.</p>
          ) : (
            <ul className="request-list">
              {requests.map(req => (
                <li key={req.user_id} className="request-item">
                  <span className="request-username">{req.username}</span>
                  <div className="request-actions">
                    <button onClick={() => handleAccept(req.user_id)} className="btn btn-success">
                      Accept
                    </button>
                    <button onClick={() => handleReject(req.user_id)} className="btn btn-reject">
                      Reject
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Elokuvat-osio */}
      {(isMember || isOwner) && (
        <div className="movies-section">
          <h3>Group Movies ({movies.length})</h3>
          
          <div className="movie-search-box">
            <div className="movie-search-input-group">
              <input 
                type="text" 
                placeholder="Search movie by name..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button onClick={handleSearchMovies} className="btn btn-primary">Search</button>
            </div>

            {movieResults.length > 0 && (
              <ul className="search-results-list">
                {movieResults.map(movie => (
                  <li key={movie.id} className="search-result-item">
                    <span>{movie.title || movie.name}</span>
                    <button 
                      onClick={() => handleAddMovieFromSearch(movie)} 
                      className="btn btn-success btn-sm"
                    >
                      Add to Group
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Elokuvagridi MovieCard-komponentilla */}
          <div className="movie-grid">
            {movies.length === 0 ? (
              <p className="no-movies-text">No movies added to this group yet.</p>
            ) : (
              movies.map(movie => {
                const mId = movie.movie_id || movie.id
                return (
                  <div key={mId} className="group-movie-card-wrapper">
                    <MovieCard
                      movie={movie}
                      onClick={() => onSelectMovie?.(movie)}
                    />
                    {isOwner && (
                      <button 
                        onClick={() => handleRemoveMovieFromGroup(mId)} 
                        className="btn btn-danger btn-sm watchlist-remove-btn"
                        style={{ marginTop: '8px', width: '100%' }}
                      >
                        Remove from Group
                      </button>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}

      <div className="members-section">
        <h3>Members ({members.length})</h3>
        <ul className="member-list">
          {members.map(member => (
            <li key={member.id} className="member-item">
              <span className="member-username">
                {member.username} {member.id === group.owner_id && '(Owner)'}
              </span>
              
              {user && (isOwner ? member.id !== group.owner_id : user.id === member.id) && (
                <button 
                  onClick={() => handleRemoveMember(member.id)} 
                  className="btn btn-danger btn-sm"
                >
                  {user.id === member.id ? 'Leave Group' : 'Remove'}
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}