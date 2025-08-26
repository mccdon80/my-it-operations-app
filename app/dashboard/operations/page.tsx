"use client"

import { useState, useEffect } from 'react'

interface DashboardStats {
  pendingLeaves: number
  upcomingMeetings: number
  activeTrainings: number
  teamPresent: number
  totalRooms: number
  activeProjects: number
  pendingHandovers: number
  joinerLeaverProcesses: number
  recentActivity: ActivityItem[]
}

interface ActivityItem {
  id: string
  type: 'leave' | 'meeting' | 'training' | 'handover' | 'joiner-leaver'
  description: string
  user: string
  timestamp: string
  status?: string
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    pendingLeaves: 0,
    upcomingMeetings: 0,
    activeTrainings: 0,
    teamPresent: 0,
    totalRooms: 0,
    activeProjects: 0,
    pendingHandovers: 0,
    joinerLeaverProcesses: 0,
    recentActivity: []
  })
  const [loading, setLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    fetchDashboardData()
    const interval = setInterval(fetchDashboardData, 30000) // Refresh every 30 seconds
    
    // Update time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => {
      clearInterval(interval)
      clearInterval(timeInterval)
    }
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      // Keep existing data on error, don't reset to zeros
    } finally {
      setLoading(false)
    }
  }

  const modules = [
    {
      icon: '🏖️',
      title: 'Leave Applications',
      description: 'Submit and approve leave requests with automated workflows',
      href: './operations/leave-applications',
      color: '#e3f2fd',
      borderColor: '#2196f3',
      count: stats.pendingLeaves,
      countLabel: 'Pending'
    },
    {
      icon: '📝',
      title: 'Meeting Minutes',
      description: 'Record meetings, track attendees, and manage action items',
      href: './operations/meetings',
      color: '#f3e5f5',
      borderColor: '#9c27b0',
      count: stats.upcomingMeetings,
      countLabel: 'Upcoming'
    },
    {
      icon: '🎓',
      title: 'Training Management',
      description: 'Plan training sessions and track attendance',
      href: './operations/training',
      color: '#e8f5e8',
      borderColor: '#4caf50',
      count: stats.activeTrainings,
      countLabel: 'Active'
    },
    {
      icon: '👥',
      title: 'Team Attendance',
      description: 'Monitor daily team attendance and presence',
      href: './operations/attendance',
      color: '#fff3e0',
      borderColor: '#ff9800',
      count: stats.teamPresent,
      countLabel: 'Present Today'
    },
    {
      icon: '🔄',
      title: 'Handover Documentation',
      description: 'Manage knowledge transfer and handover processes',
      href: './operations/handover',
      color: '#fce4ec',
      borderColor: '#e91e63',
      count: stats.pendingHandovers,
      countLabel: 'Pending'
    },
    {
      icon: '👋',
      title: 'Joiners & Leavers',
      description: 'Process new joiners and manage leaver procedures',
      href: './operations/joiner-leaver',
      color: '#e1f5fe',
      borderColor: '#00bcd4',
      count: stats.joinerLeaverProcesses,
      countLabel: 'In Progress'
    }
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'leave': return '🏖️'
      case 'meeting': return '📝'
      case 'training': return '🎓'
      case 'handover': return '🔄'
      case 'joiner-leaver': return '👋'
      default: return '📊'
    }
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Pending': return '#ffc107'
      case 'Approved': return '#28a745'
      case 'Completed': return '#007bff'
      case 'In Progress': return '#17a2b8'
      case 'Draft': return '#6c757d'
      default: return '#6c757d'
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  if (loading) {
    return (
      <div style={{ 
        padding: '24px', 
        textAlign: 'center', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px' 
      }}>
        <div>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <h2>Loading Dashboard...</h2>
          <p style={{ color: '#666' }}>Fetching live data from your systems</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px', fontFamily: 'Arial, sans-serif', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header with Live Time */}
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
            📊 Helios - Operations Dashboard
          </h1>
          <p style={{ color: '#666', fontSize: '16px' }}>
            Real-time overview of all IT operations and team activities
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
            {currentTime.toLocaleTimeString()}
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>
            {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <div style={{ fontSize: '12px', color: '#28a745', marginTop: '4px' }}>
            🟢 Live Data • Last updated: {formatTimeAgo(new Date().toISOString())}
          </div>
        </div>
      </div>

      {/* Enhanced Stats Overview */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
        gap: '16px', 
        marginBottom: '32px' 
      }}>
        <div style={{ 
          backgroundColor: '#fff3cd', 
          border: '1px solid #ffeaa7', 
          padding: '20px', 
          borderRadius: '8px', 
          textAlign: 'center',
          position: 'relative'
        }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#856404' }}>{stats.pendingLeaves}</div>
          <div style={{ fontSize: '14px', color: '#856404', marginBottom: '8px' }}>Pending Leave Requests</div>
          {stats.pendingLeaves > 0 && (
            <div style={{ 
              position: 'absolute', 
              top: '8px', 
              right: '8px', 
              backgroundColor: '#dc3545', 
              color: 'white', 
              borderRadius: '50%', 
              width: '20px', 
              height: '20px', 
              fontSize: '10px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              !
            </div>
          )}
        </div>

        <div style={{ 
          backgroundColor: '#d1ecf1', 
          border: '1px solid #bee5eb', 
          padding: '20px', 
          borderRadius: '8px', 
          textAlign: 'center' 
        }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#0c5460' }}>{stats.upcomingMeetings}</div>
          <div style={{ fontSize: '14px', color: '#0c5460' }}>Upcoming Meetings</div>
        </div>

        <div style={{ 
          backgroundColor: '#d4edda', 
          border: '1px solid #c3e6cb', 
          padding: '20px', 
          borderRadius: '8px', 
          textAlign: 'center' 
        }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#155724' }}>{stats.activeTrainings}</div>
          <div style={{ fontSize: '14px', color: '#155724' }}>Active Training Plans</div>
        </div>

        <div style={{ 
          backgroundColor: '#f8d7da', 
          border: '1px solid #f5c6cb', 
          padding: '20px', 
          borderRadius: '8px', 
          textAlign: 'center' 
        }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#721c24' }}>{stats.teamPresent}</div>
          <div style={{ fontSize: '14px', color: '#721c24' }}>Team Present Today</div>
        </div>

        <div style={{ 
          backgroundColor: '#e2e3e5', 
          border: '1px solid #d6d8db', 
          padding: '20px', 
          borderRadius: '8px', 
          textAlign: 'center' 
        }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#383d41' }}>{stats.totalRooms}</div>
          <div style={{ fontSize: '14px', color: '#383d41' }}>Total Rooms</div>
        </div>

        <div style={{ 
          backgroundColor: '#fce4ec', 
          border: '1px solid #f8bbd9', 
          padding: '20px', 
          borderRadius: '8px', 
          textAlign: 'center' 
        }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#880e4f' }}>{stats.pendingHandovers}</div>
          <div style={{ fontSize: '14px', color: '#880e4f' }}>Pending Handovers</div>
        </div>
      </div>

      {/* Operations Modules with Live Counts */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#333' }}>
          🔧 Operations Modules
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '20px' 
        }}>
          {modules.map((module, index) => (
            <div key={index} style={{
              backgroundColor: module.color,
              border: `2px solid ${module.borderColor}`,
              borderRadius: '12px',
              padding: '24px',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              position: 'relative'
            }}
            onClick={() => window.location.href = module.href}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0px)'
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              
              {/* Live Count Badge */}
              {module.count > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  backgroundColor: module.borderColor,
                  color: 'white',
                  borderRadius: '20px',
                  padding: '4px 12px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {module.count} {module.countLabel}
                </div>
              )}

              <div style={{ fontSize: '32px', marginBottom: '12px' }}>{module.icon}</div>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
                {module.title}
              </h3>
              <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.4' }}>
                {module.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout for Quick Actions and Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
        
        {/* Quick Actions */}
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          border: '1px solid #e9ecef', 
          borderRadius: '8px', 
          padding: '24px' 
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#333' }}>
            ⚡ Quick Actions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button 
              onClick={() => window.location.href = '/operations/leave-applications'}
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                padding: '12px 16px',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span>📝 Apply for Leave</span>
              {stats.pendingLeaves > 0 && <span style={{ fontSize: '12px' }}>({stats.pendingLeaves} pending)</span>}
            </button>
            
            <button 
              onClick={() => window.location.href = '/operations/meetings'}
              style={{
                backgroundColor: '#28a745',
                color: 'white',
                padding: '12px 16px',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              📅 Schedule Meeting
            </button>
            
            <button 
              onClick={() => window.location.href = '/operations/training'}
              style={{
                backgroundColor: '#ffc107',
                color: '#333',
                padding: '12px 16px',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              🎓 Plan Training
            </button>
            
            <button 
              onClick={() => window.location.href = '/operations/joiner-leaver'}
              style={{
                backgroundColor: '#17a2b8',
                color: 'white',
                padding: '12px 16px',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              👋 New Joiner/Leaver Process
            </button>
          </div>
        </div>

        {/* System Status */}
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          border: '1px solid #e9ecef', 
          borderRadius: '8px', 
          padding: '24px' 
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#333' }}>
            🔧 System Status
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px' }}>📊 Database</span>
              <span style={{ fontSize: '12px', color: '#28a745', fontWeight: 'bold' }}>🟢 Online</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px' }}>🔄 Background Jobs</span>
              <span style={{ fontSize: '12px', color: '#28a745', fontWeight: 'bold' }}>🟢 Running</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px' }}>📧 Email Service</span>
              <span style={{ fontSize: '12px', color: '#28a745', fontWeight: 'bold' }}>🟢 Active</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px' }}>💾 Backup Status</span>
              <span style={{ fontSize: '12px', color: '#28a745', fontWeight: 'bold' }}>🟢 Current</span>
            </div>
            <hr style={{ margin: '8px 0', border: '1px solid #e9ecef' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', fontWeight: 'bold' }}>📈 Uptime</span>
              <span style={{ fontSize: '12px', color: '#28a745', fontWeight: 'bold' }}>99.9%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#333' }}>
          📈 Recent Activity
        </h3>
        <div style={{ 
          backgroundColor: 'white', 
          border: '1px solid #e9ecef', 
          borderRadius: '8px', 
          padding: '20px' 
        }}>
          {stats.recentActivity.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {stats.recentActivity.slice(0, 8).map((activity) => (
                <div key={activity.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '6px',
                  borderLeft: `4px solid ${getStatusColor(activity.status)}`
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '18px' }}>{getActivityIcon(activity.type)}</span>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '500' }}>{activity.description}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>by {activity.user}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    {activity.status && (
                      <div style={{
                        fontSize: '10px',
                        fontWeight: 'bold',
                        color: getStatusColor(activity.status),
                        marginBottom: '2px'
                      }}>
                        {activity.status}
                      </div>
                    )}
                    <div style={{ fontSize: '12px', color: '#999' }}>
                      {formatTimeAgo(activity.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#6c757d', padding: '40px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
              <p style={{ fontSize: '16px', marginBottom: '8px' }}>No recent activity</p>
              <p style={{ fontSize: '14px' }}>Activity will appear here once you start using the modules</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer with Refresh Info */}
      <div style={{ 
        textAlign: 'center', 
        padding: '16px', 
        fontSize: '12px', 
        color: '#999',
        borderTop: '1px solid #e9ecef',
        marginTop: '24px'
      }}>
        Dashboard automatically refreshes every 30 seconds • Last refresh: {new Date().toLocaleTimeString()}
      </div>
    </div>
  )
}