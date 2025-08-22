import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Return mock data for now - will be replaced with real data later
    return NextResponse.json({
      pendingLeaves: 0,
      upcomingMeetings: 2,
      activeTrainings: 1,
      teamPresent: 7
    })

  } catch (error) {
    console.error('Failed to fetch operations stats:', error)
    return NextResponse.json({
      pendingLeaves: 0,
      upcomingMeetings: 0,
      activeTrainings: 0,
      teamPresent: 0
    })
  }
}