import { useState, useEffect } from 'react'
import axios from 'axios'
import '../styles/GroupDetailView.css' // Tuodaan luodut tyylit

const API_URL = import.meta.env.VITE_API_URL

export default function GroupDetailView({ groupId, user, onBack }) {
  const [group, setGroup] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGroupDetails()
  }, [groupId])

  const fetchGroupDetails = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_URL}/api/groups/${groupId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setGroup(response.data)
    } catch (err) {
      console.error('Failed to fetch group details', err)
      if (err.response?.status === 403) {
        setError('Access denied: You must be a member of this group to view its content.')
      } else {
        setError('Group not found')
      }
    } finally {
      setLoading(false)
    }
  }

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
        <button onClick={onBack} className="btn btn-outline" style={{ marginBottom: '1rem' }}>← Back to Groups</button>
        <div className="error-box">{error}</div>
      </div>
    )
  }

  
const isOwner = user && group && user.id === group.owner_id

  return (
    <div className="group-detail-container">
      <button onClick={onBack} className="btn btn-outline" style={{ marginBottom: '1rem' }}>← Back to Groups</button>
      
      <div className="group-header">
        <h1>{group.name}</h1>
        
        {isOwner && (
          <button onClick={handleDeleteGroup} className="btn btn-danger">
            Delete Group
          </button>
        )}
      </div>

      <div className="group-content">
        <p>Welcome to the group! You have access to this exclusive group page.</p>
      </div>
    </div>
  )
}

//Tämä tiedosto sisältää yksittäisen ryhmän tietojen näyttämiseen liittyvän komponentin.