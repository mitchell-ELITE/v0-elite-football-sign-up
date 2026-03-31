import { NextRequest, NextResponse } from 'next/server'

// Mocked list of taken emails (in production, this would check Firebase)
const takenEmails = new Set([
  'test@example.com',
  'john@example.com',
  'admin@footballmarket.com',
  'support@footballmarket.com',
])

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { available: false, message: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { available: false, message: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    // Simulate async database lookup
    await new Promise((resolve) => setTimeout(resolve, 300))

    const isAvailable = !takenEmails.has(email.toLowerCase())

    return NextResponse.json({
      available: isAvailable,
      message: isAvailable
        ? 'Email is available'
        : 'This email is already registered',
    })
  } catch (error) {
    console.error('Check email error:', error)
    return NextResponse.json(
      { available: false, message: 'Unable to check email availability' },
      { status: 500 }
    )
  }
}
