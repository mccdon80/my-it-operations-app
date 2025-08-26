// app/api/operations/joiner-leaver/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const processes = await prisma.joinerLeaverProcess.findMany({
      include: {
        checklistItems: {
          orderBy: { sortOrder: 'asc' }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform data to match frontend interface
    const transformedProcesses = processes.map(process => ({
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
    }))

    return NextResponse.json(transformedProcesses)
  } catch (error) {
    console.error('Failed to fetch joiner/leaver processes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch processes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      type,
      employeeName,
      employeeId,
      department,
      position,
      manager,
      startDate,
      endDate,
      checklist = []
    } = body

    // Create process with checklist items
    const process = await prisma.joinerLeaverProcess.create({
      data: {
        type,
        employeeName,
        employeeId,
        department,
        position,
        manager,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        status: 'In Progress',
        totalItems: checklist.length,
        completedItems: 0,
        progressPercentage: 0,
        checklistItems: {
          create: checklist.map((item: any, index: number) => ({
            title: item.title,
            description: item.description,
            category: item.category,
            isRequired: item.isRequired,
            documentUrl: item.documentUrl,
            sortOrder: index,
            completed: false
          }))
        }
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

    return NextResponse.json(transformedProcess, { status: 201 })
  } catch (error) {
    console.error('Failed to create joiner/leaver process:', error)
    return NextResponse.json(
      { error: 'Failed to create process' },
      { status: 500 }
    )
  }
}