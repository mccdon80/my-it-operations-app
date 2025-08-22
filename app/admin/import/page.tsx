"use client"

import { useState } from 'react'

export default function RoomImportPage() {
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [results, setResults] = useState<any>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setResults(null)
    }
  }

  const handleImport = async () => {
    if (!file) return
    setImporting(true)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/admin/import-rooms', {
        method: 'POST',
        body: formData
      })
      
      const result = await response.json()
      setResults(result)
    } catch (error) {
      setResults({
        success: 0,
        errors: [`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
        created: []
      })
    } finally {
      setImporting(false)
    }
  }

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
        🏢 Room Data Import
      </h1>
      <p style={{ color: '#666', marginBottom: '32px', fontSize: '16px' }}>
        Import your 602+ rooms from Excel file
      </p>

      {/* Instructions */}
      <div style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', borderRadius: '8px', padding: '20px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: '#495057' }}>
          📋 Excel File Requirements
        </h2>
        <p style={{ marginBottom: '8px', color: '#6c757d' }}>Your Excel file should have these columns:</p>
        <ul style={{ color: '#6c757d', paddingLeft: '20px' }}>
          <li>Room Number (e.g., ADM-00-006)</li>
          <li>Campus Name (e.g., CENTRAL)</li>
          <li>Building Name (e.g., ADM)</li>
          <li>Floor Name (e.g., GF)</li>
          <li>Room Size (Sqm), Seating Capacity, etc.</li>
        </ul>
      </div>

      {/* Upload Section */}
      <div style={{ border: '2px dashed #007bff', borderRadius: '8px', padding: '32px', marginBottom: '24px', textAlign: 'center', backgroundColor: '#f8f9ff' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#007bff' }}>
          📁 Upload Your Room Excel File
        </h2>
        
        <div style={{ marginBottom: '16px' }}>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileSelect}
            disabled={importing}
            style={{ 
              marginRight: '16px',
              padding: '8px',
              fontSize: '14px'
            }}
          />
          <button 
            onClick={handleImport} 
            disabled={!file || importing}
            style={{
              backgroundColor: file && !importing ? '#007bff' : '#6c757d',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '6px',
              cursor: file && !importing ? 'pointer' : 'not-allowed',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            {importing ? '⏳ Importing...' : '🚀 Import Rooms'}
          </button>
        </div>
        
        {file && (
          <div style={{ backgroundColor: '#d1ecf1', padding: '12px', borderRadius: '4px', marginTop: '16px' }}>
            <p style={{ fontSize: '14px', color: '#0c5460', margin: 0 }}>
              ✅ Selected file: <strong>{file.name}</strong> ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          </div>
        )}
        
        {importing && (
          <div style={{ backgroundColor: '#cce7ff', padding: '12px', borderRadius: '4px', marginTop: '16px' }}>
            <p style={{ color: '#004085', margin: 0, fontWeight: 'bold' }}>
              🔄 Processing your room data... Please wait!
            </p>
          </div>
        )}
      </div>

      {/* Results Section */}
      {results && (
        <div style={{ border: '1px solid #dee2e6', borderRadius: '8px', padding: '24px', backgroundColor: '#ffffff' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#333' }}>
            📊 Import Results
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#d4edda', borderRadius: '6px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#155724' }}>{results.success}</div>
              <div style={{ fontSize: '14px', color: '#155724' }}>Rooms Created</div>
            </div>
            <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#f8d7da', borderRadius: '6px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#721c24' }}>{results.errors?.length || 0}</div>
              <div style={{ fontSize: '14px', color: '#721c24' }}>Errors</div>
            </div>
          </div>

          {results.success > 0 && (
            <div style={{ backgroundColor: '#d4edda', border: '1px solid #c3e6cb', padding: '16px', borderRadius: '6px', marginBottom: '16px' }}>
              <strong style={{ color: '#155724' }}>🎉 Success!</strong>
              <p style={{ color: '#155724', margin: '8px 0 0 0' }}>
                Successfully imported {results.success} rooms into your database!
              </p>
            </div>
          )}

          {results.errors?.length > 0 && (
            <div style={{ backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', padding: '16px', borderRadius: '6px' }}>
              <strong style={{ color: '#721c24' }}>⚠️ Errors encountered:</strong>
              <ul style={{ color: '#721c24', marginTop: '8px', paddingLeft: '20px' }}>
                {results.errors.map((error: string, index: number) => (
                  <li key={index} style={{ marginBottom: '4px' }}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {results.success > 0 && (
            <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#e7f3ff', borderRadius: '6px' }}>
              <h3 style={{ color: '#004085', marginBottom: '8px' }}>🎯 Next Steps:</h3>
              <ul style={{ color: '#004085', paddingLeft: '20px' }}>
                <li>View your imported rooms in the system</li>
                <li>Set up user accounts for your team</li>
                <li>Add your AMC contracts</li>
                <li>Start managing your IT operations!</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}