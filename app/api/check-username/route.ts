import { NextRequest, NextResponse } from 'next/server'

// Mocked list of taken usernames (in production, this would check Firebase)
const takenUsernames = new Set([
  'admin',
  'support',
  'footballmarket',
  'testuser',
  'johndoe',
  'messi',
  'ronaldo',
  'neymar',
  'mbappe',
  'haaland',
])

// Reserved usernames that cannot be used
const reservedUsernames = new Set([
  'admin',
  'administrator',
  'support',
  'help',
  'api',
  'www',
  'mail',
  'email',
  'root',
  'system',
  'official',
  'verified',
  'footballmarket',
  'elitemarket',
])

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username')

    if (!username) {
      return NextResponse.json(
        { available: false, message: 'Username is required' },
        { status: 400 }
      )
    }

    // Validate username format
    if (username.length < 3) {
      return NextResponse.json(
        { available: false, message: 'Username must be at least 3 characters' },
        { status: 400 }
      )
    }

    if (username.length > 20) {
      return NextResponse.json(
        { available: false, message: 'Username must be at most 20 characters' },
        { status: 400 }
      )
    }

    const usernameRegex = /^[a-zA-Z0-9_]+$/
    if (!usernameRegex.test(username)) {
      return NextResponse.json(
        {
          available: false,
          message: 'Username can only contain letters, numbers, and underscores',
        },
        { status: 400 }
      )
    }

    // Simulate async database lookup
    await new Promise((resolve) => setTimeout(resolve, 300))

    const lowerUsername = username.toLowerCase()

    // Check if reserved
    if (reservedUsernames.has(lowerUsername)) {
      return NextResponse.json({
        available: false,
        message: 'This username is reserved and cannot be used',
      })
    }

    // Check if taken
    const isAvailable = !takenUsernames.has(lowerUsername)

    return NextResponse.json({
      available: isAvailable,
      message: isAvailable
        ? 'Username is available'
        : 'This username is already taken',
      profileUrl: isAvailable ? `footballmarket.com/${username}` : null,
    })
  } catch (error) {
    console.error('Check username error:', error)
    return NextResponse.json(
      { available: false, message: 'Unable to check username availability' },
      { status: 500 }
    )
  }
}
