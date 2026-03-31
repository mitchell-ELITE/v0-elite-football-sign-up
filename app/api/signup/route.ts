import { NextRequest, NextResponse } from 'next/server'

// Mocked user storage (in production, this would be Firebase)
const mockUsers = new Map<string, { email?: string; phone?: string; username: string }>()

// Add some mock existing users for testing duplicate detection
mockUsers.set('test@example.com', { email: 'test@example.com', username: 'testuser' })
mockUsers.set('johndoe', { email: 'john@example.com', username: 'johndoe' })

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      fullName,
      email,
      phone,
      countryCode,
      dialCode,
      username,
      dateOfBirth,
      password,
      privacyConsent,
      role,
      ageGroup,
      contactMethod,
    } = body

    // Validate required fields
    if (!fullName || !username || !dateOfBirth || !password || !privacyConsent) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields. Please fill in all fields.' },
        { status: 400 }
      )
    }

    // Check contact method
    if (contactMethod === 'email' && !email) {
      return NextResponse.json(
        { success: false, message: 'Email address is required.' },
        { status: 400 }
      )
    }

    if (contactMethod === 'phone' && !phone) {
      return NextResponse.json(
        { success: false, message: 'Phone number is required.' },
        { status: 400 }
      )
    }

    // Check for duplicate email
    if (email && mockUsers.has(email.toLowerCase())) {
      return NextResponse.json(
        {
          success: false,
          message: 'This email is already registered. Please sign in or use a different email.',
          field: 'email',
        },
        { status: 409 }
      )
    }

    // Check for duplicate username
    const existingUserWithUsername = Array.from(mockUsers.values()).find(
      (u) => u.username.toLowerCase() === username.toLowerCase()
    )
    if (existingUserWithUsername) {
      return NextResponse.json(
        {
          success: false,
          message: 'This username is already taken. Please choose a different one.',
          field: 'username',
        },
        { status: 409 }
      )
    }

    // Validate password requirements
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 8 characters.' },
        { status: 400 }
      )
    }
    if (!/[A-Z]/.test(password)) {
      return NextResponse.json(
        { success: false, message: 'Password must contain at least one uppercase letter.' },
        { status: 400 }
      )
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return NextResponse.json(
        { success: false, message: 'Password must contain at least one special character.' },
        { status: 400 }
      )
    }

    // Simulate async operation (database write)
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Store the user (mocked)
    const userId = `user_${Date.now()}`
    if (email) {
      mockUsers.set(email.toLowerCase(), { email, username })
    }
    if (phone) {
      mockUsers.set(`${dialCode}${phone}`, { phone: `${dialCode}${phone}`, username })
    }
    mockUsers.set(username.toLowerCase(), { email, phone, username })

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Profile created successfully! Please check your email to verify your account.',
      data: {
        userId,
        fullName,
        username,
        email: email || null,
        phone: phone ? `${dialCode}${phone}` : null,
        role,
        ageGroup,
        profileUrl: `footballmarket.com/${username}`,
        requiresEmailVerification: contactMethod === 'email',
        requiresPhoneVerification: contactMethod === 'phone',
      },
    })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again later.' },
      { status: 500 }
    )
  }
}
