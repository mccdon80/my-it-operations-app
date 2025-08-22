import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET - Fetch specific training plan
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    console.log('Fetching training plan:', id)

    const trainingPlan = await prisma.trainingPlan.findUnique({
      where: { id }
    })

    if (!trainingPlan) {
      return NextResponse.json({ error: 'Training plan not found' }, { status: 404 })
    }

    return NextResponse.json(trainingPlan)

  } catch (error) {
    console.error('Failed to fetch training plan:', error)
    return NextResponse.json({ error: 'Failed to fetch training plan' }, { status: 500 })
  }
}

// PATCH - Update training plan
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const updates = await request.json()
    
    console.log('Updating training plan:', id, 'with:', updates)

    const updatedTrainingPlan = await prisma.trainingPlan.update({
      where: { id },
      data: {
        ...updates,
        scheduleDate: updates.scheduleDate ? new Date(updates.scheduleDate) : undefined,
        cost: updates.cost ? parseFloat(updates.cost) : undefined,
        maxAttendees: updates.maxAttendees ? parseInt(updates.maxAttendees) : undefined
      }
    })

    console.log('Training plan updated:', updatedTrainingPlan.id)
    return NextResponse.json(updatedTrainingPlan)

  } catch (error) {
    console.error('Failed to update training plan:', error)
    return NextResponse.json({ error: 'Failed to update training plan' }, { status: 500 })
  }
}

// DELETE - Delete training plan
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    console.log('Deleting training plan:', id)

    await prisma.trainingPlan.delete({
      where: { id }
    })

    console.log('Training plan deleted:', id)
    return NextResponse.json({ message: 'Training plan deleted successfully' })

  } catch (error) {
    console.error('Failed to delete training plan:', error)
    return NextResponse.json({ error: 'Failed to delete training plan' }, { status: 500 })
  }
}