"use client"
import { useState, useEffect } from 'react'

interface DashboardStats {
  totalUsers: number
  totalRooms: number
  pendingLeaves: number
  upcomingTrainings: number
  todayAttendance: number
  activeProjects: number
  expiringSoonContracts: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalRooms: 0,
    pendingLeaves: 0,
    upcomingTrainings: 0,
    todayAttendance: 0,
    activeProjects: 0,
    expiringSoonContracts: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const [usersRes, roomsRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/rooms')
      ])

      const users = await usersRes.json()
      const rooms = roomsRes.ok ? await roomsRes.json() : []

      setStats({
        totalUsers: users.length,
        totalRooms: rooms.length || 602,
        pendingLeaves: 3,
        upcomingTrainings: 2,
        todayAttendance: Math.floor(users.length * 0.8),
        activeProjects: 12,
        expiringSoonContracts: 5
      })
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  // Light theme colors only
  const theme = {
    background: '#f8fafc',
    cardBackground: '#ffffff',
    cardBorder: '#e2e8f0',
    textPrimary: '#0f172a',
    textSecondary: '#64748b',
    textMuted: '#94a3b8'
  }

  const quickActions = [
    {
      title: 'Apply for Leave',
      description: 'Submit a new leave application',
      icon: '🏖️',
      href: '/dashboard/operations/leave-applications',
      color: '#3b82f6',
      bgColor: '#dbeafe'
    },
    {
      title: 'Mark Attendance',
      description: 'Record team attendance for today',
      icon: '👥',
      href: '/dashboard/operations/attendance',
      color: '#10b981',
      bgColor: '#d1fae5'
    },
    {
      title: 'Plan Training',
      description: 'Schedule a new training session',
      icon: '🎓',
      href: '/dashboard/operations/training',
      color: '#f59e0b',
      bgColor: '#fef3c7'
    },
    {
      title: 'Find Room',
      description: 'Search and manage rooms',
      icon: '🏢',
      href: '/dashboard/resources/rooms',
      color: '#8b5cf6',
      bgColor: '#ede9fe'
    }
  ]

  const recentActivity = [
    {
      type: 'leave',
      user: 'John Doe',
      action: 'submitted leave application',
      time: '2 hours ago',
      icon: '🏖️'
    },
    {
      type: 'training',
      user: 'Sarah Smith',
      action: 'completed Network Security training',
      time: '4 hours ago',
      icon: '🎓'
    },
    {
      type: 'attendance',
      user: 'Mike Johnson',
      action: 'checked in for work',
      time: '6 hours ago',
      icon: '👥'
    },
    {
      type: 'project',
      user: 'Lisa Brown',
      action: 'updated project milestone',
      time: '1 day ago',
      icon: '🚀'
    }
  ]

  if (loading) {
    return (
      <div style={{ 
        backgroundColor: theme.background,
        minHeight: '100vh',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <div style={{ fontSize: '18px', color: theme.textSecondary }}>Loading dashboard...</div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ 
      backgroundColor: theme.background,
      minHeight: '100vh',
      padding: '24px'
    }}>
      {/* Centered Container */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        width: '100%'
      }}>
        {/* Header */}
        <div style={{ 
          marginBottom: '32px' 
        }}>
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            marginBottom: '8px',
            color: theme.textPrimary,
            margin: '0 0 8px 0'
          }}>
            Welcome to Helios Dashboard
          </h1>
          <p style={{ 
            color: theme.textSecondary, 
            fontSize: '16px',
            margin: '0'
          }}>
            Manage your team, projects, and resources efficiently
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px', 
          marginBottom: '32px' 
        }}>
          {[
            { title: 'Team Members', value: stats.totalUsers, icon: '👥', color: '#3b82f6' },
            { title: 'Total Rooms', value: stats.totalRooms, icon: '🏢', color: '#10b981' },
            { title: 'Pending Leaves', value: stats.pendingLeaves, icon: '🏖️', color: '#f59e0b' },
            { title: 'Present Today', value: stats.todayAttendance, icon: '✅', color: '#10b981' }
          ].map((stat, index) => (
            <div key={index} style={{
              backgroundColor: theme.cardBackground,
              padding: '24px',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: `1px solid ${theme.cardBorder}`,
              transition: 'transform 0.2s ease'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ 
                    fontSize: '24px', 
                    fontWeight: 'bold', 
                    color: theme.textPrimary,
                    marginBottom: '4px'
                  }}>
                    {stat.value}
                  </div>
                  <div style={{ 
                    fontSize: '14px', 
                    color: theme.textSecondary 
                  }}>
                    {stat.title}
                  </div>
                </div>
                <div style={{ fontSize: '32px' }}>{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '2fr 1fr', 
          gap: '24px',
          marginBottom: '32px'
        }}>
          {/* Quick Actions */}
          <div style={{
            backgroundColor: theme.cardBackground,
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: `1px solid ${theme.cardBorder}`
          }}>
            <h2 style={{ 
              fontSize: '20px', 
              fontWeight: 'bold', 
              marginBottom: '20px',
              color: theme.textPrimary,
              margin: '0 0 20px 0'
            }}>
              ⚡ Quick Actions
            </h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '16px' 
            }}>
              {quickActions.map((action, index) => (
                <div
                  key={index}
                  onClick={() => window.location.href = action.href}
                  style={{
                    padding: '20px',
                    borderRadius: '8px',
                    border: `1px solid ${theme.cardBorder}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    backgroundColor: action.bgColor
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
                    e.currentTarget.style.borderColor = action.color
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0px)'
                    e.currentTarget.style.boxShadow = 'none'
                    e.currentTarget.style.borderColor = theme.cardBorder
                  }}
                >
                  <div style={{ 
                    fontSize: '32px', 
                    marginBottom: '12px' 
                  }}>
                    {action.icon}
                  </div>
                  <h3 style={{ 
                    fontSize: '16px', 
                    fontWeight: 'bold', 
                    marginBottom: '4px',
                    color: action.color,
                    margin: '0 0 4px 0'
                  }}>
                    {action.title}
                  </h3>
                  <p style={{ 
                    fontSize: '14px', 
                    color: theme.textSecondary,
                    lineHeight: '1.4',
                    margin: '0'
                  }}>
                    {action.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div style={{
            backgroundColor: theme.cardBackground,
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: `1px solid ${theme.cardBorder}`
          }}>
            <h2 style={{ 
              fontSize: '20px', 
              fontWeight: 'bold', 
              marginBottom: '20px',
              color: theme.textPrimary,
              margin: '0 0 20px 0'
            }}>
              📈 Recent Activity
            </h2>
            <div>
              {recentActivity.map((activity, index) => (
                <div 
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '12px 0',
                    borderBottom: index < recentActivity.length - 1 ? 
                      `1px solid ${theme.cardBorder}` : 'none'
                  }}
                >
                  <div style={{ fontSize: '20px' }}>{activity.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      fontSize: '14px', 
                      color: theme.textPrimary,
                      marginBottom: '2px'
                    }}>
                      <strong>{activity.user}</strong> {activity.action}
                    </div>
                    <div style={{ 
                      fontSize: '12px', 
                      color: theme.textMuted 
                    }}>
                      {activity.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Status */}
        <div style={{
          backgroundColor: theme.cardBackground,
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: `1px solid ${theme.cardBorder}`
        }}>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: 'bold', 
            marginBottom: '20px',
            color: theme.textPrimary,
            margin: '0 0 20px 0'
          }}>
            🔍 System Overview
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '20px' 
          }}>
            {[
              { 
                title: 'Upcoming Trainings', 
                value: stats.upcomingTrainings, 
                icon: '🎓',
                bgColor: '#dbeafe',
                textColor: '#1e40af'
              },
              { 
                title: 'Active Projects', 
                value: stats.activeProjects, 
                icon: '🚀',
                bgColor: '#dcfce7',
                textColor: '#166534'
              },
              { 
                title: 'Expiring Soon', 
                value: stats.expiringSoonContracts, 
                icon: '⚠️',
                bgColor: '#fef3c7',
                textColor: '#92400e'
              }
            ].map((item, index) => (
              <div key={index} style={{
                padding: '16px',
                borderRadius: '8px',
                backgroundColor: item.bgColor,
                border: `1px solid ${item.textColor}20`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ 
                      fontSize: '18px', 
                      fontWeight: 'bold', 
                      color: item.textColor,
                      marginBottom: '4px'
                    }}>
                      {item.value}
                    </div>
                    <div style={{ 
                      fontSize: '14px', 
                      color: item.textColor 
                    }}>
                      {item.title}
                    </div>
                  </div>
                  <div style={{ fontSize: '24px' }}>{item.icon}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}