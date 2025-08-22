"use client"

import { useState, useEffect } from 'react'

export default function RoomsPage() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBuilding, setSelectedBuilding] = useState('')

  useEffect(() => {
    fetchRooms()
  }, [])

  const fetchRooms = async () => {
    try {
      const response = await fetch('/api/rooms')
      const data = await response.json()
      setRooms(data)
    } catch (error) {
      console.error('Failed to fetch rooms:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredRooms = rooms.filter((room: any) => {
    const matchesSearch = room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.roomType?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesBuilding = !selectedBuilding || room.buildingName === selectedBuilding
    return matchesSearch && matchesBuilding
  })

  const buildings = [...new Set(rooms.map((room: any) => room.buildingName))]

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <h1>Loading your 602 rooms...</h1>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
          🏢 Your Rooms Database
        </h1>
        <p style={{ color: '#666', fontSize: '16px' }}>
          All {rooms.length} rooms successfully imported and ready to manage!
        </p>
      </div>

      {/* Search and Filter */}
      <div style={{ marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search rooms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ 
            padding: '8px 12px', 
            border: '1px solid #ddd', 
            borderRadius: '4px',
            fontSize: '14px',
            minWidth: '300px'
          }}
        />
        <select
          value={selectedBuilding}
          onChange={(e) => setSelectedBuilding(e.target.value)}
          style={{ 
            padding: '8px 12px', 
            border: '1px solid #ddd', 
            borderRadius: '4px',
            fontSize: '14px'
          }}
        >
          <option value="">All Buildings</option>
          {buildings.map(building => (
            <option key={building} value={building}>{building}</option>
          ))}
        </select>
      </div>

      {/* Summary Stats */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '16px', 
        marginBottom: '24px' 
      }}>
        <div style={{ backgroundColor: '#e7f3ff', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0066cc' }}>{rooms.length}</div>
          <div style={{ color: '#0066cc' }}>Total Rooms</div>
        </div>
        <div style={{ backgroundColor: '#f0f9ff', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0369a1' }}>{buildings.length}</div>
          <div style={{ color: '#0369a1' }}>Buildings</div>
        </div>
        <div style={{ backgroundColor: '#ecfdf5', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669' }}>{filteredRooms.length}</div>
          <div style={{ color: '#059669' }}>Filtered Results</div>
        </div>
      </div>

      {/* Rooms List */}
      <div style={{ display: 'grid', gap: '12px' }}>
        {filteredRooms.slice(0, 20).map((room: any) => (
          <div key={room.id} style={{ 
            border: '1px solid #e5e7eb', 
            borderRadius: '8px', 
            padding: '16px',
            backgroundColor: '#ffffff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>
                {room.roomNumber}
              </h3>
              <span style={{ 
                backgroundColor: '#dcfce7', 
                color: '#166534', 
                padding: '4px 8px', 
                borderRadius: '4px', 
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {room.currentStatus}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '8px', fontSize: '14px', color: '#6b7280' }}>
              <div><strong>Building:</strong> {room.buildingName}</div>
              <div><strong>Floor:</strong> {room.floorName}</div>
              <div><strong>Type:</strong> {room.roomCategory}</div>
              <div><strong>Size:</strong> {room.roomSizeSqm}m²</div>
              <div><strong>Capacity:</strong> {room.seatingCapacity}</div>
              <div><strong>Owner:</strong> {room.owner}</div>
            </div>
          </div>
        ))}
      </div>

      {filteredRooms.length > 20 && (
        <div style={{ textAlign: 'center', marginTop: '24px', color: '#6b7280' }}>
          Showing first 20 of {filteredRooms.length} rooms. Use search/filter to find specific rooms.
        </div>
      )}
    </div>
  )
}