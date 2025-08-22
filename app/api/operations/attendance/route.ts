// app/api/operations/attendance/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    
    let whereClause = {}
    
    if (date) {
      const targetDate = new Date(date)
      const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0))
      const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999))
      
      whereClause = {
        attendanceDate: {
          gte: startOfDay,
          lte: endOfDay
        }
      }
    }

    const attendance = await prisma.teamAttendance.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    })

    // Enhance with user names and format times
    const attendanceWithUsers = await Promise.all(
      attendance.map(async (record) => {
        const user = await prisma.user.findUnique({
          where: { id: record.userId },
          select: { name: true, department: true }
        })

        // Format check-in/out times back to HH:MM format
        const formatTime = (dateTime: Date | null) => {
          if (!dateTime) return null
          return dateTime.toTimeString().slice(0, 5) // HH:MM format
        }

        return {
          ...record,
          userName: user?.name || 'Unknown User',
          userDepartment: user?.department || 'IT',
          checkInTime: formatTime(record.checkInTime),
          checkOutTime: formatTime(record.checkOutTime)
        }
      })
    )

    return NextResponse.json(attendanceWithUsers)
  } catch (error) {
    console.error('Failed to fetch attendance records:', error)
    return NextResponse.json({ error: 'Failed to fetch attendance records' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, attendanceDate, status, checkInTime, checkOutTime, remarks } = await request.json()

    // Validation
    if (!userId || !attendanceDate) {
      return NextResponse.json({ 
        message: 'User ID and attendance date are required' 
      }, { status: 400 })
    }

    // Check if attendance already exists for this user and date
    const existingAttendance = await prisma.teamAttendance.findFirst({
      where: {
        userId,
        attendanceDate: new Date(attendanceDate)
      }
    })

    if (existingAttendance) {
      return NextResponse.json({ 
        message: 'Attendance already marked for this user on this date' 
      }, { status: 400 })
    }

    // Convert time strings to DateTime objects if provided
    let checkInDateTime = null
    let checkOutDateTime = null

    if (checkInTime) {
      const [hours, minutes] = checkInTime.split(':')
      checkInDateTime = new Date(attendanceDate)
      checkInDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0)
    }

    if (checkOutTime) {
      const [hours, minutes] = checkOutTime.split(':')
      checkOutDateTime = new Date(attendanceDate)
      checkOutDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0)
    }

    const attendance = await prisma.teamAttendance.create({
      data: {
        userId,
        attendanceDate: new Date(attendanceDate),
        status,
        checkInTime: checkInDateTime,
        checkOutTime: checkOutDateTime,
        remarks: remarks || null
      }
    })

    return NextResponse.json(attendance, { status: 201 })
  } catch (error) {
    console.error('Failed to create attendance record:', error)
    return NextResponse.json({ error: 'Failed to create attendance record' }, { status: 500 })
  }
}