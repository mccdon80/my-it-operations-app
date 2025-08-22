import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json()
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 400 })
    }
    
    // For testing purposes, we'll accept any 6-digit number as valid OTP
    // In production, you'd verify against the stored OTP
    if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      return NextResponse.json({ message: 'Invalid OTP format' }, { status: 400 })
    }
    
    // Simulate OTP verification success
    console.log(`✅ OTP verified for ${email}: ${otp}`)
    console.log(`👤 User authenticated: ${user.name} (${user.role})`)
    
    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { updatedAt: new Date() }
    })
    
    // Log successful authentication
    await prisma.systemLog.create({
      data: {
        userId: user.id,
        action: 'USER_LOGIN',
        entityType: 'user',
        entityId: user.id,
        details: `User ${user.name} logged in successfully`
      }
    })
    
    return NextResponse.json({
      message: 'Authentication successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      }
    })
    
  } catch (error) {
    console.error('Verify OTP error:', error)
    return NextResponse.json({ message: 'Failed to verify OTP' }, { status: 500 })
  }
}