// app/api/operations/joiner-leaver/[id]/checklist/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { itemId, notes } = body

    // Get current item status
    const currentItem = await prisma.joinerLeaverChecklistItem.findUnique({
      where: { id: itemId }
    })

    if (!currentItem) {
      return NextResponse.json(
        { error: 'Checklist item not found' },
        { status: 404 }
      )
    }

    // Verify the item belongs to this process
    if (currentItem.processId !== params.id) {
      return NextResponse.json(
        { error: 'Checklist item does not belong to this process' },
        { status: 400 }
      )
    }

    // Toggle completion status
    const updatedItem = await prisma.joinerLeaverChecklistItem.update({
      where: { id: itemId },
      data: {
        completed: !currentItem.completed,
        completedAt: !currentItem.completed ? new Date() : null,
        completedBy: !currentItem.completed ? 'current-user-id' : null, // TODO: Replace with actual user ID from session
        completedByName: !currentItem.completed ? 'Current User' : null, // TODO: Replace with actual user name from session
        notes: notes || currentItem.notes,
        updatedAt: new Date()
      }
    })

    // Recalculate process progress
    const allItems = await prisma.joinerLeaverChecklistItem.findMany({
      where: { 
        processId: params.id,
        isDeleted: false 
      }
    })

    const completedCount = allItems.filter(item => item.completed).length
    const totalCount = allItems.length
    const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

    // Determine new status based on progress
    let newStatus = 'In Progress'
    if (progressPercentage === 100) {
      newStatus = 'Completed'
    } else if (progressPercentage === 0) {
      newStatus = 'Draft'
    }

    // Update process progress
    const updatedProcess = await prisma.joinerLeaverProcess.update({
      where: { id: params.id },
      data: {
        completedItems: completedCount,
        totalItems: totalCount,
        progressPercentage,
        status: newStatus,
        updatedAt: new Date()
      },
      include: {
        checklistItems: {
          where: { isDeleted: false },
          orderBy: { sortOrder: 'asc' }
        }
      }
    })

    // Transform response
    const transformedProcess = {
      ...updatedProcess,
      checklist: updatedProcess.checklistItems.map(item => ({
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
    console.error('Failed to update checklist item:', error)
    return NextResponse.json(
      { error: 'Failed to update checklist item' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, description, category, isRequired, documentUrl } = body

    // Verify the process exists
    const process = await prisma.joinerLeaverProcess.findUnique({
      where: { id: params.id }
    })

    if (!process) {
      return NextResponse.json(
        { error: 'Process not found' },
        { status: 404 }
      )
    }

    // Get current max sort order
    const maxSortOrder = await prisma.joinerLeaverChecklistItem.aggregate({
      where: { 
        processId: params.id,
        isDeleted: false 
      },
      _max: {
        sortOrder: true
      }
    })

    const nextSortOrder = (maxSortOrder._max.sortOrder || 0) + 1

    // Create new checklist item
    const newItem = await prisma.joinerLeaverChecklistItem.create({
      data: {
        processId: params.id,
        title,
        description,
        category,
        isRequired: isRequired || false,
        documentUrl,
        sortOrder: nextSortOrder,
        completed: false
      }
    })

    // Update process total items
    await prisma.joinerLeaverProcess.update({
      where: { id: params.id },
      data: {
        totalItems: {
          increment: 1
        },
        updatedAt: new Date()
      }
    })

    // Transform response
    const transformedItem = {
      id: newItem.id,
      title: newItem.title,
      description: newItem.description,
      category: newItem.category,
      isRequired: newItem.isRequired,
      documentUrl: newItem.documentUrl,
      completed: newItem.completed,
      completedAt: newItem.completedAt?.toISOString(),
      completedBy: newItem.completedByName,
      notes: newItem.notes
    }

    return NextResponse.json(transformedItem, { status: 201 })
  } catch (error) {
    console.error('Failed to create checklist item:', error)
    return NextResponse.json(
      { error: 'Failed to create checklist item' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { itemId } = body

    // Get the item to verify it exists and belongs to this process
    const item = await prisma.joinerLeaverChecklistItem.findUnique({
      where: { id: itemId }
    })

    if (!item) {
      return NextResponse.json(
        { error: 'Checklist item not found' },
        { status: 404 }
      )
    }

    if (item.processId !== params.id) {
      return NextResponse.json(
        { error: 'Checklist item does not belong to this process' },
        { status: 400 }
      )
    }

    // Soft delete the item
    await prisma.joinerLeaverChecklistItem.update({
      where: { id: itemId },
      data: {
        isDeleted: true,
        updatedAt: new Date()
      }
    })

    // Recalculate process progress
    const allActiveItems = await prisma.joinerLeaverChecklistItem.findMany({
      where: { 
        processId: params.id,
        isDeleted: false 
      }
    })

    const completedCount = allActiveItems.filter(item => item.completed).length
    const totalCount = allActiveItems.length
    const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

    // Update process counts
    await prisma.joinerLeaverProcess.update({
      where: { id: params.id },
      data: {
        completedItems: completedCount,
        totalItems: totalCount,
        progressPercentage,
        updatedAt: new Date()
      }
    })

    return NextResponse.json(
      { message: 'Checklist item deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Failed to delete checklist item:', error)
    return NextResponse.json(
      { error: 'Failed to delete checklist item' },
      { status: 500 }
    )
  }
}