import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

// GET - Fetch all training plans
export async function GET() {
  try {
    console.log('Fetching training plans from database...')
    
    const trainingPlans = await prisma.trainingPlan.findMany({
      orderBy: { createdAt: 'desc' }
    })

    console.log(`Found ${trainingPlans.length} training plans`)
    return NextResponse.json(trainingPlans)

  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to fetch training plans' }, { status: 500 })
  }
}

// POST - Create new training plan
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      trainingName,
      trainingType,
      scheduleDate,
      cost,
      maxAttendees,
      remarks,
      status
    } = body

    console.log('Creating training plan:', { trainingName, trainingType, status })

    const trainingPlan = await prisma.trainingPlan.create({
      data: {
        trainingName,
        trainingType,
        scheduleDate: scheduleDate ? new Date(scheduleDate) : null,
        cost: cost ? parseFloat(cost) : null,
        maxAttendees: maxAttendees ? parseInt(maxAttendees) : null,
        remarks: remarks || null,
        status: status || 'Planned',
        createdBy: 'system' // TODO: Get from actual user session
      }
    })

    console.log('Training plan created:', trainingPlan.id)
    return NextResponse.json(trainingPlan, { status: 201 })

  } catch (error) {
    console.error('Failed to create training plan:', error)
    return NextResponse.json({ error: 'Failed to create training plan' }, { status: 500 })
  }
}