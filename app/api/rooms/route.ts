import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching rooms from database...')
    
    const rooms = await prisma.room.findMany({
      include: {
        floor: {
          include: {
            building: {
              include: {
                campus: true
              }
            }
          }
        }
      },
      orderBy: { roomNumber: 'asc' }
    })

    console.log(`Found ${rooms.length} rooms`)

    // Transform the data to match what the frontend expects
    const transformedRooms = rooms.map(room => ({
      id: room.id,
      roomNumber: room.roomNumber,
      campusName: room.campusName,
      buildingName: room.buildingName,
      floorName: room.floorName,
      ownership: room.ownership,
      owner: room.owner,
      customerNote: room.customerNote,
      otherRemarks: room.otherRemarks,
      roomSizeSqm: room.roomSizeSqm,
      seatingCapacity: room.seatingCapacity,
      roomHeight: room.roomHeight,
      paintColorCode: room.paintColorCode,
      roomCategory: room.roomCategory,
      roomType: room.roomType,
      elvIdfBdfRoom: room.elvIdfBdfRoom,
      distanceMeters: room.distanceMeters,
      remarks: room.remarks,
      currentStatus: room.currentStatus,
      lastUpdated: room.lastUpdated,
      createdAt: room.createdAt
    }))

    return NextResponse.json(transformedRooms)

  } catch (error) {
    console.error('Failed to fetch rooms:', error)
    return NextResponse.json(
      { error: 'Failed to fetch rooms', details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    )
  }
}