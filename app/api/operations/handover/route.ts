import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import { sendHandoverNotificationEmail } from 'lib/email-service'

// Generate unique handover number
function generateHandoverNumber(): string {
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0')
  return `HO${year}${month}${random}`
}

export async function GET() {
  try {
    const handovers = await prisma.assetHandover.findMany({
      include: {
        assets: true,
        approvals: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(handovers)
  } catch (error) {
    console.error('Failed to fetch handovers:', error)
    return NextResponse.json({ error: 'Failed to fetch handovers' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const {
      employeeName,
      employeeEmail,
      employeeId,
      department,
      position,
      manager,
      managerEmail,
      handoverDate,
      handoverType,
      purpose,
      notes,
      assets
    } = data

    // Validate required fields
    if (!employeeName || !employeeEmail || !department || !assets || assets.length === 0) {
      return NextResponse.json(
        { message: 'Missing required fields: employeeName, employeeEmail, department, and at least one asset' },
        { status: 400 }
      )
    }

    // Generate unique handover number
    let handoverNumber: string
    let isUnique = false
    
    while (!isUnique) {
      handoverNumber = generateHandoverNumber()
      const existing = await prisma.assetHandover.findUnique({
        where: { handoverNumber }
      })
      if (!existing) {
        isUnique = true
      }
    }

    // Create the handover
    const handover = await prisma.assetHandover.create({
      data: {
        handoverNumber: handoverNumber!,
        employeeName,
        employeeEmail,
        employeeId,
        department,
        position,
        manager,
        managerEmail,
        handoverDate: new Date(handoverDate),
        handoverType,
        purpose,
        notes,
        status: 'Draft',
        submittedBy: 'system', // In real app, get from session
        assets: {
          create: assets.map((asset: any) => ({
            assetId: asset.assetId,
            assetTag: asset.assetTag,
            assetType: asset.assetType,
            brand: asset.brand,
            model: asset.model,
            serialNumber: asset.serialNumber,
            condition: asset.condition,
            accessories: asset.accessories,
            notes: asset.notes
          }))
        }
      },
      include: {
        assets: true
      }
    })

    // Create approval workflow
    const approvers = []
    
    // Add manager approval if manager email is provided
    if (managerEmail) {
      approvers.push({
        handoverId: handover.id,
        approverEmail: managerEmail,
        approverName: manager || 'Manager',
        approverRole: 'Manager',
        approvalLevel: 1
      })
    }

    // Add IT Admin approval (you can configure this email)
    approvers.push({
      handoverId: handover.id,
      approverEmail: 'it-admin@company.com', // Configure this
      approverName: 'IT Administrator',
      approverRole: 'IT Admin',
      approvalLevel: 2
    })

    if (approvers.length > 0) {
      await prisma.handoverApproval.createMany({
        data: approvers
      })

      // Update handover status to pending approval
      await prisma.assetHandover.update({
        where: { id: handover.id },
        data: { 
          status: 'Pending Approval',
          submittedAt: new Date()
        }
      })

      // Send notification emails
      try {
        for (const approver of approvers) {
          await sendHandoverNotificationEmail({
            type: 'approval_request',
            handover: {
              handoverNumber: handover.handoverNumber,
              employeeName: handover.employeeName,
              employeeEmail: handover.employeeEmail,
              department: handover.department,
              handoverType: handover.handoverType,
              assetCount: assets.length
            },
            recipientEmail: approver.approverEmail,
            recipientName: approver.approverName
          })
        }

        // Send confirmation to employee
        await sendHandoverNotificationEmail({
          type: 'handover_created',
          handover: {
            handoverNumber: handover.handoverNumber,
            employeeName: handover.employeeName,
            employeeEmail: handover.employeeEmail,
            department: handover.department,
            handoverType: handover.handoverType,
            assetCount: assets.length
          },
          recipientEmail: employeeEmail,
          recipientName: employeeName
        })

        console.log(`📧 Notification emails sent for handover ${handover.handoverNumber}`)
      } catch (emailError) {
        console.error('Failed to send notification emails:', emailError)
        // Don't fail the handover creation if email fails
      }
    }

    // Log the action
    await prisma.systemLog.create({
      data: {
        action: 'HANDOVER_CREATED',
        entityType: 'asset_handover',
        entityId: handover.id,
        details: `Asset handover ${handover.handoverNumber} created for ${employeeName} with ${assets.length} assets`
      }
    })

    return NextResponse.json({
      handoverNumber: handover.handoverNumber,
      id: handover.id,
      status: handover.status,
      message: 'Handover created successfully and approval notifications sent'
    }, { status: 201 })

  } catch (error) {
    console.error('Failed to create handover:', error)
    return NextResponse.json(
      { error: 'Failed to create handover', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}