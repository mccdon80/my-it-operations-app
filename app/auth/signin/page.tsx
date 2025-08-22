"use client"

import { useState } from 'react'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSendOTP = async () => {
    setLoading(true)
    setMessage('')
    
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      
      const result = await response.json()
      
      if (response.ok) {
        setStep('otp')
        setMessage('✅ OTP sent to your email! Check your inbox.')
      } else {
        setMessage(`❌ Error: ${result.message}`)
      }
    } catch (error) {
      setMessage('❌ Failed to send OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    setLoading(true)
    setMessage('')
    
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      })
      
      const result = await response.json()
      
      if (response.ok) {
        setMessage('✅ Login successful! Redirecting...')
        // In a real app, this would redirect to dashboard
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 2000)
      } else {
        setMessage(`❌ Error: ${result.message}`)
      }
    } catch (error) {
      setMessage('❌ Failed to verify OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f8f9fa',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>
            🏢 IT Operations
          </h1>
          <p style={{ color: '#666', fontSize: '16px' }}>
            {step === 'email' ? 'Sign in to your account' : 'Enter verification code'}
          </p>
        </div>

        {/* Email Step */}
        {step === 'email' && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@company.com"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e9ecef',
                  borderRadius: '6px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleSendOTP()}
              />
            </div>
            
            <button
              onClick={handleSendOTP}
              disabled={!email || loading}
              style={{
                width: '100%',
                backgroundColor: email && !loading ? '#007bff' : '#6c757d',
                color: 'white',
                padding: '12px',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: email && !loading ? 'pointer' : 'not-allowed'
              }}
            >
              {loading ? '⏳ Sending...' : '📧 Send Verification Code'}
            </button>
          </div>
        )}

        {/* OTP Step */}
        {step === 'otp' && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
                Verification Code
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e9ecef',
                  borderRadius: '6px',
                  fontSize: '24px',
                  textAlign: 'center',
                  letterSpacing: '4px',
                  boxSizing: 'border-box'
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleVerifyOTP()}
              />
              <p style={{ fontSize: '14px', color: '#666', marginTop: '8px', textAlign: 'center' }}>
                Code sent to: {email}
              </p>
            </div>
            
            <button
              onClick={handleVerifyOTP}
              disabled={otp.length !== 6 || loading}
              style={{
                width: '100%',
                backgroundColor: otp.length === 6 && !loading ? '#28a745' : '#6c757d',
                color: 'white',
                padding: '12px',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: otp.length === 6 && !loading ? 'pointer' : 'not-allowed',
                marginBottom: '12px'
              }}
            >
              {loading ? '⏳ Verifying...' : '🔓 Sign In'}
            </button>
            
            <button
              onClick={() => {
                setStep('email')
                setOtp('')
                setMessage('')
              }}
              style={{
                width: '100%',
                backgroundColor: 'transparent',
                color: '#007bff',
                padding: '8px',
                border: '1px solid #007bff',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              ← Back to Email
            </button>
          </div>
        )}

        {/* Message Display */}
        {message && (
          <div style={{
            marginTop: '16px',
            padding: '12px',
            borderRadius: '6px',
            backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da',
            border: `1px solid ${message.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`,
            color: message.includes('✅') ? '#155724' : '#721c24',
            fontSize: '14px',
            textAlign: 'center'
          }}>
            {message}
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '12px', color: '#6c757d' }}>
          Secure email-based authentication<br/>
          No passwords required! 🔒
        </div>
      </div>
    </div>
  )
}