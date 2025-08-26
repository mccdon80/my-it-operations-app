"use client"

import { useState, useEffect } from 'react'

interface Meeting {
  id: string
  title: string
  meetingDate: string
  location?: string
  organizerId: string
  minutesContent?: string
  status: string
  createdAt: string
  attendees: MeetingAttendee[]
  actionItems: ActionItem[]
}

interface MeetingAttendee {
  id: string
  userId: string
  attendanceStatus: string
}

interface ActionItem {
  id: string
  description: string
  assignedTo?: string
  dueDate?: string
  status: string
  priority: string
}

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewMeeting, setShowNewMeeting] = useState(false)
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null)
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    meetingDate: '',
    location: '',
    minutesContent: ''
  })

  useEffect(() => {
    fetchMeetings()
    fetchUsers()
  }, [])

  const fetchMeetings = async () => {
    try {
      const response = await fetch('/api/operations/meetings')
      const data = await response.json()
      setMeetings(data)
    } catch (error) {
      console.error('Failed to fetch meetings:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Failed to fetch users:', error)
    }
  }

  const handleCreateMeeting = async () => {
    try {
      const response = await fetch('/api/operations/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMeeting)
      })

      if (response.ok) {
        const createdMeeting = await response.json()
        setMeetings(prev => [createdMeeting, ...prev])
        setNewMeeting({ title: '', meetingDate: '', location: '', minutesContent: '' })
        setShowNewMeeting(false)
        alert('Meeting created successfully!')
      } else {
        const error = await response.json()
        alert(`Error: ${error.message}`)
      }
    } catch (error) {
      alert('Failed to create meeting')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Final': return { bg: '#d4edda', color: '#155724', border: '#c3e6cb' }
      case 'Draft': return { bg: '#fff3cd', color: '#856404', border: '#ffeaa7' }
      default: return { bg: '#f8f9fa', color: '#6c757d', border: '#dee2e6' }
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return { bg: '#f8d7da', color: '#721c24' }
      case 'High': return { bg: '#ffeaa7', color: '#856404' }
      case 'Medium': return { bg: '#cce7ff', color: '#004085' }
      case 'Low': return { bg: '#d4edda', color: '#155724' }
      default: return { bg: '#f8f9fa', color: '#6c757d' }
    }
  }

/*   if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <h1>Loading meetings...</h1>
      </div>
    )
  } */

  return (
    <div style={{ padding: '24px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
          📝 Meeting Minutes
        </h1>
        <p style={{ color: '#666', fontSize: '16px' }}>
          Record meetings, track attendees, and manage action items
        </p>
      </div>

      {/* New Meeting Button */}
      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={() => setShowNewMeeting(!showNewMeeting)}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          {showNewMeeting ? '✖️ Cancel' : '📅 Schedule New Meeting'}
        </button>
      </div>

      {/* New Meeting Form */}
      {showNewMeeting && (
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          border: '1px solid #e9ecef', 
          borderRadius: '8px', 
          padding: '24px', 
          marginBottom: '24px' 
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
            📅 Schedule New Meeting
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>
                Meeting Title *
              </label>
              <input
                type="text"
                value={newMeeting.title}
                onChange={(e) => setNewMeeting({...newMeeting, title: e.target.value})}
                placeholder="Weekly IT Team Meeting"
                style={{ 
                  width: '95%', 
                  padding: '8px 12px', 
                  border: '1px solid #ddd', 
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>
                Date & Time *
              </label>
              <input
                type="datetime-local"
                value={newMeeting.meetingDate}
                onChange={(e) => setNewMeeting({...newMeeting, meetingDate: e.target.value})}
                style={{ 
                  width: '95%', 
                  padding: '8px 12px', 
                  border: '1px solid #ddd', 
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>
                Location
              </label>
              <input
                type="text"
                value={newMeeting.location}
                onChange={(e) => setNewMeeting({...newMeeting, location: e.target.value})}
                placeholder="Conference Room A / Online"
                style={{ 
                  width: '93%', 
                  padding: '8px 12px', 
                  border: '1px solid #ddd', 
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>
              Meeting Minutes / Agenda
            </label>
            <textarea
              value={newMeeting.minutesContent}
              onChange={(e) => setNewMeeting({...newMeeting, minutesContent: e.target.value})}
              placeholder="Meeting agenda, discussion points, decisions made..."
              rows={6}
              style={{ 
                width: '98%', 
                padding: '8px 12px', 
                border: '1px solid #ddd', 
                borderRadius: '4px',
                fontSize: '14px',
                resize: 'vertical'
              }}
            />
          </div>
          
          <button
            onClick={handleCreateMeeting}
            disabled={!newMeeting.title || !newMeeting.meetingDate}
            style={{
              backgroundColor: newMeeting.title && newMeeting.meetingDate ? '#28a745' : '#6c757d',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: newMeeting.title && newMeeting.meetingDate ? 'pointer' : 'not-allowed'
            }}
          >
            ✅ Create Meeting
          </button>
        </div>
      )}

      {/* Meetings List */}
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
          📋 Meeting History ({meetings.length})
        </h2>
        
        {meetings.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '8px',
            color: '#6c757d'
          }}>
            <h3>No meetings yet</h3>
            <p>Schedule your first meeting above to get started!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {meetings.map((meeting) => {
              const statusStyle = getStatusColor(meeting.status)
              const meetingDate = new Date(meeting.meetingDate)
              
              return (
                <div key={meeting.id} style={{ 
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px', 
                  padding: '20px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  {/* Meeting Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <h3 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: 'bold' }}>
                        {meeting.title}
                      </h3>
                      <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>
                        📅 {meetingDate.toLocaleDateString()} at {meetingDate.toLocaleTimeString()}
                        {meeting.location && ` • 📍 ${meeting.location}`}
                      </p>
                    </div>
                    <span style={{ 
                      backgroundColor: statusStyle.bg,
                      color: statusStyle.color,
                      border: `1px solid ${statusStyle.border}`,
                      padding: '6px 12px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {meeting.status}
                    </span>
                  </div>
                  
                  {/* Meeting Content */}
                  {meeting.minutesContent && (
                    <div style={{ 
                      backgroundColor: '#f8f9fa', 
                      padding: '12px', 
                      borderRadius: '4px', 
                      marginBottom: '16px',
                      fontSize: '14px',
                      lineHeight: '1.5'
                    }}>
                      <strong>Meeting Minutes:</strong><br/>
                      {meeting.minutesContent.split('\n').map((line, index) => (
                        <div key={index}>{line}</div>
                      ))}
                    </div>
                  )}
                  
                  {/* Action Items */}
                  {meeting.actionItems && meeting.actionItems.length > 0 && (
                    <div style={{ marginBottom: '16px' }}>
                      <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>
                        🎯 Action Items ({meeting.actionItems.length})
                      </h4>
                      <div style={{ display: 'grid', gap: '8px' }}>
                        {meeting.actionItems.map((item) => {
                          const priorityStyle = getPriorityColor(item.priority)
                          const dueDate = item.dueDate ? new Date(item.dueDate).toLocaleDateString() : 'No due date'
                          
                          return (
                            <div key={item.id} style={{ 
                              backgroundColor: '#fff', 
                              border: '1px solid #e9ecef', 
                              borderRadius: '4px', 
                              padding: '12px',
                              fontSize: '14px'
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                                <span style={{ fontWeight: 'bold' }}>{item.description}</span>
                                <span style={{ 
                                  backgroundColor: priorityStyle.bg,
                                  color: priorityStyle.color,
                                  padding: '2px 6px',
                                  borderRadius: '3px',
                                  fontSize: '11px',
                                  fontWeight: 'bold'
                                }}>
                                  {item.priority}
                                </span>
                              </div>
                              <div style={{ color: '#666', fontSize: '12px' }}>
                                <span>Due: {dueDate}</span>
                                {item.assignedTo && <span> • Assigned to: User {item.assignedTo}</span>}
                                <span> • Status: {item.status}</span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                  
                  {/* Meeting Actions */}
                  <div style={{ display: 'flex', gap: '8px', fontSize: '12px' }}>
                    <button
                      onClick={() => setSelectedMeeting(meeting)}
                      style={{
                        backgroundColor: '#007bff',
                        color: 'white',
                        padding: '6px 12px',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      📋 View Details
                    </button>
                    <button
                      style={{
                        backgroundColor: '#28a745',
                        color: 'white',
                        padding: '6px 12px',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      ✅ Add Action Item
                    </button>
                    <button
                      style={{
                        backgroundColor: '#6c757d',
                        color: 'white',
                        padding: '6px 12px',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      👥 Manage Attendees
                    </button>
                  </div>
                  
                  <div style={{ fontSize: '12px', color: '#6c757d', marginTop: '12px' }}>
                    Created: {new Date(meeting.createdAt).toLocaleDateString()}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Quick Tips */}
      <div style={{ 
        backgroundColor: '#e7f3ff', 
        border: '1px solid #b3d9ff', 
        borderRadius: '8px', 
        padding: '16px',
        marginTop: '24px'
      }}>
        <h3 style={{ margin: '0 0 8px 0', color: '#0066cc' }}>💡 Meeting Tips:</h3>
        <ul style={{ margin: 0, paddingLeft: '20px', color: '#004499', fontSize: '14px' }}>
          <li>Schedule meetings in advance with clear agendas</li>
          <li>Record key decisions and discussion points</li>
          <li>Assign specific action items with due dates</li>
          <li>Mark meetings as "Final" when minutes are approved</li>
          <li>Follow up on action items in subsequent meetings</li>
        </ul>
      </div>
    </div>
  )
}