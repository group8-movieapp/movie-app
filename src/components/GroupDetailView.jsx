import { useState, useEffect } from 'react'
import axios from 'axios'
import '../styles/GroupDetailView.css'

const API_URL = import.meta.env.VITE_API_URL

export default function GroupDetailView({ groupId, user, onBack }) {
  const [group, setGroup] = useState(null)
  const [members, setMembers] = useState([])
  const [requests, setRequests] = useState([])
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

      // 3. Jos käyttäjä on omistaja, hae odottavat pyynnöt
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
      setError('og in first to view this group')
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

      {/* Liittymisnappi tavalliselle käyttäjälle (jos ei jäsen eikä omistaja) */}
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

      {/* Ryhmän omistajan näkymä: Odottavat pyynnöt */}
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

      {/* Jäsenlista */}
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