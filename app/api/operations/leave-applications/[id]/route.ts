import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { status } = await request.json()
    const leaveId = params.id
    
    // For demo purposes, use the first manager as the approver
    const manager = await prisma.user.findFirst({
      where: { role: 'Manager' }
    })
    
    const updatedLeave = await prisma.leaveApplication.update({
      where: { id: leaveId },
      data: {
        status,
        approvedBy: manager?.id,
        approvalDate: new Date()
      }
    })
    
    return NextResponse.json(updatedLeave)
  } catch (error) {
    console.error('Failed to update leave application:', error)
    return NextResponse.json({ error: 'Failed to update leave application' }, { status: 500 })
  }
}