"use client"

import { useState, useEffect } from 'react'

export default function RoomsPage() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBuilding, setSelectedBuilding] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(20)

  useEffect(() => {
    fetchRooms()
  }, [])

  useEffect(() => {
    // Reset to first page when search/filter changes
    setCurrentPage(1)
  }, [searchTerm, selectedBuilding, itemsPerPage])

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
                         room.roomType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.roomCategory?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.buildingName?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesBuilding = !selectedBuilding || room.buildingName === selectedBuilding
    return matchesSearch && matchesBuilding
  })

  const buildings = [...new Set(rooms.map((room: any) => room.buildingName))]

  // Pagination calculations
  const totalItems = filteredRooms.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedRooms = filteredRooms.slice(startIndex, endIndex)

  // Generate page numbers for pagination display
  const getPageNumbers = () => {
    const delta = 2 // Show 2 pages before and after current page
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items)
    setCurrentPage(1)
  }

/*   if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <h1>Loading your 602 rooms...</h1>
      </div>
    )
  } */

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
      <div style={{ marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search rooms, buildings, types..."
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

        {/* Items per page selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontSize: '14px', color: '#666' }}>Show:</label>
          <select
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            style={{ 
              padding: '6px 8px', 
              border: '1px solid #ddd', 
              borderRadius: '4px',
              fontSize: '14px'
            }}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <label style={{ fontSize: '14px', color: '#666' }}>per page</label>
        </div>
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
        <div style={{ backgroundColor: '#fef3c7', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#d97706' }}>{totalPages}</div>
          <div style={{ color: '#d97706' }}>Total Pages</div>
        </div>
      </div>

      {/* Pagination Info */}
      <div style={{ 
        marginBottom: '16px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        fontSize: '14px',
        color: '#666'
      }}>
        <div>
          Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} rooms
        </div>
        <div>
          Page {currentPage} of {totalPages}
        </div>
      </div>

      {/* Rooms List */}
      <div style={{ display: 'grid', gap: '12px', marginBottom: '24px' }}>
        {paginatedRooms.map((room: any) => (
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

      {/* No Results Message */}
      {filteredRooms.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          backgroundColor: '#f9fafb',
          borderRadius: '8px',
          color: '#6b7280'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>No rooms found</h3>
          <p>Try adjusting your search terms or filters</p>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
          marginTop: '24px',
          paddingTop: '24px',
          borderTop: '1px solid #e5e7eb'
        }}>
          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              backgroundColor: currentPage === 1 ? '#f9fafb' : 'white',
              color: currentPage === 1 ? '#9ca3af' : '#374151',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            ← Previous
          </button>

          {/* Page Numbers */}
          {getPageNumbers().map((page, index) => {
            if (page === '...') {
              return (
                <span key={`dots-${index}`} style={{ padding: '8px 4px', color: '#9ca3af' }}>
                  ...
                </span>
              )
            }

            const isCurrentPage = page === currentPage
            return (
              <button
                key={page}
                onClick={() => handlePageChange(page as number)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  backgroundColor: isCurrentPage ? '#3b82f6' : 'white',
                  color: isCurrentPage ? 'white' : '#374151',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: isCurrentPage ? 'bold' : '500',
                  minWidth: '40px'
                }}
              >
                {page}
              </button>
            )
          })}

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              backgroundColor: currentPage === totalPages ? '#f9fafb' : 'white',
              color: currentPage === totalPages ? '#9ca3af' : '#374151',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Next →
          </button>
        </div>
      )}

      {/* Quick Jump Controls */}
      {totalPages > 10 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '16px',
          marginTop: '16px',
          fontSize: '14px'
        }}>
          <span style={{ color: '#6b7280' }}>Quick jump to page:</span>
          <input
            type="number"
            min="1"
            max={totalPages}
            value={currentPage}
            onChange={(e) => {
              const page = parseInt(e.target.value)
              if (page >= 1 && page <= totalPages) {
                handlePageChange(page)
              }
            }}
            style={{
              width: '60px',
              padding: '6px 8px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              textAlign: 'center'
            }}
          />
          <span style={{ color: '#6b7280' }}>of {totalPages}</span>
        </div>
      )}

      {/* Keyboard Navigation Hint */}
      <div style={{
        textAlign: 'center',
        marginTop: '16px',
        fontSize: '12px',
        color: '#9ca3af'
      }}>
        💡 Tip: Use the search box to quickly find specific rooms by number, building, or type
      </div>
    </div>
  )
}