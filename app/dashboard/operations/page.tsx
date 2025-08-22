"use client"

import { useState, useEffect } from 'react'

export default function OperationsPage() {
  const [stats, setStats] = useState({
    pendingLeaves: 0,
    upcomingMeetings: 0,
    activeTrainings: 0,
    teamPresent: 0
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/operations/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const modules = [
    {
      icon: '🏖️',
      title: 'Leave Applications',
      description: 'Submit and approve leave requests with automated workflows',
      href: '/operations/leave-applications',
      color: '#e3f2fd',
      borderColor: '#2196f3'
    },
    {
      icon: '📝',
      title: 'Meeting Minutes',
      description: 'Record meetings, track attendees, and manage action items',
      href: '/operations/meetings',
      color: '#f3e5f5',
      borderColor: '#9c27b0'
    },
    {
      icon: '🎓',
      title: 'Training Management',
      description: 'Plan training sessions and track attendance',
      href: '/operations/training',
      color: '#e8f5e8',
      borderColor: '#4caf50'
    },
    {
      icon: '👥',
      title: 'Team Attendance',
      description: 'Monitor daily team attendance and presence',
      href: '/operations/attendance',
      color: '#fff3e0',
      borderColor: '#ff9800'
    },
    {
      icon: '🔄',
      title: 'Handover Documentation',
      description: 'Manage knowledge transfer and handover processes',
      href: '/operations/handovers',
      color: '#fce4ec',
      borderColor: '#e91e63'
    },
    {
      icon: '👋',
      title: 'Joiners & Leavers',
      description: 'Process new joiners and manage leaver procedures',
      href: '/operations/joiners-leavers',
      color: '#e1f5fe',
      borderColor: '#00bcd4'
    }
  ]

  return (
    <div style={{ padding: '24px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
          📊 IT Operations Center
        </h1>
        <p style={{ color: '#666', fontSize: '16px' }}>
          Manage all daily IT operations, team processes, and workflows
        </p>
      </div>

      {/* Quick Stats */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '16px', 
        marginBottom: '32px' 
      }}>
        <div style={{ 
          backgroundColor: '#fff3cd', 
          border: '1px solid #ffeaa7', 
          padding: '20px', 
          borderRadius: '8px', 
          textAlign: 'center' 
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#856404' }}>{stats.pendingLeaves}</div>
          <div style={{ fontSize: '14px', color: '#856404' }}>Pending Leave Requests</div>
        </div>
        <div style={{ 
          backgroundColor: '#d1ecf1', 
          border: '1px solid #bee5eb', 
          padding: '20px', 
          borderRadius: '8px', 
          textAlign: 'center' 
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0c5460' }}>{stats.upcomingMeetings}</div>
          <div style={{ fontSize: '14px', color: '#0c5460' }}>Upcoming Meetings</div>
        </div>
        <div style={{ 
          backgroundColor: '#d4edda', 
          border: '1px solid #c3e6cb', 
          padding: '20px', 
          borderRadius: '8px', 
          textAlign: 'center' 
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#155724' }}>{stats.activeTrainings}</div>
          <div style={{ fontSize: '14px', color: '#155724' }}>Active Training Plans</div>
        </div>
        <div style={{ 
          backgroundColor: '#f8d7da', 
          border: '1px solid #f5c6cb', 
          padding: '20px', 
          borderRadius: '8px', 
          textAlign: 'center' 
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#721c24' }}>{stats.teamPresent}</div>
          <div style={{ fontSize: '14px', color: '#721c24' }}>Team Present Today</div>
        </div>
      </div>

      {/* Operations Modules */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#333' }}>
          🔧 Operations Modules
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
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
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
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
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => window.location.href = '/operations/leave-applications/new'}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              padding: '10px 16px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            📝 Apply for Leave
          </button>
          <button 
            onClick={() => window.location.href = '/operations/meetings/new'}
            style={{
              backgroundColor: '#28a745',
              color: 'white',
              padding: '10px 16px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            📅 Schedule Meeting
          </button>
          <button 
            onClick={() => window.location.href = '/operations/training/new'}
            style={{
              backgroundColor: '#ffc107',
              color: '#333',
              padding: '10px 16px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            🎓 Plan Training
          </button>
          <button 
            onClick={() => window.location.href = '/operations/training'}
            style={{
              backgroundColor: '#dc3545',
              color: 'white',
              padding: '10px 16px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            👥 Mark Attendance
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ marginTop: '32px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#333' }}>
          📈 Recent Activity
        </h3>
        <div style={{ 
          backgroundColor: 'white', 
          border: '1px solid #e9ecef', 
          borderRadius: '8px', 
          padding: '20px' 
        }}>
          <div style={{ textAlign: 'center', color: '#6c757d', padding: '20px' }}>
            <p>Recent operations activity will appear here once you start using the modules.</p>
            <p style={{ fontSize: '14px' }}>Get started by clicking on any module above! 🚀</p>
          </div>
        </div>
      </div>
    </div>
  )
}