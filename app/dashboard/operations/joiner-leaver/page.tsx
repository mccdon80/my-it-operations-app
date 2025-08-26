"use client"

import { useState, useEffect } from 'react'

interface ChecklistItem {
  id: string
  title: string
  description: string
  category: string
  isRequired: boolean
  documentUrl?: string
  completed: boolean
  completedAt?: string
  completedBy?: string
  notes?: string
}

interface JoinerLeaverProcess {
  id: string
  type: 'JOINER' | 'LEAVER'
  employeeName: string
  employeeId: string
  department: string
  position: string
  startDate?: string
  endDate?: string
  manager: string
  status: string
  checklist: ChecklistItem[]
  createdAt: string
  updatedAt: string
}

export default function JoinerLeaverPage() {
  const [processes, setProcesses] = useState<JoinerLeaverProcess[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewProcess, setShowNewProcess] = useState(false)
  const [selectedProcess, setSelectedProcess] = useState<JoinerLeaverProcess | null>(null)
  const [activeTab, setActiveTab] = useState<'JOINER' | 'LEAVER'>('JOINER')
  const [editMode, setEditMode] = useState(false)
  const [showAddItem, setShowAddItem] = useState(false)
  
  const [newProcess, setNewProcess] = useState<Partial<JoinerLeaverProcess>>({
    type: 'JOINER',
    employeeName: '',
    employeeId: '',
    department: '',
    position: '',
    startDate: '',
    endDate: '',
    manager: '',
    status: 'Draft'
  })

  const [newItem, setNewItem] = useState<Partial<ChecklistItem>>({
    title: '',
    description: '',
    category: 'Documentation',
    isRequired: false,
    documentUrl: '',
    notes: ''
  })

  const [editingItem, setEditingItem] = useState<ChecklistItem | null>(null)

  const departments = ['IT Department', 'HR', 'Finance', 'Operations', 'Security', 'Facilities']
  const positions = ['IT Manager', 'System Administrator', 'Help Desk Technician', 'Network Engineer', 'Security Analyst', 'IT Specialist']
  const categories = ['Documentation', 'IT Security', 'Operations', 'HR', 'Safety', 'IT Equipment', 'IT Access', 'Orientation', 'Facilities', 'Handover', 'Data Management', 'Projects', 'Tasks']

  // Joiner Checklist Template
  const joinerChecklistTemplate: Omit<ChecklistItem, 'id' | 'completed' | 'completedAt' | 'completedBy'>[] = [
    {
      title: 'Employee Handbook',
      description: 'Read and acknowledge the complete employee handbook',
      category: 'Documentation',
      isRequired: true,
      documentUrl: '/documents/employee-handbook.pdf',
      notes: ''
    },
    {
      title: 'IT Security Policy',
      description: 'Read and sign IT Security Policy and acceptable use guidelines',
      category: 'IT Security',
      isRequired: true,
      documentUrl: '/documents/it-security-policy.pdf',
      notes: ''
    },
    {
      title: 'Local Work Instructions',
      description: 'Review department-specific work instructions and procedures',
      category: 'Operations',
      isRequired: true,
      documentUrl: '/documents/local-work-instructions.pdf',
      notes: ''
    },
    {
      title: 'Health & Safety Guidelines',
      description: 'Complete health and safety orientation and emergency procedures',
      category: 'Safety',
      isRequired: true,
      documentUrl: '/documents/health-safety.pdf',
      notes: ''
    },
    {
      title: 'Code of Conduct',
      description: 'Read and acknowledge company code of conduct',
      category: 'HR',
      isRequired: true,
      documentUrl: '/documents/code-of-conduct.pdf',
      notes: ''
    }
  ]

  // Leaver Checklist Template
  const leaverChecklistTemplate: Omit<ChecklistItem, 'id' | 'completed' | 'completedAt' | 'completedBy'>[] = [
    {
      title: 'Knowledge Transfer Documentation',
      description: 'Complete knowledge transfer documentation for current projects',
      category: 'Handover',
      isRequired: true,
      notes: ''
    },
    {
      title: 'Return IT Equipment',
      description: 'Return all company IT equipment (laptop, phone, accessories)',
      category: 'IT Equipment',
      isRequired: true,
      notes: ''
    },
    {
      title: 'Data Backup & Transfer',
      description: 'Backup personal work data and transfer to designated team member',
      category: 'Data Management',
      isRequired: true,
      notes: ''
    },
    {
      title: 'System Access Revocation',
      description: 'Verify all system access has been revoked',
      category: 'IT Security',
      isRequired: true,
      notes: ''
    }
  ]

  useEffect(() => {
    fetchProcesses()
  }, [])

  const fetchProcesses = async () => {
    try {
      const response = await fetch('/api/operations/joiner-leaver')
      if (response.ok) {
        const data = await response.json()
        setProcesses(data)
      }
    } catch (error) {
      console.error('Failed to fetch processes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProcess = async () => {
    if (!newProcess.employeeName || !newProcess.department || !newProcess.manager) {
      alert('Please fill in required fields: Employee Name, Department, and Manager')
      return
    }

    try {
      const checklistTemplate = newProcess.type === 'JOINER' ? joinerChecklistTemplate : leaverChecklistTemplate
      const checklist = checklistTemplate.map(item => ({
        ...item,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        completed: false
      }))

      const processData = {
        ...newProcess,
        checklist,
        status: 'In Progress'
      }

      const response = await fetch('/api/operations/joiner-leaver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(processData)
      })

      if (response.ok) {
        const createdProcess = await response.json()
        setProcesses([createdProcess, ...processes])
        setNewProcess({
          type: 'JOINER',
          employeeName: '',
          employeeId: '',
          department: '',
          position: '',
          startDate: '',
          endDate: '',
          manager: '',
          status: 'Draft'
        })
        setShowNewProcess(false)
        alert('Process created successfully!')
      } else {
        alert('Failed to create process')
      }
    } catch (error) {
      console.error('Error creating process:', error)
      alert('Error creating process')
    }
  }

  const toggleChecklistItem = async (processId: string, itemId: string) => {
    try {
      const response = await fetch(`/api/operations/joiner-leaver/${processId}/checklist`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId })
      })

      if (response.ok) {
        const updatedProcess = await response.json()
        setProcesses(processes.map(p => p.id === processId ? updatedProcess : p))
        if (selectedProcess && selectedProcess.id === processId) {
          setSelectedProcess(updatedProcess)
        }
      }
    } catch (error) {
      console.error('Failed to update checklist item:', error)
    }
  }

  const handleAddItem = async () => {
    if (!newItem.title || !newItem.description || !selectedProcess) {
      alert('Please fill in Title and Description')
      return
    }

    try {
      const response = await fetch(`/api/operations/joiner-leaver/${selectedProcess.id}/checklist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      })

      if (response.ok) {
        // Refetch the updated process
        const processResponse = await fetch(`/api/operations/joiner-leaver/${selectedProcess.id}`)
        if (processResponse.ok) {
          const updatedProcess = await processResponse.json()
          setProcesses(processes.map(p => p.id === selectedProcess.id ? updatedProcess : p))
          setSelectedProcess(updatedProcess)
        }

        setNewItem({
          title: '',
          description: '',
          category: 'Documentation',
          isRequired: false,
          documentUrl: '',
          notes: ''
        })
        setShowAddItem(false)
        alert('Checklist item added successfully!')
      } else {
        alert('Failed to add checklist item')
      }
    } catch (error) {
      console.error('Error adding checklist item:', error)
      alert('Error adding checklist item')
    }
  }

  const handleUpdateItem = async () => {
    if (!editingItem || !selectedProcess) return

    try {
      // For now, we'll update locally and sync with backend later
      const updatedChecklist = selectedProcess.checklist.map(item => 
        item.id === editingItem.id ? editingItem : item
      )
      
      const updatedProcess = {
        ...selectedProcess,
        checklist: updatedChecklist
      }

      setSelectedProcess(updatedProcess)
      setProcesses(processes.map(p => p.id === selectedProcess.id ? updatedProcess : p))
      setEditingItem(null)
      alert('Checklist item updated successfully!')
    } catch (error) {
      console.error('Error updating checklist item:', error)
      alert('Error updating checklist item')
    }
  }

  const handleDeleteItem = async (itemId: string) => {
    if (!selectedProcess) return

    if (!confirm('Are you sure you want to delete this checklist item?')) return

    try {
      const response = await fetch(`/api/operations/joiner-leaver/${selectedProcess.id}/checklist`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId })
      })

      if (response.ok) {
        // Refetch the updated process
        const processResponse = await fetch(`/api/operations/joiner-leaver/${selectedProcess.id}`)
        if (processResponse.ok) {
          const updatedProcess = await processResponse.json()
          setProcesses(processes.map(p => p.id === selectedProcess.id ? updatedProcess : p))
          setSelectedProcess(updatedProcess)
        }
        alert('Checklist item deleted successfully!')
      } else {
        alert('Failed to delete checklist item')
      }
    } catch (error) {
      console.error('Error deleting checklist item:', error)
      alert('Error deleting checklist item')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return '#6c757d'
      case 'In Progress': return '#ffc107'
      case 'Completed': return '#28a745'
      case 'On Hold': return '#fd7e14'
      default: return '#6c757d'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Draft': return '📝'
      case 'In Progress': return '🔄'
      case 'Completed': return '✅'
      case 'On Hold': return '⏸️'
      default: return '📄'
    }
  }

  const getTypeIcon = (type: string) => {
    return type === 'JOINER' ? '👋' : '👋'
  }

  const getTypeColor = (type: string) => {
    return type === 'JOINER' ? '#28a745' : '#dc3545'
  }

  const calculateProgress = (checklist: ChecklistItem[]) => {
    if (!checklist || checklist.length === 0) return 0
    const completed = checklist.filter(item => item.completed).length
    return Math.round((completed / checklist.length) * 100)
  }

/*   if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Loading joiner/leaver processes...</p>
      </div>
    )
  } */

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>
          👋 Joiner & Leaver Process
        </h1>
        <p style={{ color: '#666', fontSize: '16px' }}>
          Manage onboarding and offboarding workflows with editable checklists
        </p>
      </div>

      {/* Action Buttons */}
      <div style={{ marginBottom: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setShowNewProcess(!showNewProcess)}
          style={{
            backgroundColor: showNewProcess ? '#dc3545' : '#007bff',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          {showNewProcess ? '✖️ Cancel' : '➕ New Process'}
        </button>
        
        <div style={{ display: 'flex', backgroundColor: '#f8f9fa', borderRadius: '6px', padding: '4px' }}>
          <button
            onClick={() => setActiveTab('JOINER')}
            style={{
              backgroundColor: activeTab === 'JOINER' ? '#28a745' : 'transparent',
              color: activeTab === 'JOINER' ? 'white' : '#666',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            👋 Joiners
          </button>
          <button
            onClick={() => setActiveTab('LEAVER')}
            style={{
              backgroundColor: activeTab === 'LEAVER' ? '#dc3545' : 'transparent',
              color: activeTab === 'LEAVER' ? 'white' : '#666',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            👋 Leavers
          </button>
        </div>
      </div>

      {/* New Process Form */}
      {showNewProcess && (
        <div style={{
          backgroundColor: '#f8f9fa',
          border: '1px solid #e9ecef',
          borderRadius: '8px',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
            ➕ Create New Process
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Process Type *</label>
              <select
                value={newProcess.type}
                onChange={(e) => setNewProcess({...newProcess, type: e.target.value as 'JOINER' | 'LEAVER'})}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                <option value="JOINER">👋 New Joiner</option>
                <option value="LEAVER">👋 Employee Leaver</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Employee Name *</label>
              <input
                type="text"
                value={newProcess.employeeName}
                onChange={(e) => setNewProcess({...newProcess, employeeName: e.target.value})}
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
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Department *</label>
              <select
                value={newProcess.department}
                onChange={(e) => setNewProcess({...newProcess, department: e.target.value})}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Manager *</label>
              <input
                type="text"
                value={newProcess.manager}
                onChange={(e) => setNewProcess({...newProcess, manager: e.target.value})}
                placeholder="Manager Name"
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

          <button
            onClick={handleCreateProcess}
            disabled={!newProcess.employeeName || !newProcess.department || !newProcess.manager}
            style={{
              backgroundColor: (newProcess.employeeName && newProcess.department && newProcess.manager) ? '#28a745' : '#6c757d',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: (newProcess.employeeName && newProcess.department && newProcess.manager) ? 'pointer' : 'not-allowed'
            }}
          >
            ✅ Create Process
          </button>
        </div>
      )}

      {/* Process Checklist View with Edit Capabilities */}
      {selectedProcess && (
        <div style={{
          backgroundColor: '#f8f9fa',
          border: '1px solid #e9ecef',
          borderRadius: '8px',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '4px' }}>
                {getTypeIcon(selectedProcess.type)} {selectedProcess.employeeName} - {selectedProcess.type} Process
              </h2>
              <p style={{ color: '#666', fontSize: '14px' }}>
                {selectedProcess.department} • {selectedProcess.position}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setEditMode(!editMode)}
                style={{
                  backgroundColor: editMode ? '#ffc107' : '#6c757d',
                  color: editMode ? '#333' : 'white',
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 'bold'
                }}
              >
                {editMode ? '🔒 Lock' : '✏️ Edit'}
              </button>
              <button
                onClick={() => setSelectedProcess(null)}
                style={{
                  backgroundColor: '#6c757d',
                  color: 'white',
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '13px'
                }}
              >
                ✖️ Close
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                backgroundColor: '#e9ecef',
                borderRadius: '8px',
                padding: '8px 0',
                width: '200px',
                position: 'relative'
              }}>
                <div
                  style={{
                    backgroundColor: '#28a745',
                    height: '100%',
                    borderRadius: '8px',
                    width: `${calculateProgress(selectedProcess.checklist)}%`,
                    position: 'absolute',
                    top: 0,
                    left: 0
                  }}
                />
                <span style={{
                  position: 'relative',
                  display: 'block',
                  textAlign: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: calculateProgress(selectedProcess.checklist) > 50 ? 'white' : '#333',
                  padding: '4px'
                }}>
                  {calculateProgress(selectedProcess.checklist)}% Complete
                </span>
              </div>
              
              <span style={{ fontSize: '14px', color: '#666' }}>
                {selectedProcess.checklist.filter(item => item.completed).length} of {selectedProcess.checklist.length} items completed
              </span>
            </div>
          </div>

          {/* Add New Item Button (only in edit mode) */}
          {editMode && (
            <div style={{ marginBottom: '16px' }}>
              <button
                onClick={() => setShowAddItem(!showAddItem)}
                style={{
                  backgroundColor: showAddItem ? '#dc3545' : '#28a745',
                  color: 'white',
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                {showAddItem ? '✖️ Cancel' : '➕ Add Item'}
              </button>
            </div>
          )}

          {/* Add New Item Form */}
          {showAddItem && editMode && (
            <div style={{
              backgroundColor: 'white',
              border: '2px solid #28a745',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '16px'
            }}>
              <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>
                ➕ Add New Checklist Item
              </h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Title *</label>
                  <input
                    type="text"
                    value={newItem.title}
                    onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                    placeholder="Enter item title"
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
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Document URL</label>
                  <input
                    type="text"
                    value={newItem.documentUrl}
                    onChange={(e) => setNewItem({...newItem, documentUrl: e.target.value})}
                    placeholder="/documents/filename.pdf"
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
              
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Description *</label>
                <textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                  placeholder="Enter detailed description"
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
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={newItem.isRequired}
                    onChange={(e) => setNewItem({...newItem, isRequired: e.target.checked})}
                  />
                  <span style={{ fontWeight: 'bold', fontSize: '14px' }}>Required Item</span>
                </label>
              </div>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleAddItem}
                  disabled={!newItem.title || !newItem.description}
                  style={{
                    backgroundColor: (newItem.title && newItem.description) ? '#28a745' : '#6c757d',
                    color: 'white',
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: (newItem.title && newItem.description) ? 'pointer' : 'not-allowed'
                  }}
                >
                  ✅ Add Item
                </button>
                
                <button
                  onClick={() => {
                    setShowAddItem(false)
                    setNewItem({
                      title: '',
                      description: '',
                      category: 'Documentation',
                      isRequired: false,
                      documentUrl: '',
                      notes: ''
                    })
                  }}
                  style={{
                    backgroundColor: '#6c757d',
                    color: 'white',
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  ✖️ Cancel
                </button>
              </div>
            </div>
          )}

          {/* Edit Item Form */}
          {editingItem && (
            <div style={{
              backgroundColor: 'white',
              border: '2px solid #ffc107',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '16px'
            }}>
              <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>
                ✏️ Edit Checklist Item
              </h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Title *</label>
                  <input
                    type="text"
                    value={editingItem.title}
                    onChange={(e) => setEditingItem({...editingItem, title: e.target.value})}
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
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Category</label>
                  <select
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Document URL</label>
                  <input
                    type="text"
                    value={editingItem.documentUrl || ''}
                    onChange={(e) => setEditingItem({...editingItem, documentUrl: e.target.value})}
                    placeholder="/documents/filename.pdf"
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
              
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Description *</label>
                <textarea
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
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
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={editingItem.isRequired}
                    onChange={(e) => setEditingItem({...editingItem, isRequired: e.target.checked})}
                  />
                  <span style={{ fontWeight: 'bold', fontSize: '14px' }}>Required Item</span>
                </label>
              </div>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleUpdateItem}
                  style={{
                    backgroundColor: '#28a745',
                    color: 'white',
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  ✅ Save Changes
                </button>
                
                <button
                  onClick={() => setEditingItem(null)}
                  style={{
                    backgroundColor: '#6c757d',
                    color: 'white',
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  ✖️ Cancel
                </button>
              </div>
            </div>
          )}

          {/* Checklist Items */}
          <div style={{ display: 'grid', gap: '12px' }}>
            {selectedProcess.checklist.map((item) => (
              <div key={item.id} style={{
                backgroundColor: 'white',
                border: `2px solid ${item.completed ? '#28a745' : '#e9ecef'}`,
                borderRadius: '8px',
                padding: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <button
                    onClick={() => toggleChecklistItem(selectedProcess.id, item.id)}
                    style={{
                      backgroundColor: item.completed ? '#28a745' : 'white',
                      color: item.completed ? 'white' : '#666',
                      border: `2px solid ${item.completed ? '#28a745' : '#ddd'}`,
                      borderRadius: '4px',
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      cursor: 'pointer',
                      flexShrink: 0
                    }}
                  >
                    {item.completed ? '✓' : ''}
                  </button>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h4 style={{ 
                          fontSize: '16px', 
                          fontWeight: 'bold', 
                          margin: 0,
                          textDecoration: item.completed ? 'line-through' : 'none',
                          color: item.completed ? '#666' : '#333'
                        }}>
                          {item.title}
                        </h4>
                        {item.isRequired && (
                          <span style={{
                            backgroundColor: '#dc3545',
                            color: 'white',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '10px',
                            fontWeight: 'bold'
                          }}>
                            REQUIRED
                          </span>
                        )}
                        <span style={{
                          backgroundColor: '#6c757d',
                          color: 'white',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '10px',
                          fontWeight: 'bold'
                        }}>
                          {item.category}
                        </span>
                      </div>
                      
                      {/* Edit/Delete Buttons (only in edit mode) */}
                      {editMode && (
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            onClick={() => setEditingItem(item)}
                            style={{
                              backgroundColor: '#ffc107',
                              color: '#333',
                              border: 'none',
                              borderRadius: '3px',
                              padding: '4px 8px',
                              fontSize: '11px',
                              cursor: 'pointer',
                              fontWeight: 'bold'
                            }}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            style={{
                              backgroundColor: '#dc3545',
                              color: 'white',
                              border: 'none',
                              borderRadius: '3px',
                              padding: '4px 8px',
                              fontSize: '11px',
                              cursor: 'pointer',
                              fontWeight: 'bold'
                            }}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <p style={{ 
                      fontSize: '14px', 
                      color: '#666', 
                      margin: '0 0 8px 0',
                      textDecoration: item.completed ? 'line-through' : 'none'
                    }}>
                      {item.description}
                    </p>
                    
                    {item.documentUrl && (
                      <div style={{ marginBottom: '8px' }}>
                        <a
                          href={item.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: '#007bff',
                            textDecoration: 'none',
                            fontSize: '13px',
                            fontWeight: 'bold'
                          }}
                        >
                          📄 View Document
                        </a>
                      </div>
                    )}
                    
                    {item.completed && item.completedAt && (
                      <div style={{ fontSize: '12px', color: '#28a745', marginTop: '8px' }}>
                        ✅ Completed on {new Date(item.completedAt).toLocaleDateString()}
                        {item.completedBy && ` by ${item.completedBy}`}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Processes List */}
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
          {getTypeIcon(activeTab)} {activeTab === 'JOINER' ? 'Joiner' : 'Leaver'} Processes ({processes.filter(p => p.type === activeTab).length})
        </h2>

        {processes.filter(p => p.type === activeTab).length === 0 ? (
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #e9ecef',
            borderRadius: '8px',
            padding: '40px',
            textAlign: 'center'
          }}>
            <p style={{ color: '#6c757d', fontSize: '16px', marginBottom: '8px' }}>
              No {activeTab.toLowerCase()} processes found
            </p>
            <p style={{ color: '#6c757d', fontSize: '14px' }}>
              Create your first {activeTab.toLowerCase()} process by clicking the button above
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {processes.filter(p => p.type === activeTab).map((process) => (
              <div key={process.id} style={{
                backgroundColor: 'white',
                border: '1px solid #e9ecef',
                borderRadius: '8px',
                padding: '20px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px', color: '#333' }}>
                      {getTypeIcon(process.type)} {process.employeeName}
                    </h3>
                    <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>
                      {process.department} • {process.position} • Manager: {process.manager}
                    </p>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div style={{
                      backgroundColor: getTypeColor(process.type),
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 'bold'
                    }}>
                      {process.type}
                    </div>
                    
                    <div style={{
                      backgroundColor: getStatusColor(process.status),
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {getStatusIcon(process.status)} {process.status}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <div style={{
                      backgroundColor: '#e9ecef',
                      borderRadius: '6px',
                      height: '8px',
                      width: '150px',
                      position: 'relative'
                    }}>
                      <div
                        style={{
                          backgroundColor: '#28a745',
                          height: '100%',
                          borderRadius: '6px',
                          width: `${calculateProgress(process.checklist)}%`,
                          transition: 'width 0.3s ease'
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '13px', color: '#666', fontWeight: '500' }}>
                      {calculateProgress(process.checklist)}% Complete ({process.checklist.filter(item => item.completed).length}/{process.checklist.length})
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setSelectedProcess(process)}
                    style={{
                      backgroundColor: '#007bff',
                      color: 'white',
                      padding: '8px 16px',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '13px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    📋 View Checklist
                  </button>
                  
                  <button
                    onClick={() => {
                      setSelectedProcess(process)
                      setEditMode(true)
                    }}
                    style={{
                      backgroundColor: '#ffc107',
                      color: '#333',
                      padding: '8px 16px',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '13px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    ✏️ Edit Checklist
                  </button>
                  
                  <button
                    onClick={() => {
                      const progress = calculateProgress(process.checklist)
                      if (progress === 100) {
                        if (confirm('Mark this process as completed?')) {
                          console.log('Mark as complete:', process.id)
                        }
                      } else {
                        alert(`Process is ${progress}% complete. Complete all required items first.`)
                      }
                    }}
                    style={{
                      backgroundColor: calculateProgress(process.checklist) === 100 ? '#28a745' : '#6c757d',
                      color: 'white',
                      padding: '8px 16px',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '13px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    {calculateProgress(process.checklist) === 100 ? '✅ Mark Complete' : '⏳ In Progress'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}