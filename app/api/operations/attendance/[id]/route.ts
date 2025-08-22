// app/api/operations/attendance/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { status, checkInTime, checkOutTime, remarks } = await request.json()
    const { id: attendanceId } = await params

    // Get current record to preserve existing data
    const currentRecord = await prisma.teamAttendance.findUnique({
      where: { id: attendanceId }
    })

    if (!currentRecord) {
      return NextResponse.json({ error: 'Attendance record not found' }, { status: 404 })
    }

    // Prepare update data
    const updateData: any = {}
    
    if (status !== undefined) updateData.status = status
    if (remarks !== undefined) updateData.remarks = remarks

    // Handle time fields - convert HH:MM to DateTime
    if (checkInTime !== undefined) {
      if (checkInTime) {
        const [hours, minutes] = checkInTime.split(':')
        const checkInDateTime = new Date(currentRecord.attendanceDate)
        checkInDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0)
        updateData.checkInTime = checkInDateTime
      } else {
        updateData.checkInTime = null
      }
    }

    if (checkOutTime !== undefined) {
      if (checkOutTime) {
        const [hours, minutes] = checkOutTime.split(':')
        const checkOutDateTime = new Date(currentRecord.attendanceDate)
        checkOutDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0)
        updateData.checkOutTime = checkOutDateTime
      } else {
        updateData.checkOutTime = null
      }
    }

    const updatedAttendance = await prisma.teamAttendance.update({
      where: { id: attendanceId },
      data: updateData
    })

    return NextResponse.json(updatedAttendance)
  } catch (error) {
    console.error('Failed to update attendance record:', error)
    return NextResponse.json({ error: 'Failed to update attendance record' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: attendanceId } = await params

    await prisma.teamAttendance.delete({
      where: { id: attendanceId }
    })

    return NextResponse.json({ message: 'Attendance record deleted successfully' })
  } catch (error) {
    console.error('Failed to delete attendance record:', error)
    return NextResponse.json({ error: 'Failed to delete attendance record' }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: attendanceId } = await params

    const attendance = await prisma.teamAttendance.findUnique({
      where: { id: attendanceId }
    })

    if (!attendance) {
      return NextResponse.json({ error: 'Attendance record not found' }, { status: 404 })
    }

    // Get user details and format times
    const user = await prisma.user.findUnique({
      where: { id: attendance.userId },
      select: { name: true, department: true, email: true }
    })

    // Format check-in/out times back to HH:MM format
    const formatTime = (dateTime: Date | null) => {
      if (!dateTime) return null
      return dateTime.toTimeString().slice(0, 5) // HH:MM format
    }

    const attendanceWithUser = {
      ...attendance,
      userName: user?.name || 'Unknown User',
      userDepartment: user?.department || 'IT',
      userEmail: user?.email,
      checkInTime: formatTime(attendance.checkInTime),
      checkOutTime: formatTime(attendance.checkOutTime)
    }

    return NextResponse.json(attendanceWithUser)
  } catch (error) {
    console.error('Failed to fetch attendance record:', error)
    return NextResponse.json({ error: 'Failed to fetch attendance record' }, { status: 500 })
  }
}