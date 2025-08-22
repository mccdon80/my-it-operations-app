import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    console.log('Import API called')
    
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    console.log('File received:', file.name, file.size)

    // Read the Excel file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    const workbook = XLSX.read(buffer, { type: 'buffer' })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    
    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
    
    console.log('Total rows found:', jsonData.length)
    
    if (jsonData.length === 0) {
      return NextResponse.json({ 
        success: 0, 
        errors: ['Excel file is empty'], 
        created: [] 
      })
    }

    // Get headers from first row
    const headers = jsonData[0] as string[]
    console.log('Headers:', headers)
    
    const results = {
      success: 0,
      errors: [] as string[],
      created: [] as string[],
      summary: {
        totalRows: jsonData.length - 1,
        campuses: [] as string[],
        buildings: [] as string[],
        roomTypes: [] as string[]
      }
    }

    // Process each row (skip header)
    for (let i = 1; i < jsonData.length; i++) {
      try {
        const row = jsonData[i] as any[]
        
        // Map row data to object using headers
        const roomData: any = {}
        headers.forEach((header, index) => {
          if (header && row[index] !== undefined) {
            roomData[header] = row[index]
          }
        })

        // Validate required fields
        if (!roomData['Room Number'] || !roomData['Campus Name'] || !roomData['Building Name'] || !roomData['Floor Name']) {
          results.errors.push(`Row ${i + 1}: Missing required fields (Room Number, Campus, Building, or Floor)`)
          continue
        }

        // Check if room already exists
        const existingRoom = await prisma.room.findUnique({
          where: { roomNumber: roomData['Room Number'] }
        })

        if (existingRoom) {
          results.errors.push(`Row ${i + 1}: Room ${roomData['Room Number']} already exists`)
          continue
        }

        // Find or create campus
        let campus = await prisma.campus.findFirst({
          where: { campusName: roomData['Campus Name'] }
        })

        if (!campus) {
          campus = await prisma.campus.create({
            data: {
              campusName: roomData['Campus Name'],
              campusCode: roomData['Campus Name']
            }
          })
          console.log('Created campus:', campus.campusName)
        }

        // Find or create building
        let building = await prisma.building.findFirst({
          where: {
            campusId: campus.id,
            buildingName: roomData['Building Name']
          }
        })

        if (!building) {
          building = await prisma.building.create({
            data: {
              campusId: campus.id,
              buildingName: roomData['Building Name'],
              buildingCode: roomData['Building Name']
            }
          })
          console.log('Created building:', building.buildingName)
        }

        // Find or create floor
        let floor = await prisma.floor.findFirst({
          where: {
            buildingId: building.id,
            floorName: roomData['Floor Name']
          }
        })

        if (!floor) {
          floor = await prisma.floor.create({
            data: {
              buildingId: building.id,
              floorName: roomData['Floor Name'],
              floorCode: roomData['Floor Name']
            }
          })
          console.log('Created floor:', floor.floorName)
        }

        // Create room
        const room = await prisma.room.create({
          data: {
            floorId: floor.id,
            roomNumber: roomData['Room Number'],
            campusName: roomData['Campus Name'],
            buildingName: roomData['Building Name'],
            floorName: roomData['Floor Name'],
            ownership: roomData['Ownership'],
            owner: roomData['Owner'],
            customerNote: roomData['Customer Note'],
            otherRemarks: roomData['Other Remarks'],
            roomSizeSqm: roomData['Room Size (Sqm)'] ? parseFloat(roomData['Room Size (Sqm)']) : null,
            seatingCapacity: roomData['Seating Capacity'] ? parseInt(roomData['Seating Capacity']) : null,
            roomHeight: roomData['Room Height']?.toString(),
            paintColorCode: roomData['Paint Color Code'],
            roomCategory: roomData['Room Category'],
            roomType: roomData['Room Type'],
            elvIdfBdfRoom: roomData['ELV/IDF/BDF Room'],
            distanceMeters: roomData['Distance (Meters)'] ? parseFloat(roomData['Distance (Meters)']) : null,
            remarks: roomData['Remarks']
          }
        })

        results.success++
        results.created.push(room.roomNumber)

        // Track summary data
        if (!results.summary.campuses.includes(roomData['Campus Name'])) {
          results.summary.campuses.push(roomData['Campus Name'])
        }
        if (!results.summary.buildings.includes(roomData['Building Name'])) {
          results.summary.buildings.push(roomData['Building Name'])
        }
        if (roomData['Room Type'] && !results.summary.roomTypes.includes(roomData['Room Type'])) {
          results.summary.roomTypes.push(roomData['Room Type'])
        }

        // Log progress every 50 rooms
        if (results.success % 50 === 0) {
          console.log(`Processed ${results.success} rooms...`)
        }

      } catch (error) {
        results.errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    console.log('Import completed:', results.success, 'rooms created,', results.errors.length, 'errors')

    return NextResponse.json(results)

  } catch (error) {
    console.error('Import failed:', error)
    return NextResponse.json({ 
      success: 0, 
      errors: [`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`], 
      created: [] 
    }, { status: 500 })
  }
}