import { NextResponse } from 'next/server'

// Mocked pro count (in production, this would fetch from Firebase)
// Updated every 7 days according to spec
let cachedCount = {
  count: 5247,
  lastUpdated: Date.now(),
}

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

export async function GET() {
  try {
    // Check if cache is stale (older than 7 days)
    const now = Date.now()
    if (now - cachedCount.lastUpdated > SEVEN_DAYS_MS) {
      // In production, this would fetch from Firebase
      // Simulating a slight increase in users
      cachedCount = {
        count: cachedCount.count + Math.floor(Math.random() * 100) + 50,
        lastUpdated: now,
      }
    }

    return NextResponse.json({
      count: cachedCount.count,
      formattedCount: cachedCount.count.toLocaleString(),
      lastUpdated: new Date(cachedCount.lastUpdated).toISOString(),
    })
  } catch (error) {
    console.error('Pro count error:', error)
    // Return fallback count on error
    return NextResponse.json({
      count: 5000,
      formattedCount: '5,000',
      lastUpdated: null,
    })
  }
}
