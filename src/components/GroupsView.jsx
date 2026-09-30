import { useState, useEffect } from 'react'
import axios from 'axios'
import '../styles/GroupsView.css' // Tuodaan tyylitiedosto

const API_URL = import.meta.env.VITE_API_URL

export default function GroupsView({ user, onSelectGroup }) {
  const [groups, setGroups] = useState([])
  const [newGroupName, setNewGroupName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGroups()
  }, [])

  const fetchGroups = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/groups`)
      setGroups(response.data)
    } catch (err) {
      console.error('Failed to fetch groups', err)
      setError('Could not load groups')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateGroup = async (e) => {
    e.preventDefault()
    if (!newGroupName.trim()) return

    try {
      const token = localStorage.getItem('token')
      await axios.post(
        `${API_URL}/api/groups`,
        { name: newGroupName },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setNewGroupName('')
      fetchGroups()
    } catch (err) {
      console.error('Failed to create group', err)
      setError(err.response?.data?.error || 'Failed to create group')
    }
  }

  if (loading) return <div className="loading">Loading groups...</div>

  return (
    <div className="groups-container">
      <h2>Movie Groups</h2>
      {error && <div className="error-message">{error}</div>}

      {user ? (
        <form onSubmit={handleCreateGroup} className="create-group-form">
          <input 
            type="text" 
            placeholder="New group name..." 
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Create Group</button>
        </form>
      ) : (
        <p className="login-prompt">Log in to create a new group.</p>
      )}

      <div className="groups-list">
        {groups.length === 0 ? (
          <p>No groups created yet.</p>
        ) : (
          groups.map((group) => (
            <div 
              key={group.id} 
              className="group-card" 
              onClick={() => onSelectGroup(group.id)}
            >
              <h3>{group.name}</h3>
              <span>View Group →</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

//Tämä tiedosto sisältää ryhmien listauksen ja luomisen komponentin. 