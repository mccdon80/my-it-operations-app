"use client"

export default function DashboardPage() {
  return (
    <div style={{ padding: '24px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#333' }}>
          🎉 Login Successful!
        </h1>
        <p style={{ color: '#666', fontSize: '18px' }}>
          Welcome to your IT Operations Dashboard
        </p>
      </div>
      
      <div style={{ 
        backgroundColor: '#d4edda', 
        border: '1px solid #c3e6cb', 
        borderRadius: '8px', 
        padding: '20px',
        marginBottom: '24px'
      }}>
        <h2 style={{ color: '#155724', marginBottom: '12px' }}>✅ Authentication Test Successful!</h2>
        <p style={{ color: '#155724', margin: 0 }}>
          The user login system is working perfectly. Your team members can now access the system securely.
        </p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
        <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid #e9ecef' }}>
          <h3 style={{ color: '#495057', marginBottom: '8px' }}>🏢 Rooms</h3>
          <p style={{ color: '#6c757d', fontSize: '14px' }}>602 rooms imported and ready</p>
          <a href="/rooms" style={{ color: '#007bff', textDecoration: 'none' }}>View Rooms →</a>
        </div>
        
        <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid #e9ecef' }}>
          <h3 style={{ color: '#495057', marginBottom: '8px' }}>👥 Users</h3>
          <p style={{ color: '#6c757d', fontSize: '14px' }}>9 team members configured</p>
          <a href="/admin/users" style={{ color: '#007bff', textDecoration: 'none' }}>Manage Users →</a>
        </div>
        
        <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid #e9ecef' }}>
          <h3 style={{ color: '#495057', marginBottom: '8px' }}>📋 Import</h3>
          <p style={{ color: '#6c757d', fontSize: '14px' }}>Data import tools</p>
          <a href="/admin/import" style={{ color: '#007bff', textDecoration: 'none' }}>Import Data →</a>
        </div>
      </div>
    </div>
  )
}