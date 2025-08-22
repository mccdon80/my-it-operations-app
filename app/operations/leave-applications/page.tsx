"use client"

import { useState, useEffect } from 'react'

interface LeaveApplication {
  id: string
  leaveType: string
  startDate: string
  endDate: string
  daysCount: number
  reason?: string
  status: string
  createdAt: string
  approvalDate?: string
  approvedBy?: string
}

export default function LeaveApplicationsPage() {
  const [leaves, setLeaves] = useState<LeaveApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewLeave, setShowNewLeave] = useState(false)
  const [newLeave, setNewLeave] = useState({
    leaveType: 'Vacation',
    startDate: '',
    endDate: '',
    reason: ''
  })

  useEffect(() => {
    fetchLeaves()
  }, [])

  const fetchLeaves = async () => {
    try {
      const response = await fetch('/api/operations/leave-applications')
      const data = await response.json()
      setLeaves(data)
    } catch (error) {
      console.error('Failed to fetch leaves:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitLeave = async () => {
    try {
      const response = await fetch('/api/operations/leave-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLeave)
      })

      if (response.ok) {
        const createdLeave = await response.json()
        setLeaves(prevLeaves => [createdLeave, ...prevLeaves])
        setNewLeave({ leaveType: 'Vacation', startDate: '', endDate: '', reason: '' })
        setShowNewLeave(false)
        alert('Leave application submitted successfully!')
      } else {
        const error = await response.json()
        alert(`Error: ${error.message}`)
      }
    } catch (error) {
      alert('Failed to submit leave application')
    }
  }

  const handleApproveLeave = async (leaveId: string, action: 'Approved' | 'Rejected') => {
    try {
      const response = await fetch(`/api/operations/leave-applications/${leaveId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action })
      })

      if (response.ok) {
        fetchLeaves() // Refresh the list
        alert(`Leave application ${action.toLowerCase()} successfully!`)
      }
    } catch (error) {
      alert('Failed to update leave application')
    }
  }

  const leaveTypes = ['Vacation', 'Sick', 'Personal', 'Emergency', 'Maternity', 'Paternity']

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return { bg: '#d4edda', color: '#155724', border: '#c3e6cb' }
      case 'Rejected': return { bg: '#f8d7da', color: '#721c24', border: '#f5c6cb' }
      default: return { bg: '#fff3cd', color: '#856404', border: '#ffeaa7' }
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <h1>Loading leave applications...</h1>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
          🏖️ Leave Applications
        </h1>
        <p style={{ color: '#666', fontSize: '16px' }}>
          Submit and manage leave requests with approval workflows
        </p>
      </div>

      {/* Apply for Leave Button */}
      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={() => setShowNewLeave(!showNewLeave)}
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
          {showNewLeave ? '✖️ Cancel' : '📝 Apply for Leave'}
        </button>
      </div>

      {/* New Leave Form */}
      {showNewLeave && (
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          border: '1px solid #e9ecef', 
          borderRadius: '8px', 
          padding: '24px', 
          marginBottom: '24px' 
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
            📝 New Leave Application
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>
                Leave Type *
              </label>
              <select
                value={newLeave.leaveType}
                onChange={(e) => setNewLeave({...newLeave, leaveType: e.target.value})}
                style={{ 
                  width: '100%', 
                  padding: '8px 12px', 
                  border: '1px solid #ddd', 
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                {leaveTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>
                Start Date *
              </label>
              <input
                type="date"
                value={newLeave.startDate}
                onChange={(e) => setNewLeave({...newLeave, startDate: e.target.value})}
                style={{ 
                  width: '100%', 
                  padding: '8px 12px', 
                  border: '1px solid #ddd', 
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>
                End Date *
              </label>
              <input
                type="date"
                value={newLeave.endDate}
                onChange={(e) => setNewLeave({...newLeave, endDate: e.target.value})}
                style={{ 
                  width: '100%', 
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
              Reason
            </label>
            <textarea
              value={newLeave.reason}
              onChange={(e) => setNewLeave({...newLeave, reason: e.target.value})}
              placeholder="Reason for leave (optional)"
              rows={3}
              style={{ 
                width: '100%', 
                padding: '8px 12px', 
                border: '1px solid #ddd', 
                borderRadius: '4px',
                fontSize: '14px',
                resize: 'vertical'
              }}
            />
          </div>
          
          <button
            onClick={handleSubmitLeave}
            disabled={!newLeave.startDate || !newLeave.endDate}
            style={{
              backgroundColor: newLeave.startDate && newLeave.endDate ? '#28a745' : '#6c757d',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: newLeave.startDate && newLeave.endDate ? 'pointer' : 'not-allowed'
            }}
          >
            ✅ Submit Leave Request
          </button>
        </div>
      )}

      {/* Leave Applications List */}
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
          📋 Leave Applications ({leaves.length})
        </h2>
        
        {leaves.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '8px',
            color: '#6c757d'
          }}>
            <h3>No leave applications yet</h3>
            <p>Submit your first leave application above to get started!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {leaves.map((leave) => {
              const statusStyle = getStatusColor(leave.status)
              const startDate = new Date(leave.startDate).toLocaleDateString()
              const endDate = new Date(leave.endDate).toLocaleDateString()
              
              return (
                <div key={leave.id} style={{ 
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px', 
                  padding: '20px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 'bold' }}>
                        {leave.leaveType} Leave
                      </h3>
                      <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>
                        {startDate} to {endDate} ({leave.daysCount} day{leave.daysCount !== 1 ? 's' : ''})
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
                      {leave.status}
                    </span>
                  </div>
                  
                  {leave.reason && (
                    <div style={{ marginBottom: '12px' }}>
                      <strong>Reason:</strong> {leave.reason}
                    </div>
                  )}
                  
                  <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '12px' }}>
                    Applied: {new Date(leave.createdAt).toLocaleDateString()}
                    {leave.approvedBy && (
                      <span> • Processed: {new Date(leave.approvalDate!).toLocaleDateString()}</span>
                    )}
                  </div>
                  
                  {leave.status === 'Pending' && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleApproveLeave(leave.id, 'Approved')}
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
                        ✅ Approve
                      </button>
                      <button
                        onClick={() => handleApproveLeave(leave.id, 'Rejected')}
                        style={{
                          backgroundColor: '#dc3545',
                          color: 'white',
                          padding: '6px 12px',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}
                      >
                        ❌ Reject
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}