// app/api/operations/handover/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from  '../../../../../lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const handover = await prisma.handoverForm.findUnique({
      where: { id: params.id },
      include: {
        items: true
      }
    })

    if (!handover) {
      return NextResponse.json(
        { error: 'Handover form not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(handover)
  } catch (error) {
    console.error('Failed to fetch handover form:', error)
    return NextResponse.json(
      { error: 'Failed to fetch handover form' },
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
      group,
      itRequestId,
      ithoNumber,
      handoverTo,
      employeeNo,
      designation,
      companyName,
      handoverDate,
      estimatedReturnDate,
      items,
      status,
      requestorSignature,
      requestorDate,
      approverSignature,
      approverDate,
      departmentHeadSignature,
      departmentHeadDate
    } = body

    // Update handover form
    const handover = await prisma.handoverForm.update({
      where: { id: params.id },
      data: {
        group,
        itRequestId,
        ithoNumber,
        handoverTo,
        employeeNo,
        designation,
        companyName,
        handoverDate: handoverDate ? new Date(handoverDate) : null,
        estimatedReturnDate: estimatedReturnDate ? new Date(estimatedReturnDate) : null,
        status,
        requestorSignature,
        requestorDate: requestorDate ? new Date(requestorDate) : null,
        approverSignature,
        approverDate: approverDate ? new Date(approverDate) : null,
        departmentHeadSignature,
        departmentHeadDate: departmentHeadDate ? new Date(departmentHeadDate) : null,
        // Update items if provided
        ...(items && {
          items: {
            deleteMany: {}, // Delete existing items
            create: items.map((item: any) => ({
              sercoAssetTagNo: item.sercoAssetTagNo,
              qty: item.qty,
              brand: item.brand,
              model: item.model,
              serialNumber: item.serialNumber,
              inGoodCondition: item.inGoodCondition,
              remarks: item.remarks
            }))
          }
        })
      },
      include: {
        items: true
      }
    })

    return NextResponse.json(handover)
  } catch (error) {
    console.error('Failed to update handover form:', error)
    return NextResponse.json(
      { error: 'Failed to update handover form' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Delete handover form (items will be deleted due to cascade)
    await prisma.handoverForm.delete({
      where: { id: params.id }
    })

    return NextResponse.json(
      { message: 'Handover form deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Failed to delete handover form:', error)
    return NextResponse.json(
      { error: 'Failed to delete handover form' },
      { status: 500 }
    )
  }
}