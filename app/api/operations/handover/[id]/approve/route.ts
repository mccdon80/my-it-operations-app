import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../../lib/prisma'
import { sendHandoverNotificationEmail } from '../../../../../../lib/email-service'

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { action, comments, approverEmail } = await request.json()
    const handoverId = params.id

    if (!action || !approverEmail) {
      return NextResponse.json(
        { message: 'Missing required fields: action and approverEmail' },
        { status: 400 }
      )
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { message: 'Invalid action. Must be "approve" or "reject"' },
        { status: 400 }
      )
    }

    // Get the handover
    const handover = await prisma.assetHandover.findUnique({
      where: { id: handoverId },
      include: {
        assets: true,
        approvals: true
      }
    })

    if (!handover) {
      return NextResponse.json({ message: 'Handover not found' }, { status: 404 })
    }

    // Find the approval record for this approver
    const approval = await prisma.handoverApproval.findFirst({
      where: {
        handoverId: handoverId,
        approverEmail: approverEmail,
        status: 'Pending'
      }
    })

    if (!approval) {
      return NextResponse.json(
        { message: 'Approval record not found or already processed' },
        { status: 404 }
      )
    }

    if (action === 'approve') {
      // Update the approval record
      await prisma.handoverApproval.update({
        where: { id: approval.id },
        data: {
          status: 'Approved',
          approvedAt: new Date(),
          comments: comments
        }
      })

      // Check if all required approvals are complete
      const allApprovals = await prisma.handoverApproval.findMany({
        where: { handoverId: handoverId }
      })

      const allApproved = allApprovals.every(app => app.status === 'Approved')

      if (allApproved) {
        // Update handover status to approved
        await prisma.assetHandover.update({
          where: { id: handoverId },
          data: {
            status: 'Approved',
            approvedBy: approverEmail,
            approvedAt: new Date()
          }
        })

        // Update asset statuses to assigned
        const assetIds = handover.assets.map(asset => asset.assetId)
        await prisma.itAsset.updateMany({
          where: {
            id: { in: assetIds }
          },
          data: {
            status: 'Assigned',
            assignedTo: handover.employeeName,
            assignedDate: new Date()
          }
        })

        // Send approval notification to employee
        await sendHandoverNotificationEmail({
          type: 'handover_approved',
          handover: {
            handoverNumber: handover.handoverNumber,
            employeeName: handover.employeeName,
            employeeEmail: handover.employeeEmail,
            department: handover.department,
            handoverType: handover.handoverType,
            assetCount: handover.assets.length
          },
          recipientEmail: handover.employeeEmail,
          recipientName: handover.employeeName
        })

        // Log the action
        await prisma.systemLog.create({
          data: {
            action: 'HANDOVER_APPROVED',
            entityType: 'asset_handover',
            entityId: handover.id,
            details: `Asset handover ${handover.handoverNumber} approved by ${approverEmail}. ${handover.assets.length} assets assigned to ${handover.employeeName}`
          }
        })

        return NextResponse.json({
          message: 'Handover approved successfully',
          status: 'Approved',
          handoverNumber: handover.handoverNumber
        })
      } else {
        // Still waiting for other approvals
        await prisma.systemLog.create({
          data: {
            action: 'HANDOVER_PARTIAL_APPROVAL',
            entityType: 'asset_handover',
            entityId: handover.id,
            details: `Asset handover ${handover.handoverNumber} partially approved by ${approverEmail}. Waiting for additional approvals.`
          }
        })

        return NextResponse.json({
          message: 'Approval recorded. Waiting for additional approvals.',
          status: 'Pending Approval',
          handoverNumber: handover.handoverNumber
        })
      }

    } else if (action === 'reject') {
      // Update the approval record
      await prisma.handoverApproval.update({
        where: { id: approval.id },
        data: {
          status: 'Rejected',
          approvedAt: new Date(),
          comments: comments
        }
      })

      // Update handover status to rejected
      await prisma.assetHandover.update({
        where: { id: handoverId },
        data: {
          status: 'Rejected',
          rejectionReason: comments
        }
      })

      // Send rejection notification to employee
      await sendHandoverNotificationEmail({
        type: 'handover_rejected',
        handover: {
          handoverNumber: handover.handoverNumber,
          employeeName: handover.employeeName,
          employeeEmail: handover.employeeEmail,
          department: handover.department,
          handoverType: handover.handoverType,
          assetCount: handover.assets.length
        },
        recipientEmail: handover.employeeEmail,
        recipientName: handover.employeeName,
        rejectionReason: comments
      })

      // Log the action
      await prisma.systemLog.create({
        data: {
          action: 'HANDOVER_REJECTED',
          entityType: 'asset_handover',
          entityId: handover.id,
          details: `Asset handover ${handover.handoverNumber} rejected by ${approverEmail}. Reason: ${comments || 'No reason provided'}`
        }
      })

      return NextResponse.json({
        message: 'Handover rejected',
        status: 'Rejected',
        handoverNumber: handover.handoverNumber,
        rejectionReason: comments
      })
    }

  } catch (error) {
    console.error('Failed to process handover approval:', error)
    return NextResponse.json(
      { error: 'Failed to process approval', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}