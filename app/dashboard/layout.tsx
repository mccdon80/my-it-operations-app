"use client"
import { useState, useEffect, createContext, useContext } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface User {
  id: string
  name: string
  email: string
  department: string
  role: string
}

interface DashboardLayoutProps {
  children: React.ReactNode
}

// Theme Context
const ThemeContext = createContext({
  darkMode: false,
  toggleTheme: () => {}
})

export const useTheme = () => useContext(ThemeContext)

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    fetchCurrentUser()
    // Load theme preference from localStorage
    const savedTheme = localStorage.getItem('dashboard-theme')
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true)
    }
  }, [])

  useEffect(() => {
    // Save theme preference
    localStorage.setItem('dashboard-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('/api/users')
      const users = await response.json()
      if (users.length > 0) {
        setCurrentUser(users[0])
      }
    } catch (error) {
      console.error('Failed to fetch user:', error)
    }
  }

  const theme = {
    // Sidebar colors
    sidebarBg: darkMode ? '#0f172a' : '#1e293b',
    sidebarBorder: darkMode ? '#1e293b' : '#334155',
    sidebarText: '#f1f5f9',
    sidebarTextMuted: '#94a3b8',
    sidebarActive: darkMode ? '#1e40af' : '#3b82f6',
    sidebarHover: darkMode ? '#1e293b' : '#334155',
    
    // Top bar colors
    topBarBg: darkMode ? '#1e293b' : '#ffffff',
    topBarBorder: darkMode ? '#334155' : '#e5e7eb',
    topBarText: darkMode ? '#f1f5f9' : '#111827',
    topBarTextMuted: darkMode ? '#94a3b8' : '#6b7280',
    
    // Content area
    contentBg: darkMode ? '#0f172a' : '#f9fafb',
    
    // Cards and components
    cardBg: darkMode ? '#1e293b' : '#ffffff',
    cardBorder: darkMode ? '#334155' : '#e5e7eb',
    buttonBg: darkMode ? '#374151' : '#f3f4f6',
    buttonHover: darkMode ? '#4b5563' : '#e5e7eb'
  }

  const navigationItems = [
    {
      title: 'Dashboard',
      icon: '🏠',
      href: '/dashboard',
      active: pathname === '/dashboard'
    },
    {
      title: 'Operations',
      icon: '🔧',
      href: '/dashboard/operations',
      active: pathname.startsWith('/dashboard/operations'),
      children: [
        { title: 'Overview', href: '/dashboard/operations', icon: '📊' },
        { title: 'Leave Applications', href: '/dashboard/operations/leave-applications', icon: '🏖️' },
        { title: 'Training Management', href: '/dashboard/operations/training', icon: '🎓' },
        { title: 'Team Attendance', href: '/dashboard/operations/attendance', icon: '👥' },
        { title: 'Meeting Minutes', href: '/dashboard/operations/meetings', icon: '📝' },
        { title: 'Handover Docs', href: '/dashboard/operations/handover', icon: '🔄' },
        { title: 'New Joiner/Leaver', href: '/dashboard/operations/joiner-leaver', icon: '👤' }
      ]
    },
    {
      title: 'Projects',
      icon: '🚀',
      href: '/dashboard/projects',
      active: pathname.startsWith('/dashboard/projects'),
      children: [
        { title: 'Overview', href: '/dashboard/projects', icon: '📈' },
        { title: 'Project List', href: '/dashboard/projects/list', icon: '📋' },
        { title: 'Contractors', href: '/dashboard/projects/contractors', icon: '🏢' },
        { title: 'Tasks & Timeline', href: '/dashboard/projects/tasks', icon: '⏰' },
        { title: 'Testing & Commissioning', href: '/dashboard/projects/testing', icon: '🔬' },
        { title: 'Issues & Reports', href: '/dashboard/projects/issues', icon: '⚠️' }
      ]
    },
    {
      title: 'Resources',
      icon: '📚',
      href: '/dashboard/resources',
      active: pathname.startsWith('/dashboard/resources'),
      children: [
        { title: 'Room Management', href: '/dashboard/resources/rooms', icon: '🏢' },
        { title: 'Asset Tracking', href: '/dashboard/resources/assets', icon: '💻' },
        { title: 'AMC Contracts', href: '/dashboard/resources/contracts', icon: '📋' },
        { title: 'Documents', href: '/dashboard/resources/documents', icon: '📄' }
      ]
    },
    {
      title: 'Settings',
      icon: '⚙️',
      href: '/dashboard/settings',
      active: pathname.startsWith('/dashboard/settings'),
      children: [
        { title: 'User Management', href: '/dashboard/settings/users', icon: '👥' },
        { title: 'Company Profile', href: '/dashboard/settings/company', icon: '🏢' },
        { title: 'Notifications', href: '/dashboard/settings/notifications', icon: '🔔' },
        { title: 'System Logs', href: '/dashboard/settings/logs', icon: '📋' }
      ]
    }
  ]

  const handleNavigation = (href: string) => {
    router.push(href)
  }

  const handleLogout = () => {
    alert('Logout functionality - redirect to login page')
  }

  const toggleTheme = () => {
    setDarkMode(!darkMode)
  }

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {/* Outer Container with Background */}
      <div style={{
        minHeight: '100vh',
        backgroundColor: darkMode ? '#0f1419' : '#f1f5f9',
        padding: '24px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start'
      }}>
        {/* Centered Dashboard Container */}
        <div style={{
          display: 'flex',
          height: 'calc(100vh - 48px)', // Account for outer padding
          fontFamily: 'Arial, sans-serif',
          width: '90%',
          maxWidth: '1400px',
          minWidth: '1000px',
          backgroundColor: darkMode ? '#1e293b' : '#ffffff',
          borderRadius: '16px',
          boxShadow: darkMode ? 
            '0 20px 25px -5px rgba(0,0,0,0.3), 0 10px 10px -5px rgba(0,0,0,0.2)' : 
            '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
          border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
          overflow: 'hidden'
        }}>
          {/* Sidebar */}
          <div style={{
            width: sidebarOpen ? '280px' : '70px',
            backgroundColor: theme.sidebarBg,
            color: theme.sidebarText,
            transition: 'width 0.3s ease',
            overflow: 'hidden',
            borderRight: `1px solid ${theme.sidebarBorder}`,
            borderRadius: '16px 0 0 16px'
          }}>
            {/* Logo Area */}
            <div style={{
              padding: '20px',
              borderBottom: `1px solid ${theme.sidebarBorder}`,
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{ fontSize: '24px' }}>🏢</div>
              {sidebarOpen && (
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold' }}>IT Operations</div>
                  <div style={{ fontSize: '12px', color: theme.sidebarTextMuted }}>Management System</div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div style={{ padding: '20px 0' }}>
              {navigationItems.map((item, index) => (
                <div key={index}>
                  {/* Main Navigation Item */}
                  <div
                    onClick={() => handleNavigation(item.href)}
                    style={{
                      padding: '12px 20px',
                      cursor: 'pointer',
                      backgroundColor: item.active ? theme.sidebarActive : 'transparent',
                      borderLeft: item.active ? '3px solid #60a5fa' : '3px solid transparent',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!item.active) {
                        e.currentTarget.style.backgroundColor = theme.sidebarHover
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!item.active) {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }
                    }}
                  >
                    <span style={{ fontSize: '18px' }}>{item.icon}</span>
                    {sidebarOpen && (
                      <span style={{ fontSize: '14px', fontWeight: '500' }}>{item.title}</span>
                    )}
                  </div>

                  {/* Sub Navigation */}
                  {sidebarOpen && item.active && item.children && (
                    <div style={{ marginLeft: '20px', paddingTop: '8px', paddingBottom: '8px' }}>
                      {item.children.map((child, childIndex) => (
                        <div
                          key={childIndex}
                          onClick={() => handleNavigation(child.href)}
                          style={{
                            padding: '8px 20px',
                            cursor: 'pointer',
                            backgroundColor: pathname === child.href ? '#1e40af' : 'transparent',
                            borderRadius: '6px',
                            margin: '2px 0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            if (pathname !== child.href) {
                              e.currentTarget.style.backgroundColor = '#475569'
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (pathname !== child.href) {
                              e.currentTarget.style.backgroundColor = 'transparent'
                            }
                          }}
                        >
                          <span style={{ fontSize: '14px' }}>{child.icon}</span>
                          <span style={{ fontSize: '13px', color: '#cbd5e1' }}>{child.title}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Top Bar */}
            <div style={{
              height: '70px',
              backgroundColor: theme.topBarBg,
              borderBottom: `1px solid ${theme.topBarBorder}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 24px',
              borderRadius: '0 16px 0 0'
            }}>
              {/* Left side - Menu toggle and breadcrumb */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '20px',
                    cursor: 'pointer',
                    padding: '8px',
                    borderRadius: '6px',
                    transition: 'background-color 0.2s ease',
                    color: theme.topBarText
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.buttonHover}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  ☰
                </button>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: theme.topBarTextMuted }}>
                  <span style={{ fontSize: '14px' }}>
                    {pathname.split('/').filter(Boolean).map((segment, index, array) => (
                      <span key={index}>
                        {segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')}
                        {index < array.length - 1 && ' / '}
                      </span>
                    ))}
                  </span>
                </div>
              </div>

              {/* Right side - Theme toggle, notifications, and user info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  style={{
                    background: theme.buttonBg,
                    border: `1px solid ${theme.cardBorder}`,
                    borderRadius: '8px',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: theme.topBarText,
                    fontSize: '12px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.buttonHover
                    e.currentTarget.style.transform = 'translateY(-1px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = theme.buttonBg
                    e.currentTarget.style.transform = 'translateY(0px)'
                  }}
                >
                  <span style={{ fontSize: '16px' }}>{darkMode ? '☀️' : '🌙'}</span>
                  {darkMode ? 'Light' : 'Dark'}
                </button>

                {/* Notifications */}
                <button style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '6px',
                  position: 'relative',
                  color: theme.topBarText,
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.buttonHover}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  🔔
                  <span style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#ef4444',
                    borderRadius: '50%'
                  }}></span>
                </button>

                {/* User Menu */}
                <div style={{ position: 'relative' }}>
                  <div
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      cursor: 'pointer',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: `1px solid ${theme.cardBorder}`,
                      backgroundColor: showUserMenu ? theme.buttonHover : theme.cardBg,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#3b82f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}>
                      {currentUser?.name?.charAt(0) || 'U'}
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: theme.topBarText }}>
                        {currentUser?.name || 'User Name'}
                      </div>
                      <div style={{ fontSize: '12px', color: theme.topBarTextMuted }}>
                        {currentUser?.role || 'Role'} • {currentUser?.department || 'Department'}
                      </div>
                    </div>
                    <span style={{ fontSize: '12px', color: theme.topBarTextMuted }}>▼</span>
                  </div>

                  {/* User Dropdown Menu */}
                  {showUserMenu && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      right: '0',
                      marginTop: '8px',
                      width: '200px',
                      backgroundColor: theme.cardBg,
                      border: `1px solid ${theme.cardBorder}`,
                      borderRadius: '8px',
                      boxShadow: darkMode ? '0 10px 25px rgba(0,0,0,0.3)' : '0 10px 25px rgba(0,0,0,0.1)',
                      zIndex: 100
                    }}>
                      <div style={{ padding: '12px', borderBottom: `1px solid ${theme.cardBorder}` }}>
                        <div style={{ fontSize: '14px', fontWeight: '500', color: theme.topBarText }}>{currentUser?.name}</div>
                        <div style={{ fontSize: '12px', color: theme.topBarTextMuted }}>{currentUser?.email}</div>
                      </div>
                      <div style={{ padding: '8px' }}>
                        <button
                          onClick={() => handleNavigation('/dashboard/settings/profile')}
                          style={{
                            width: '100%',
                            textAlign: 'left',
                            padding: '8px 12px',
                            background: 'none',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            color: theme.topBarText,
                            transition: 'background-color 0.2s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.buttonHover}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          👤 Profile Settings
                        </button>
                        <button
                          onClick={() => handleNavigation('/dashboard/settings/preferences')}
                          style={{
                            width: '100%',
                            textAlign: 'left',
                            padding: '8px 12px',
                            background: 'none',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            color: theme.topBarText,
                            transition: 'background-color 0.2s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.buttonHover}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          ⚙️ Preferences
                        </button>
                        <hr style={{ margin: '8px 0', border: 'none', borderTop: `1px solid ${theme.cardBorder}` }} />
                        <button
                          onClick={handleLogout}
                          style={{
                            width: '100%',
                            textAlign: 'left',
                            padding: '8px 12px',
                            background: 'none',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            color: '#dc2626',
                            transition: 'background-color 0.2s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = darkMode ? '#450a0a' : '#fef2f2'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          🚪 Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div style={{
              flex: 1,
              overflow: 'auto',
              backgroundColor: theme.contentBg,
              borderRadius: '0 0 16px 0'
            }}>
              {children}
            </div>
          </div>

          {/* Click outside to close user menu */}
          {showUserMenu && (
            <div
              onClick={() => setShowUserMenu(false)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 40
              }}
            />
          )}
        </div>
      </div>
    </ThemeContext.Provider>
  )
}