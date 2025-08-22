import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function GET() {
  try {
    const assets = await prisma.itAsset.findMany({
      where: {
        status: 'Available'
      },
      orderBy: [
        { assetType: 'asc' },
        { assetTag: 'asc' }
      ]
    })

    return NextResponse.json(assets)
  } catch (error) {
    console.error('Failed to fetch available assets:', error)
    return NextResponse.json({ error: 'Failed to fetch available assets' }, { status: 500 })
  }
}