"use client"

import { useState, useEffect } from 'react'

interface User {
  id: string
  name: string
  email: string
  role: string
  department: string
  active: boolean
  createdAt: string
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddUser, setShowAddUser] = useState(false)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'Employee',
    department: 'IT'
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddUser = async () => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      })

      if (response.ok) {
        const createdUser = await response.json()
        setUsers(prevUsers => [...prevUsers, createdUser])
        setNewUser({ name: '', email: '', role: 'Employee', department: 'IT' })
        setShowAddUser(false)
        alert('User created successfully!')
      } else {
        const error = await response.json()
        alert(`Error: ${error.message}`)
      }
    } catch (error) {
      alert('Failed to create user')
    }
  }

  const roles = ['Admin', 'Manager', 'Employee', 'Contractor']
  const departments = ['IT', 'Projects', 'Operations', 'Management']

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <h1>Loading users...</h1>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
          👥 Team User Management
        </h1>
        <p style={{ color: '#666', fontSize: '16px' }}>
          Manage your 9 IT team members and their access levels
        </p>
      </div>

      {/* Add User Button */}
      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={() => setShowAddUser(!showAddUser)}
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
          {showAddUser ? '✖️ Cancel' : '➕ Add New User'}
        </button>
      </div>

      {/* Add User Form */}
      {showAddUser && (
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          border: '1px solid #e9ecef', 
          borderRadius: '8px', 
          padding: '24px', 
          marginBottom: '24px' 
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
            ➕ Add New Team Member
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>
                Full Name *
              </label>
              <input
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                placeholder="John Smith"
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
                Email Address *
              </label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                placeholder="john.smith@company.com"
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
                Role *
              </label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                style={{ 
                  width: '100%', 
                  padding: '8px 12px', 
                  border: '1px solid #ddd', 
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>
                Department *
              </label>
              <select
                value={newUser.department}
                onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                style={{ 
                  width: '100%', 
                  padding: '8px 12px', 
                  border: '1px solid #ddd', 
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
          
          <button
            onClick={handleAddUser}
            disabled={!newUser.name || !newUser.email}
            style={{
              backgroundColor: newUser.name && newUser.email ? '#28a745' : '#6c757d',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: newUser.name && newUser.email ? 'pointer' : 'not-allowed'
            }}
          >
            ✅ Create User Account
          </button>
        </div>
      )}

      {/* Role Explanation */}
      <div style={{ 
        backgroundColor: '#e7f3ff', 
        border: '1px solid #b3d9ff', 
        borderRadius: '8px', 
        padding: '16px', 
        marginBottom: '24px' 
      }}>
        <h3 style={{ margin: '0 0 8px 0', color: '#0066cc' }}>🔐 Role Permissions:</h3>
        <div style={{ fontSize: '14px', color: '#004499' }}>
          <strong>Admin:</strong> Full system access, user management, all operations<br/>
          <strong>Manager:</strong> Approvals, reports, team oversight, project management<br/>
          <strong>Employee:</strong> Daily operations, leave requests, meeting participation<br/>
          <strong>Contractor:</strong> Limited access, project updates only
        </div>
      </div>

      {/* Current Users */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
          👤 Current Team Members ({users.length})
        </h2>
        
        {users.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '8px',
            color: '#6c757d'
          }}>
            <h3>No users yet</h3>
            <p>Add your first team member above to get started!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {users.map((user) => (
              <div key={user.id} style={{ 
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb', 
                borderRadius: '8px', 
                padding: '16px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 'bold' }}>
                      {user.name}
                    </h3>
                    <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>
                      {user.email}
                    </p>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span style={{ 
                        backgroundColor: user.role === 'Admin' ? '#dc3545' : user.role === 'Manager' ? '#fd7e14' : '#28a745',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {user.role}
                      </span>
                      <span style={{ 
                        backgroundColor: '#6c757d',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}>
                        {user.department}
                      </span>
                      <span style={{ 
                        backgroundColor: user.active ? '#28a745' : '#dc3545',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}>
                        {user.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', color: '#6c757d' }}>
                    Created: {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Setup Guide */}
      <div style={{ 
        backgroundColor: '#fff3cd', 
        border: '1px solid #ffeaa7', 
        borderRadius: '8px', 
        padding: '16px' 
      }}>
        <h3 style={{ margin: '0 0 8px 0', color: '#856404' }}>💡 Quick Setup Tips:</h3>
        <ol style={{ margin: 0, paddingLeft: '20px', color: '#856404' }}>
          <li>Start by creating yourself as an Admin user</li>
          <li>Add your IT Manager with Manager role</li>
          <li>Add Supervisors and Project Managers with Manager role</li>
          <li>Add other team members as Employees</li>
          <li>Users will login using email OTP (no passwords needed!)</li>
        </ol>
      </div>
    </div>
  )
}