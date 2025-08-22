"use client"
import { useState, useEffect } from 'react'

interface TrainingPlan {
  id: string
  trainingName: string
  trainingType: string
  scheduleDate: string
  cost: number
  maxAttendees: number
  remarks?: string
  status: string
  createdAt: string
  createdBy?: string
}

export default function TrainingPage() {
  const [trainings, setTrainings] = useState<TrainingPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewTraining, setShowNewTraining] = useState(false)
  const [newTraining, setNewTraining] = useState({
    trainingName: '',
    trainingType: 'Technical',
    scheduleDate: '',
    cost: '',
    maxAttendees: '',
    remarks: ''
  })

  useEffect(() => {
    fetchTrainings()
  }, [])

  const fetchTrainings = async () => {
    try {
      const response = await fetch('/api/operations/training')
      const data = await response.json()
      setTrainings(data)
    } catch (error) {
      console.error('Failed to fetch training plans:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitTraining = async () => {
    if (!newTraining.trainingName || !newTraining.scheduleDate) {
      alert('Please fill in training name and schedule date')
      return
    }

    try {
      const response = await fetch('/api/operations/training', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newTraining,
          cost: parseFloat(newTraining.cost) || 0,
          maxAttendees: parseInt(newTraining.maxAttendees) || 0
        })
      })

      if (response.ok) {
        const createdTraining = await response.json()
        setTrainings(prevTrainings => [createdTraining, ...prevTrainings])
        setNewTraining({
          trainingName: '',
          trainingType: 'Technical',
          scheduleDate: '',
          cost: '',
          maxAttendees: '',
          remarks: ''
        })
        setShowNewTraining(false)
        alert('Training plan created successfully!')
      } else {
        const error = await response.json()
        alert(`Error: ${error.message}`)
      }
    } catch (error) {
      alert('Failed to create training plan')
    }
  }

  const handleUpdateStatus = async (trainingId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/operations/training/${trainingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        fetchTrainings() // Refresh the list
        alert(`Training status updated to ${newStatus}!`)
      }
    } catch (error) {
      alert('Failed to update training status')
    }
  }

  const trainingTypes = [
    'Technical', 'Safety', 'Compliance', 'Leadership', 'Soft Skills', 
    'Certification', 'On-the-job', 'Workshop', 'Seminar', 'Online'
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return { bg: '#d4edda', color: '#155724', border: '#c3e6cb' }
      case 'Ongoing': return { bg: '#d1ecf1', color: '#0c5460', border: '#bee5eb' }
      case 'Cancelled': return { bg: '#f8d7da', color: '#721c24', border: '#f5c6cb' }
      default: return { bg: '#fff3cd', color: '#856404', border: '#ffeaa7' } // Planned
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED'
    }).format(amount)
  }

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <h1>Loading training plans...</h1>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
          🎓 Training Management
        </h1>
        <p style={{ color: '#666', fontSize: '16px' }}>
          Plan and manage training sessions for your team
        </p>
      </div>

      {/* Create New Training Button */}
      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={() => setShowNewTraining(!showNewTraining)}
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
          {showNewTraining ? '❌ Cancel' : '➕ Plan New Training'}
        </button>
      </div>

      {/* New Training Form */}
      {showNewTraining && (
        <div style={{
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <h3 style={{ marginTop: '0', marginBottom: '20px', fontSize: '20px', fontWeight: 'bold' }}>
            📋 Plan New Training
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
                Training Name *
              </label>
              <input
                type="text"
                value={newTraining.trainingName}
                onChange={(e) => setNewTraining(prev => ({ ...prev, trainingName: e.target.value }))}
                placeholder="e.g., Network Security Fundamentals"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
                Training Type
              </label>
              <select
                value={newTraining.trainingType}
                onChange={(e) => setNewTraining(prev => ({ ...prev, trainingType: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                {trainingTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
                Schedule Date *
              </label>
              <input
                type="datetime-local"
                value={newTraining.scheduleDate}
                onChange={(e) => setNewTraining(prev => ({ ...prev, scheduleDate: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
                Cost (AED)
              </label>
              <input
                type="number"
                value={newTraining.cost}
                onChange={(e) => setNewTraining(prev => ({ ...prev, cost: e.target.value }))}
                placeholder="0"
                min="0"
                step="0.01"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
                Max Attendees
              </label>
              <input
                type="number"
                value={newTraining.maxAttendees}
                onChange={(e) => setNewTraining(prev => ({ ...prev, maxAttendees: e.target.value }))}
                placeholder="0"
                min="1"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
              Remarks
            </label>
            <textarea
              value={newTraining.remarks}
              onChange={(e) => setNewTraining(prev => ({ ...prev, remarks: e.target.value }))}
              placeholder="Additional notes, requirements, or details about the training..."
              rows={3}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '14px',
                resize: 'vertical'
              }}
            />
          </div>

          <button
            onClick={handleSubmitTraining}
            disabled={!newTraining.trainingName || !newTraining.scheduleDate}
            style={{
              backgroundColor: newTraining.trainingName && newTraining.scheduleDate ? '#28a745' : '#6c757d',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: newTraining.trainingName && newTraining.scheduleDate ? 'pointer' : 'not-allowed'
            }}
          >
            ✅ Create Training Plan
          </button>
        </div>
      )}

      {/* Training Plans List */}
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
          📚 Training Plans ({trainings.length})
        </h2>

        {trainings.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            color: '#6c757d'
          }}>
            <h3>No training plans yet</h3>
            <p>Create your first training plan above to get started!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {trainings.map((training) => {
              const statusStyle = getStatusColor(training.status)
              const scheduleDate = new Date(training.scheduleDate)
              const isUpcoming = scheduleDate > new Date()
              const isPast = scheduleDate < new Date()

              return (
                <div key={training.id} style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '20px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start', 
                    marginBottom: '12px' 
                  }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 'bold' }}>
                        {training.trainingName}
                      </h3>
                      <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>
                        <strong>Type:</strong> {training.trainingType} • 
                        <strong> Date:</strong> {scheduleDate.toLocaleDateString()} at {scheduleDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <span style={{
                      backgroundColor: statusStyle.bg,
                      color: statusStyle.color,
                      border: `1px solid ${statusStyle.border}`,
                      padding: '6px 12px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      marginLeft: '16px'
                    }}>
                      {training.status}
                    </span>
                  </div>

                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                    gap: '12px', 
                    marginBottom: '12px' 
                  }}>
                    <div>
                      <strong>Cost:</strong> {formatCurrency(training.cost)}
                    </div>
                    <div>
                      <strong>Max Attendees:</strong> {training.maxAttendees} people
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <strong>Created:</strong> {new Date(training.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {training.remarks && (
                    <div style={{ marginBottom: '12px' }}>
                      <strong>Remarks:</strong> {training.remarks}
                    </div>
                  )}

                  {training.status === 'Planned' && (
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => handleUpdateStatus(training.id, 'Ongoing')}
                        style={{
                          backgroundColor: '#17a2b8',
                          color: 'white',
                          padding: '6px 12px',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}
                      >
                        🚀 Start Training
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(training.id, 'Cancelled')}
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
                        ❌ Cancel
                      </button>
                    </div>
                  )}

                  {training.status === 'Ongoing' && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleUpdateStatus(training.id, 'Completed')}
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
                        ✅ Mark Complete
                      </button>
                    </div>
                  )}

                  {(isUpcoming && training.status === 'Planned') && (
                    <div style={{
                      backgroundColor: '#e7f3ff',
                      border: '1px solid #b3d7ff',
                      borderRadius: '4px',
                      padding: '8px',
                      marginTop: '12px',
                      fontSize: '12px',
                      color: '#0056b3'
                    }}>
                      ⏰ Upcoming training - {Math.ceil((scheduleDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days remaining
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