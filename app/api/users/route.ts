// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      where: {
        active: true  // Fixed: using 'active' instead of 'isActive'
      },
      select: {
        id: true,
        name: true,     // Fixed: using 'name' instead of firstName/lastName
        email: true,
        department: true,
        role: true
      },
      orderBy: {
        name: 'asc'     // Fixed: using 'name' instead of firstName
      }
    })

    // Transform the data to match what the frontend expects
    const transformedUsers = users.map(user => ({
      id: user.id,
      firstName: user.name?.split(' ')[0] || 'Unknown',
      lastName: user.name?.split(' ').slice(1).join(' ') || '',
      email: user.email,
      department: user.department,
      role: user.role
    }))

    return NextResponse.json(transformedUsers)
  } catch (error) {
    console.error('Failed to fetch users:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, department, role } = await request.json()

    // Validation
    if (!firstName || !email) {
      return NextResponse.json({ 
        message: 'First name and email are required' 
      }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ 
        message: 'User with this email already exists' 
      }, { status: 400 })
    }

    // Combine first and last name into single name field
    const fullName = lastName ? `${firstName} ${lastName}` : firstName

    const user = await prisma.user.create({
      data: {
        name: fullName,           // Fixed: using 'name' instead of firstName/lastName
        email,
        department: department || 'IT',
        role: role || 'EMPLOYEE',
        active: true              // Fixed: using 'active' instead of isActive
      }
    })

    // Transform response to match frontend expectations
    const userResponse = {
      id: user.id,
      firstName: user.name?.split(' ')[0] || 'Unknown',
      lastName: user.name?.split(' ').slice(1).join(' ') || '',
      email: user.email,
      department: user.department,
      role: user.role
    }

    return NextResponse.json(userResponse, { status: 201 })
  } catch (error) {
    console.error('Failed to create user:', error)
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}