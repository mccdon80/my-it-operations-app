import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function GET() {
  try {
    const meetings = await prisma.meeting.findMany({
      include: {
        attendees: true,
        actionItems: true
      },
      orderBy: { meetingDate: 'desc' }
    })
    
    return NextResponse.json(meetings)
  } catch (error) {
    console.error('Failed to fetch meetings:', error)
    return NextResponse.json({ error: 'Failed to fetch meetings' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, meetingDate, location, minutesContent } = await request.json()
    
    // For demo purposes, use the first user as the organizer
    const firstUser = await prisma.user.findFirst()
    
    if (!firstUser) {
      return NextResponse.json({ message: 'No users found' }, { status: 400 })
    }
    
    const meeting = await prisma.meeting.create({
      data: {
        title,
        meetingDate: new Date(meetingDate),
        location: location || null,
        organizerId: firstUser.id,
        minutesContent: minutesContent || null,
        status: 'Draft'
      },
      include: {
        attendees: true,
        actionItems: true
      }
    })
    
    return NextResponse.json(meeting, { status: 201 })
  } catch (error) {
    console.error('Failed to create meeting:', error)
    return NextResponse.json({ error: 'Failed to create meeting' }, { status: 500 })
  }
}