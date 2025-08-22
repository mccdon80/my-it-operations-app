"use client"
import { useState, useEffect } from 'react'

interface AttendanceRecord {
  id: string
  userId: string
  userName?: string
  attendanceDate: string
  checkInTime?: string
  checkOutTime?: string
  status: string
  remarks?: string
  createdAt: string
  totalHours?: number
}

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  department?: string
}

export default function TeamAttendancePage() {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showMarkAttendance, setShowMarkAttendance] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [newAttendance, setNewAttendance] = useState({
    userId: '',
    attendanceDate: new Date().toISOString().split('T')[0],
    status: 'Present',
    checkInTime: '',
    checkOutTime: '',
    remarks: ''
  })

  useEffect(() => {
    fetchAttendanceRecords()
    fetchUsers()
  }, [selectedDate])

  const fetchAttendanceRecords = async () => {
    try {
      const response = await fetch(`/api/operations/attendance?date=${selectedDate}`)
      const data = await response.json()
      setAttendanceRecords(data)
    } catch (error) {
      console.error('Failed to fetch attendance records:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Failed to fetch users:', error)
    }
  }

  const handleMarkAttendance = async () => {
    if (!newAttendance.userId) {
      alert('Please select a team member')
      return
    }

    try {
      const response = await fetch('/api/operations/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAttendance)
      })

      if (response.ok) {
        const createdAttendance = await response.json()
        setAttendanceRecords(prevRecords => [createdAttendance, ...prevRecords])
        setNewAttendance({
          userId: '',
          attendanceDate: new Date().toISOString().split('T')[0],
          status: 'Present',
          checkInTime: '',
          checkOutTime: '',
          remarks: ''
        })
        setShowMarkAttendance(false)
        alert('Attendance marked successfully!')
      } else {
        const error = await response.json()
        alert(`Error: ${error.message}`)
      }
    } catch (error) {
      alert('Failed to mark attendance')
    }
  }

  const handleQuickCheckIn = async (userId: string) => {
    const now = new Date()
    const timeString = now.toTimeString().slice(0, 5) // HH:MM format
    
    try {
      const response = await fetch('/api/operations/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          attendanceDate: new Date().toISOString().split('T')[0],
          status: 'Present',
          checkInTime: timeString,
          remarks: 'Quick check-in'
        })
      })

      if (response.ok) {
        fetchAttendanceRecords()
        alert('Check-in recorded successfully!')
      }
    } catch (error) {
      alert('Failed to record check-in')
    }
  }

  const handleQuickCheckOut = async (attendanceId: string) => {
    const now = new Date()
    const timeString = now.toTimeString().slice(0, 5) // HH:MM format
    
    try {
      const response = await fetch(`/api/operations/attendance/${attendanceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checkOutTime: timeString
        })
      })

      if (response.ok) {
        fetchAttendanceRecords()
        alert('Check-out recorded successfully!')
      }
    } catch (error) {
      alert('Failed to record check-out')
    }
  }

  const handleUpdateStatus = async (attendanceId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/operations/attendance/${attendanceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        fetchAttendanceRecords()
        alert('Attendance status updated!')
      }
    } catch (error) {
      alert('Failed to update attendance status')
    }
  }

  const attendanceStatuses = ['Present', 'Absent', 'Half Day', 'Remote', 'Sick Leave', 'On Leave']

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Present': return { bg: '#d4edda', color: '#155724', border: '#c3e6cb' }
      case 'Remote': return { bg: '#d1ecf1', color: '#0c5460', border: '#bee5eb' }
      case 'Half Day': return { bg: '#fff3cd', color: '#856404', border: '#ffeaa7' }
      case 'Absent': return { bg: '#f8d7da', color: '#721c24', border: '#f5c6cb' }
      case 'Sick Leave': return { bg: '#f0d0ff', color: '#6f2dbd', border: '#e2aaff' }
      case 'On Leave': return { bg: '#e2e3e5', color: '#495057', border: '#ced4da' }
      default: return { bg: '#f8f9fa', color: '#495057', border: '#dee2e6' }
    }
  }

  const calculateHours = (checkIn: string, checkOut: string) => {
    if (!checkIn || !checkOut) return 0
    
    const [inHour, inMin] = checkIn.split(':').map(Number)
    const [outHour, outMin] = checkOut.split(':').map(Number)
    
    const inMinutes = inHour * 60 + inMin
    const outMinutes = outHour * 60 + outMin
    
    return ((outMinutes - inMinutes) / 60).toFixed(1)
  }

  const getAttendanceStats = () => {
    const total = attendanceRecords.length
    const present = attendanceRecords.filter(r => r.status === 'Present' || r.status === 'Remote').length
    const absent = attendanceRecords.filter(r => r.status === 'Absent').length
    const onLeave = attendanceRecords.filter(r => r.status === 'On Leave' || r.status === 'Sick Leave').length
    
    return { total, present, absent, onLeave }
  }

  const stats = getAttendanceStats()

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <h1>Loading attendance records...</h1>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
          👥 Team Attendance
        </h1>
        <p style={{ color: '#666', fontSize: '16px' }}>
          Track daily attendance, check-in/out times, and work status
        </p>
      </div>

      {/* Date Selector & Quick Stats */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'auto 1fr', 
        gap: '20px', 
        marginBottom: '24px',
        alignItems: 'center'
      }}>
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
            Select Date:
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '12px' 
        }}>
          <div style={{ 
            backgroundColor: '#e7f3ff', 
            padding: '12px', 
            borderRadius: '6px', 
            textAlign: 'center' 
          }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#0056b3' }}>{stats.total}</div>
            <div style={{ fontSize: '12px', color: '#0056b3' }}>Total Records</div>
          </div>
          <div style={{ 
            backgroundColor: '#d4edda', 
            padding: '12px', 
            borderRadius: '6px', 
            textAlign: 'center' 
          }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#155724' }}>{stats.present}</div>
            <div style={{ fontSize: '12px', color: '#155724' }}>Present/Remote</div>
          </div>
          <div style={{ 
            backgroundColor: '#f8d7da', 
            padding: '12px', 
            borderRadius: '6px', 
            textAlign: 'center' 
          }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#721c24' }}>{stats.absent}</div>
            <div style={{ fontSize: '12px', color: '#721c24' }}>Absent</div>
          </div>
          <div style={{ 
            backgroundColor: '#e2e3e5', 
            padding: '12px', 
            borderRadius: '6px', 
            textAlign: 'center' 
          }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#495057' }}>{stats.onLeave}</div>
            <div style={{ fontSize: '12px', color: '#495057' }}>On Leave</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setShowMarkAttendance(!showMarkAttendance)}
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
          {showMarkAttendance ? '❌ Cancel' : '✅ Mark Attendance'}
        </button>

        <button
          onClick={() => fetchAttendanceRecords()}
          style={{
            backgroundColor: '#28a745',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          🔄 Refresh
        </button>
      </div>

      {/* Mark Attendance Form */}
      {showMarkAttendance && (
        <div style={{
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <h3 style={{ marginTop: '0', marginBottom: '20px', fontSize: '20px', fontWeight: 'bold' }}>
            📝 Mark Attendance
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
                Team Member *
              </label>
              <select
                value={newAttendance.userId}
                onChange={(e) => setNewAttendance(prev => ({ ...prev, userId: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                <option value="">Select a team member...</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.firstName} {user.lastName} - {user.department || 'IT'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
                Date
              </label>
              <input
                type="date"
                value={newAttendance.attendanceDate}
                onChange={(e) => setNewAttendance(prev => ({ ...prev, attendanceDate: e.target.value }))}
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
                Status
              </label>
              <select
                value={newAttendance.status}
                onChange={(e) => setNewAttendance(prev => ({ ...prev, status: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                {attendanceStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
                Check-in Time
              </label>
              <input
                type="time"
                value={newAttendance.checkInTime}
                onChange={(e) => setNewAttendance(prev => ({ ...prev, checkInTime: e.target.value }))}
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
                Check-out Time
              </label>
              <input
                type="time"
                value={newAttendance.checkOutTime}
                onChange={(e) => setNewAttendance(prev => ({ ...prev, checkOutTime: e.target.value }))}
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
              value={newAttendance.remarks}
              onChange={(e) => setNewAttendance(prev => ({ ...prev, remarks: e.target.value }))}
              placeholder="Optional notes about attendance..."
              rows={2}
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
            onClick={handleMarkAttendance}
            disabled={!newAttendance.userId}
            style={{
              backgroundColor: newAttendance.userId ? '#28a745' : '#6c757d',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: newAttendance.userId ? 'pointer' : 'not-allowed'
            }}
          >
            ✅ Mark Attendance
          </button>
        </div>
      )}

      {/* Quick Check-in for Present Members */}
      {selectedDate === new Date().toISOString().split('T')[0] && (
        <div style={{
          backgroundColor: '#e7f3ff',
          border: '1px solid #b3d7ff',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px'
        }}>
          <h3 style={{ marginTop: '0', marginBottom: '12px', fontSize: '16px', fontWeight: 'bold' }}>
            ⚡ Quick Actions for Today
          </h3>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {users.slice(0, 4).map(user => {
              const todayRecord = attendanceRecords.find(r => r.userId === user.id)
              return (
                <button
                  key={user.id}
                  onClick={() => todayRecord && !todayRecord.checkOutTime ? 
                    handleQuickCheckOut(todayRecord.id) : 
                    handleQuickCheckIn(user.id)}
                  disabled={todayRecord && !!todayRecord.checkOutTime}
                  style={{
                    backgroundColor: todayRecord ? 
                      (todayRecord.checkOutTime ? '#6c757d' : '#fd7e14') : '#28a745',
                    color: 'white',
                    padding: '8px 12px',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    cursor: todayRecord && todayRecord.checkOutTime ? 'not-allowed' : 'pointer'
                  }}
                >
                  {todayRecord ? 
                    (todayRecord.checkOutTime ? '✅ Complete' : '🏃‍♂️ Check Out') : 
                    '🚪 Check In'} {user.firstName}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Attendance Records List */}
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
          📋 Attendance Records - {new Date(selectedDate).toLocaleDateString()} ({attendanceRecords.length})
        </h2>

        {attendanceRecords.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            color: '#6c757d'
          }}>
            <h3>No attendance records for this date</h3>
            <p>Mark attendance for your team members to get started!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {attendanceRecords.map((record) => {
              const statusStyle = getStatusColor(record.status)
              const user = users.find(u => u.id === record.userId)
              const hours = record.checkInTime && record.checkOutTime ? 
                calculateHours(record.checkInTime, record.checkOutTime) : null

              return (
                <div key={record.id} style={{
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
                        {user ? `${user.firstName} ${user.lastName}` : 'Unknown User'}
                      </h3>
                      <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>
                        <strong>Department:</strong> {user?.department || 'IT'} • 
                        <strong> Date:</strong> {new Date(record.attendanceDate).toLocaleDateString()}
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
                      {record.status}
                    </span>
                  </div>

                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
                    gap: '12px', 
                    marginBottom: '12px' 
                  }}>
                    <div>
                      <strong>Check-in:</strong> {record.checkInTime || 'Not recorded'}
                    </div>
                    <div>
                      <strong>Check-out:</strong> {record.checkOutTime || 'Not recorded'}
                    </div>
                    {hours && (
                      <div>
                        <strong>Hours:</strong> {hours}h
                      </div>
                    )}
                    <div>
                      <strong>Recorded:</strong> {new Date(record.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  {record.remarks && (
                    <div style={{ marginBottom: '12px' }}>
                      <strong>Remarks:</strong> {record.remarks}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {!record.checkOutTime && record.status === 'Present' && (
                      <button
                        onClick={() => handleQuickCheckOut(record.id)}
                        style={{
                          backgroundColor: '#fd7e14',
                          color: 'white',
                          padding: '6px 12px',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}
                      >
                        🏃‍♂️ Check Out
                      </button>
                    )}
                    
                    {attendanceStatuses.filter(s => s !== record.status).slice(0, 2).map(status => (
                      <button
                        key={status}
                        onClick={() => handleUpdateStatus(record.id, status)}
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
                        → {status}
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}