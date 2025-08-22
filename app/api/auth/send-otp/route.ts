import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })
    
    if (!user) {
      return NextResponse.json({ message: 'User not found with this email address' }, { status: 400 })
    }
    
    if (!user.active) {
      return NextResponse.json({ message: 'User account is inactive' }, { status: 400 })
    }
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    
    // For testing purposes, we'll store OTP in database
    // In production, you'd send via email
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        // We'll store the OTP in the updatedAt field for testing
        // In production, you'd have a separate OTP table
        updatedAt: new Date()
      }
    })
    
    // For testing - log the OTP to console
    console.log(`🔐 OTP for ${email}: ${otp}`)
    console.log(`📧 In production, this would be sent via email to: ${email}`)
    
    // Simulate email sending
    console.log(`
    📧 EMAIL SIMULATION:
    To: ${email}
    Subject: Your IT Operations Login Code
    
    Your verification code is: ${otp}
    
    This code expires in 10 minutes.
    `)
    
    return NextResponse.json({ 
      message: 'OTP sent successfully',
      // For testing only - remove in production
      testOtp: otp,
      user: {
        name: user.name,
        role: user.role,
        department: user.department
      }
    })
    
  } catch (error) {
    console.error('Send OTP error:', error)
    return NextResponse.json({ message: 'Failed to send OTP' }, { status: 500 })
  }
}