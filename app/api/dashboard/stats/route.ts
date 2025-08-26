// app/api/dashboard/stats/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get current date range for calculations
    const today = new Date()
    const startOfDay = new Date(today.setHours(0, 0, 0, 0))
    const endOfDay = new Date(today.setHours(23, 59, 59, 999))
    const nextWeek = new Date()
    nextWeek.setDate(nextWeek.getDate() + 7)

    // Run all queries in parallel for better performance
    const [
      pendingLeaves,
      upcomingMeetings,
      activeTrainings,
      teamPresent,
      totalRooms,
      activeProjects,
      pendingHandovers,
      joinerLeaverProcesses,
      recentLeaveActivity,
      recentTrainingActivity,
      recentHandoverActivity,
      recentJoinerLeaverActivity
    ] = await Promise.all([
      // Pending leave applications
      prisma.leaveApplication.count({
        where: { status: 'Pending' }
      }),

      // Upcoming meetings (next 7 days)
      prisma.meeting.count({
        where: { 
          meetingDate: {
            gte: today,
            lte: nextWeek
          },
          status: { not: 'Cancelled' }
        }
      }),

      // Active training plans
      prisma.trainingPlan.count({
        where: { status: 'Planned' }
      }),

      // Team present today
      prisma.teamAttendance.count({
        where: {
          attendanceDate: {
            gte: startOfDay,
            lte: endOfDay
          },
          status: 'Present'
        }
      }),

      // Total rooms
      prisma.room.count({
        where: { currentStatus: 'Active' }
      }),

      // Active projects (if Project model exists)
      prisma.project.count({
        where: { 
          status: { 
            in: ['Planning', 'In Progress', 'Active'] 
          }
        }
      }).catch(() => 0), // Fallback to 0 if Project model doesn't exist

      // Pending handovers
      prisma.handoverForm.count({
        where: { 
          status: { 
            in: ['Draft', 'Pending'] 
          }
        }
      }),

      // Active joiner/leaver processes
      prisma.joinerLeaverProcess.count({
        where: { 
          status: { 
            in: ['Draft', 'In Progress'] 
          }
        }
      }),

      // Recent leave activity (last 24 hours)
      prisma.leaveApplication.findMany({
        take: 3,
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
          }
        },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          employeeId: true,
          leaveType: true,
          status: true,
          createdAt: true
        }
      }),

      // Recent training activity
      prisma.trainingPlan.findMany({
        take: 3,
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
          }
        },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          trainingName: true,
          trainingType: true,
          status: true,
          createdBy: true,
          createdAt: true
        }
      }),

      // Recent handover activity
      prisma.handoverForm.findMany({
        take: 3,
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
          }
        },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          handoverTo: true,
          status: true,
          createdBy: true,
          createdAt: true
        }
      }),

      // Recent joiner/leaver activity
      prisma.joinerLeaverProcess.findMany({
        take: 3,
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
          }
        },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          employeeName: true,
          type: true,
          status: true,
          createdBy: true,
          createdAt: true
        }
      })
    ])

    // Transform recent activity into a unified format
    const recentActivity = [
      ...recentLeaveActivity.map(item => ({
        id: `leave-${item.id}`,
        type: 'leave' as const,
        description: `New ${item.leaveType.toLowerCase()} leave request submitted`,
        user: item.employeeId || 'Unknown User',
        timestamp: item.createdAt.toISOString(),
        status: item.status
      })),
      ...recentTrainingActivity.map(item => ({
        id: `training-${item.id}`,
        type: 'training' as const,
        description: `Training plan created: ${item.trainingName}`,
        user: item.createdBy || 'Unknown User',
        timestamp: item.createdAt.toISOString(),
        status: item.status
      })),
      ...recentHandoverActivity.map(item => ({
        id: `handover-${item.id}`,
        type: 'handover' as const,
        description: `Equipment handover created for ${item.handoverTo}`,
        user: item.createdBy || 'Unknown User',
        timestamp: item.createdAt.toISOString(),
        status: item.status
      })),
      ...recentJoinerLeaverActivity.map(item => ({
        id: `joiner-leaver-${item.id}`,
        type: 'joiner-leaver' as const,
        description: `${item.type.toLowerCase()} process started for ${item.employeeName}`,
        user: item.createdBy || 'Unknown User',
        timestamp: item.createdAt.toISOString(),
        status: item.status
      }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    const dashboardStats = {
      pendingLeaves,
      upcomingMeetings,
      activeTrainings,
      teamPresent,
      totalRooms,
      activeProjects,
      pendingHandovers,
      joinerLeaverProcesses,
      recentActivity: recentActivity.slice(0, 10) // Limit to 10 most recent items
    }

    return NextResponse.json(dashboardStats)
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error)
    
    // Return fallback data instead of error to prevent dashboard from breaking
    const fallbackStats = {
      pendingLeaves: 0,
      upcomingMeetings: 0,
      activeTrainings: 0,
      teamPresent: 0,
      totalRooms: 0,
      activeProjects: 0,
      pendingHandovers: 0,
      joinerLeaverProcesses: 0,
      recentActivity: []
    }

    return NextResponse.json(fallbackStats)
  }
}