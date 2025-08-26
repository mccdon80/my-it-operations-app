// app/api/operations/joiner-leaver/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const process = await prisma.joinerLeaverProcess.findUnique({
      where: { id: params.id },
      include: {
        checklistItems: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    })

    if (!process) {
      return NextResponse.json(
        { error: 'Process not found' },
        { status: 404 }
      )
    }

    // Transform response
    const transformedProcess = {
      ...process,
      checklist: process.checklistItems.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        category: item.category,
        isRequired: item.isRequired,
        documentUrl: item.documentUrl,
        completed: item.completed,
        completedAt: item.completedAt?.toISOString(),
        completedBy: item.completedByName,
        notes: item.notes
      }))
    }

    return NextResponse.json(transformedProcess)
  } catch (error) {
    console.error('Failed to fetch process:', error)
    return NextResponse.json(
      { error: 'Failed to fetch process' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const {
      employeeName,
      employeeId,
      department,
      position,
      manager,
      startDate,
      endDate,
      status,
      notes
    } = body

    const process = await prisma.joinerLeaverProcess.update({
      where: { id: params.id },
      data: {
        employeeName,
        employeeId,
        department,
        position,
        manager,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        status,
        notes
      },
      include: {
        checklistItems: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    })

    // Transform response
    const transformedProcess = {
      ...process,
      checklist: process.checklistItems.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        category: item.category,
        isRequired: item.isRequired,
        documentUrl: item.documentUrl,
        completed: item.completed,
        completedAt: item.completedAt?.toISOString(),
        completedBy: item.completedByName,
        notes: item.notes
      }))
    }

    return NextResponse.json(transformedProcess)
  } catch (error) {
    console.error('Failed to update process:', error)
    return NextResponse.json(
      { error: 'Failed to update process' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if process exists
    const existingProcess = await prisma.joinerLeaverProcess.findUnique({
      where: { id: params.id }
    })

    if (!existingProcess) {
      return NextResponse.json(
        { error: 'Process not found' },
        { status: 404 }
      )
    }

    // Soft delete - mark as deleted instead of hard delete
    const deletedProcess = await prisma.joinerLeaverProcess.update({
      where: { id: params.id },
      data: {
        isDeleted: true,
        updatedAt: new Date()
      }
    })

    return NextResponse.json(
      { 
        message: 'Process deleted successfully',
        deletedProcess: deletedProcess
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Failed to delete process:', error)
    return NextResponse.json(
      { error: 'Failed to delete process' },
      { status: 500 }
    )
  }
}