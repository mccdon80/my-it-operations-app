import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function GET() {
  try {
    const leaves = await prisma.leaveApplication.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(leaves)
  } catch (error) {
    console.error('Failed to fetch leave applications:', error)
    return NextResponse.json({ error: 'Failed to fetch leave applications' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { leaveType, startDate, endDate, reason } = await request.json()
    
    // Calculate days count
    const start = new Date(startDate)
    const end = new Date(endDate)
    const daysCount = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
    
    // For demo purposes, use the first user as the employee
    // In a real app, this would come from the authenticated session
    const firstUser = await prisma.user.findFirst()
    
    if (!firstUser) {
      return NextResponse.json({ message: 'No users found' }, { status: 400 })
    }
    
    const leave = await prisma.leaveApplication.create({
      data: {
        employeeId: firstUser.id,
        leaveType,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        daysCount,
        reason: reason || null,
        status: 'Pending'
      }
    })
    
    return NextResponse.json(leave, { status: 201 })
  } catch (error) {
    console.error('Failed to create leave application:', error)
    return NextResponse.json({ error: 'Failed to create leave application' }, { status: 500 })
  }
}