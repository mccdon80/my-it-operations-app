"use client"

import { useState, useEffect } from 'react'

interface HandoverItem {
  id: string
  sercoAssetTagNo: string
  qty: number
  brand: string
  model: string
  serialNumber: string
  inGoodCondition: 'YES' | 'NO' | ''
  remarks: string
}

interface HandoverForm {
  id: string
  group: string
  itRequestId: string
  ithoNumber: string
  handoverTo: string
  employeeNo: string
  designation: string
  companyName: string
  handoverDate: string
  estimatedReturnDate: string
  items: HandoverItem[]
  requestorSignature: string
  requestorDate: string
  approverSignature: string
  approverDate: string
  departmentHeadSignature: string
  departmentHeadDate: string
  status: string
  createdAt: string
}

export default function HandoverPage() {
  const [handovers, setHandovers] = useState<HandoverForm[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewHandover, setShowNewHandover] = useState(false)
  const [newHandover, setNewHandover] = useState<Partial<HandoverForm>>({
    group: '',
    itRequestId: '',
    ithoNumber: '',
    handoverTo: '',
    employeeNo: '',
    designation: '',
    companyName: '',
    handoverDate: '',
    estimatedReturnDate: '',
    items: [],
    status: 'Draft'
  })

  const [newItem, setNewItem] = useState<Partial<HandoverItem>>({
    sercoAssetTagNo: '',
    qty: 1,
    brand: '',
    model: '',
    serialNumber: '',
    inGoodCondition: '',
    remarks: ''
  })

  const groups = ['IT', 'Security', 'Facilities', 'Operations', 'Administration']
  const companies = ['Serco', 'Zayed University', 'Contractor', 'Vendor', 'Other']

  useEffect(() => {
    fetchHandovers()
  }, [])

  const fetchHandovers = async () => {
    try {
      const response = await fetch('/api/operations/handover')
      if (response.ok) {
        const data = await response.json()
        setHandovers(data)
      }
    } catch (error) {
      console.error('Failed to fetch handovers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitHandover = async () => {
    if (!newHandover.handoverTo || !newHandover.handoverDate || !newHandover.items?.length) {
      alert('Please fill in required fields: Handover To, Date, and at least one item')
      return
    }

    try {
      const response = await fetch('/api/operations/handover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newHandover)
      })

      if (response.ok) {
        const createdHandover = await response.json()
        setHandovers([createdHandover, ...handovers])
        setNewHandover({
          group: '',
          itRequestId: '',
          ithoNumber: '',
          handoverTo: '',
          employeeNo: '',
          designation: '',
          companyName: '',
          handoverDate: '',
          estimatedReturnDate: '',
          items: [],
          status: 'Draft'
        })
        setShowNewHandover(false)
        alert('Handover form created successfully!')
      } else {
        alert('Failed to create handover form')
      }
    } catch (error) {
      console.error('Error creating handover:', error)
      alert('Error creating handover form')
    }
  }

  const addItemToHandover = () => {
    if (!newItem.sercoAssetTagNo || !newItem.brand || !newItem.model) {
      alert('Please fill in Asset Tag No, Brand, and Model')
      return
    }

    const item: HandoverItem = {
      id: Date.now().toString(),
      sercoAssetTagNo: newItem.sercoAssetTagNo || '',
      qty: newItem.qty || 1,
      brand: newItem.brand || '',
      model: newItem.model || '',
      serialNumber: newItem.serialNumber || '',
      inGoodCondition: newItem.inGoodCondition || '',
      remarks: newItem.remarks || ''
    }

    setNewHandover({
      ...newHandover,
      items: [...(newHandover.items || []), item]
    })

    setNewItem({
      sercoAssetTagNo: '',
      qty: 1,
      brand: '',
      model: '',
      serialNumber: '',
      inGoodCondition: '',
      remarks: ''
    })
  }

  const removeItemFromHandover = (itemId: string) => {
    setNewHandover({
      ...newHandover,
      items: (newHandover.items || []).filter(item => item.id !== itemId)
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return '#6c757d'
      case 'Pending': return '#ffc107'
      case 'Approved': return '#28a745'
      case 'Completed': return '#007bff'
      case 'Returned': return '#20c997'
      default: return '#6c757d'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Draft': return '📝'
      case 'Pending': return '⏳'
      case 'Approved': return '✅'
      case 'Completed': return '🏁'
      case 'Returned': return '🔄'
      default: return '📄'
    }
  }

/*   if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Loading handover forms...</p>
      </div>
    )
  } */

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>
          📋 IT Equipment Handover
        </h1>
        <p style={{ color: '#666', fontSize: '16px' }}>
          Manage IT equipment handover forms and asset transfers
        </p>
      </div>

      {/* Action Button */}
      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={() => setShowNewHandover(!showNewHandover)}
          style={{
            backgroundColor: showNewHandover ? '#dc3545' : '#007bff',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          {showNewHandover ? '✖️ Cancel' : '📝 Create Handover Form'}
        </button>
      </div>

      {/* New Handover Form */}
      {showNewHandover && (
        <div style={{
          backgroundColor: '#f8f9fa',
          border: '1px solid #e9ecef',
          borderRadius: '8px',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
            📝 IT Equipment Handover Form
          </h2>

          {/* Basic Information */}
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '6px',
            marginBottom: '20px',
            border: '1px solid #dee2e6'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#495057' }}>
              📄 Basic Information
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Group *</label>
                <select
                  value={newHandover.group}
                  onChange={(e) => setNewHandover({...newHandover, group: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                >
                  <option value="">Select Group</option>
                  {groups.map(group => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>IT Request ID</label>
                <input
                  type="text"
                  value={newHandover.itRequestId}
                  onChange={(e) => setNewHandover({...newHandover, itRequestId: e.target.value})}
                  placeholder="IT-REQ-2024-001"
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
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>ITHO Number</label>
                <input
                  type="text"
                  value={newHandover.ithoNumber}
                  onChange={(e) => setNewHandover({...newHandover, ithoNumber: e.target.value})}
                  placeholder="ITHO-2024-001"
                  style={{
                    width: '92%',
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Handover To *</label>
                <input
                  type="text"
                  value={newHandover.handoverTo}
                  onChange={(e) => setNewHandover({...newHandover, handoverTo: e.target.value})}
                  placeholder="Employee Name"
                  style={{
                    width: '92%',
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Employee Number</label>
                <input
                  type="text"
                  value={newHandover.employeeNo}
                  onChange={(e) => setNewHandover({...newHandover, employeeNo: e.target.value})}
                  placeholder="EMP001"
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
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Designation</label>
                <input
                  type="text"
                  value={newHandover.designation}
                  onChange={(e) => setNewHandover({...newHandover, designation: e.target.value})}
                  placeholder="IT Specialist"
                  style={{
                    width: '93%',
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Company Name</label>
                <select
                  value={newHandover.companyName}
                  onChange={(e) => setNewHandover({...newHandover, companyName: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                >
                  <option value="">Select Company</option>
                  {companies.map(company => (
                    <option key={company} value={company}>{company}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Handover Date *</label>
                <input
                  type="date"
                  value={newHandover.handoverDate}
                  onChange={(e) => setNewHandover({...newHandover, handoverDate: e.target.value})}
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
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Estimated Return Date</label>
                <input
                  type="date"
                  value={newHandover.estimatedReturnDate}
                  onChange={(e) => setNewHandover({...newHandover, estimatedReturnDate: e.target.value})}
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
          </div>

          {/* Items Section */}
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '6px',
            marginBottom: '20px',
            border: '1px solid #dee2e6'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#495057' }}>
              📦 Equipment Items
            </h3>

            {/* Add Item Form */}
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '16px',
              borderRadius: '6px',
              marginBottom: '16px',
              border: '1px solid #e9ecef'
            }}>
              <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>➕ Add Item</h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px', fontSize: '13px' }}>Asset Tag No *</label>
                  <input
                    type="text"
                    value={newItem.sercoAssetTagNo}
                    onChange={(e) => setNewItem({...newItem, sercoAssetTagNo: e.target.value})}
                    placeholder="SER-IT-001"
                    style={{
                      width: '90%',
                      padding: '6px 10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '13px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px', fontSize: '13px' }}>Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={newItem.qty}
                    onChange={(e) => setNewItem({...newItem, qty: parseInt(e.target.value)})}
                    style={{
                      width: '90%',
                      padding: '6px 10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '13px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px', fontSize: '13px' }}>Brand *</label>
                  <input
                    type="text"
                    value={newItem.brand}
                    onChange={(e) => setNewItem({...newItem, brand: e.target.value})}
                    placeholder="Dell, HP, Lenovo..."
                    style={{
                      width: '90%',
                      padding: '6px 10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '13px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px', fontSize: '13px' }}>Model *</label>
                  <input
                    type="text"
                    value={newItem.model}
                    onChange={(e) => setNewItem({...newItem, model: e.target.value})}
                    placeholder="Latitude 5520"
                    style={{
                      width: '90%',
                      padding: '6px 10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '13px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px', fontSize: '13px' }}>Serial Number</label>
                  <input
                    type="text"
                    value={newItem.serialNumber}
                    onChange={(e) => setNewItem({...newItem, serialNumber: e.target.value})}
                    placeholder="ABC123456"
                    style={{
                      width: '90%',
                      padding: '6px 10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '13px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px', fontSize: '13px' }}>Condition</label>
                  <select
                    value={newItem.inGoodCondition}
                    onChange={(e) => setNewItem({...newItem, inGoodCondition: e.target.value as 'YES' | 'NO' | ''})}
                    style={{
                      width: '100%',
                      padding: '6px 10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '13px'
                    }}
                  >
                    <option value="">Select</option>
                    <option value="YES">✅ YES</option>
                    <option value="NO">❌ NO</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px', fontSize: '13px' }}>Remarks</label>
                <textarea
                  value={newItem.remarks}
                  onChange={(e) => setNewItem({...newItem, remarks: e.target.value})}
                  placeholder="Additional notes about the item..."
                  rows={2}
                  style={{
                    width: '98%',
                    padding: '6px 10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '13px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <button
                onClick={addItemToHandover}
                disabled={!newItem.sercoAssetTagNo || !newItem.brand || !newItem.model}
                style={{
                  backgroundColor: newItem.sercoAssetTagNo && newItem.brand && newItem.model ? '#28a745' : '#6c757d',
                  color: 'white',
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  cursor: newItem.sercoAssetTagNo && newItem.brand && newItem.model ? 'pointer' : 'not-allowed'
                }}
              >
                ➕ Add Item to List
              </button>
            </div>

            {/* Items List */}
            {newHandover.items && newHandover.items.length > 0 && (
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>
                  📋 Items List ({newHandover.items.length})
                </h4>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #dee2e6' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8f9fa' }}>
                        <th style={{ padding: '10px', border: '1px solid #dee2e6', fontSize: '13px', fontWeight: 'bold' }}>Asset Tag No</th>
                        <th style={{ padding: '10px', border: '1px solid #dee2e6', fontSize: '13px', fontWeight: 'bold' }}>Qty</th>
                        <th style={{ padding: '10px', border: '1px solid #dee2e6', fontSize: '13px', fontWeight: 'bold' }}>Brand</th>
                        <th style={{ padding: '10px', border: '1px solid #dee2e6', fontSize: '13px', fontWeight: 'bold' }}>Model</th>
                        <th style={{ padding: '10px', border: '1px solid #dee2e6', fontSize: '13px', fontWeight: 'bold' }}>Serial No</th>
                        <th style={{ padding: '10px', border: '1px solid #dee2e6', fontSize: '13px', fontWeight: 'bold' }}>Condition</th>
                        <th style={{ padding: '10px', border: '1px solid #dee2e6', fontSize: '13px', fontWeight: 'bold' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {newHandover.items.map((item, index) => (
                        <tr key={item.id} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f8f9fa' }}>
                          <td style={{ padding: '8px', border: '1px solid #dee2e6', fontSize: '12px' }}>{item.sercoAssetTagNo}</td>
                          <td style={{ padding: '8px', border: '1px solid #dee2e6', fontSize: '12px', textAlign: 'center' }}>{item.qty}</td>
                          <td style={{ padding: '8px', border: '1px solid #dee2e6', fontSize: '12px' }}>{item.brand}</td>
                          <td style={{ padding: '8px', border: '1px solid #dee2e6', fontSize: '12px' }}>{item.model}</td>
                          <td style={{ padding: '8px', border: '1px solid #dee2e6', fontSize: '12px' }}>{item.serialNumber}</td>
                          <td style={{ padding: '8px', border: '1px solid #dee2e6', fontSize: '12px', textAlign: 'center' }}>
                            {item.inGoodCondition === 'YES' ? '✅' : item.inGoodCondition === 'NO' ? '❌' : '-'}
                          </td>
                          <td style={{ padding: '8px', border: '1px solid #dee2e6', textAlign: 'center' }}>
                            <button
                              onClick={() => removeItemFromHandover(item.id)}
                              style={{
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '3px',
                                padding: '4px 8px',
                                fontSize: '11px',
                                cursor: 'pointer'
                              }}
                            >
                              🗑️ Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmitHandover}
            disabled={!newHandover.handoverTo || !newHandover.handoverDate || !newHandover.items?.length}
            style={{
              backgroundColor: (newHandover.handoverTo && newHandover.handoverDate && newHandover.items?.length) ? '#28a745' : '#6c757d',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: (newHandover.handoverTo && newHandover.handoverDate && newHandover.items?.length) ? 'pointer' : 'not-allowed'
            }}
          >
            ✅ Create Handover Form
          </button>
        </div>
      )}

      {/* Handover Forms List */}
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
          📋 Handover Forms ({handovers.length})
        </h2>

        {handovers.length === 0 ? (
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #e9ecef',
            borderRadius: '8px',
            padding: '40px',
            textAlign: 'center'
          }}>
            <p style={{ color: '#6c757d', fontSize: '16px', marginBottom: '8px' }}>No handover forms found</p>
            <p style={{ color: '#6c757d', fontSize: '14px' }}>Create your first handover form by clicking the button above</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {handovers.map((handover) => (
              <div key={handover.id} style={{
                backgroundColor: 'white',
                border: '1px solid #e9ecef',
                borderRadius: '8px',
                padding: '20px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px', color: '#333' }}>
                      {handover.ithoNumber || 'Draft Form'}
                    </h3>
                    <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>
                      Handover to: <strong>{handover.handoverTo}</strong> • {handover.companyName}
                    </p>
                  </div>
                  <div style={{
                    backgroundColor: getStatusColor(handover.status),
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {getStatusIcon(handover.status)} {handover.status}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <span style={{ fontSize: '13px', color: '#666' }}>Employee No:</span>
                    <p style={{ fontSize: '14px', fontWeight: '500', margin: '2px 0' }}>{handover.employeeNo || '-'}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '13px', color: '#666' }}>Designation:</span>
                    <p style={{ fontSize: '14px', fontWeight: '500', margin: '2px 0' }}>{handover.designation || '-'}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '13px', color: '#666' }}>Handover Date:</span>
                    <p style={{ fontSize: '14px', fontWeight: '500', margin: '2px 0' }}>
                      {handover.handoverDate ? new Date(handover.handoverDate).toLocaleDateString() : '-'}
                    </p>
                  </div>
                  <div>
                    <span style={{ fontSize: '13px', color: '#666' }}>Return Date:</span>
                    <p style={{ fontSize: '14px', fontWeight: '500', margin: '2px 0' }}>
                      {handover.estimatedReturnDate ? new Date(handover.estimatedReturnDate).toLocaleDateString() : '-'}
                    </p>
                  </div>
                  <div>
                    <span style={{ fontSize: '13px', color: '#666' }}>Items Count:</span>
                    <p style={{ fontSize: '14px', fontWeight: '500', margin: '2px 0' }}>
                      📦 {handover.items?.length || 0} items
                    </p>
                  </div>
                  <div>
                    <span style={{ fontSize: '13px', color: '#666' }}>Created:</span>
                    <p style={{ fontSize: '14px', fontWeight: '500', margin: '2px 0' }}>
                      {handover.createdAt ? new Date(handover.createdAt).toLocaleDateString() : '-'}
                    </p>
                  </div>
                </div>

                {/* Items Preview */}
                {handover.items && handover.items.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <p style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>Equipment Items:</p>
                    <div style={{ 
                      backgroundColor: '#f8f9fa', 
                      padding: '12px', 
                      borderRadius: '6px',
                      maxHeight: '120px',
                      overflowY: 'auto'
                    }}>
                      {handover.items.slice(0, 3).map((item, index) => (
                        <div key={index} style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          padding: '4px 0',
                          borderBottom: index < Math.min(handover.items.length - 1, 2) ? '1px solid #e9ecef' : 'none'
                        }}>
                          <span style={{ fontSize: '12px', fontWeight: '500' }}>
                            {item.sercoAssetTagNo} - {item.brand} {item.model}
                          </span>
                          <span style={{ fontSize: '12px', color: '#666' }}>
                            Qty: {item.qty} | {item.inGoodCondition === 'YES' ? '✅' : item.inGoodCondition === 'NO' ? '❌' : '-'}
                          </span>
                        </div>
                      ))}
                      {handover.items.length > 3 && (
                        <p style={{ fontSize: '11px', color: '#666', marginTop: '8px', fontStyle: 'italic' }}>
                          ... and {handover.items.length - 3} more items
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => window.location.href = `/operations/handover/${handover.id}`}
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
                    👁️ View Details
                  </button>
                  
                  {handover.status === 'Draft' && (
                    <button
                      onClick={() => window.location.href = `/operations/handover/${handover.id}/edit`}
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
                      ✏️ Edit
                    </button>
                  )}
                  
                  {handover.status === 'Draft' && (
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to submit this handover form for approval?')) {
                          // Handle submit for approval
                          console.log('Submit for approval:', handover.id)
                        }
                      }}
                      style={{
                        backgroundColor: '#28a745',
                        color: 'white',
                        padding: '8px 16px',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      📤 Submit for Approval
                    </button>
                  )}
                  
                  <button
                    onClick={() => {
                      // Handle print/export
                      window.print()
                    }}
                    style={{
                      backgroundColor: '#6c757d',
                      color: 'white',
                      padding: '8px 16px',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '13px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    🖨️ Print
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