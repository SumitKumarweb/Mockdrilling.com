import { NextResponse } from "next/server"
import { doc, getDoc, setDoc, updateDoc, collection, query, where, orderBy, limit as firestoreLimit, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

// Store interview activity
export async function POST(request) {
  try {
    const { userId, sessionId, interviewType, domain, score, points, duration, language } = await request.json()

    if (!userId || !sessionId || !interviewType || !domain) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Create activity record
    const activity = {
      userId,
      sessionId,
      interviewType, // 'take' or 'give'
      domain,
      score: score || null,
      points,
      duration: duration || 0,
      language: language || 'none',
      createdAt: new Date().toISOString(),
      timestamp: Date.now(),
    }

    // Store in user's activities subcollection
    const userActivityRef = doc(db, 'users', userId, 'activities', sessionId)
    await setDoc(userActivityRef, activity)

    console.log('Interview activity stored successfully:', activity)

    return NextResponse.json({
      success: true,
      activity,
      message: "Activity stored successfully"
    })
  } catch (error) {
    console.error('Error storing interview activity:', error)
    return NextResponse.json({ success: false, error: "Failed to store activity" }, { status: 500 })
  }
}

// Get user's recent activities
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const limit = parseInt(searchParams.get("limit") || "10")

    console.log('Fetching activities for user:', userId, 'limit:', limit)

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 })
    }

    // Get user's activities from subcollection
    const activitiesRef = collection(db, 'users', userId, 'activities')
    
    try {
      const activitiesQuery = query(
        activitiesRef,
        orderBy('timestamp', 'desc'),
        firestoreLimit(limit)
      )

      const querySnapshot = await getDocs(activitiesQuery)
      const activities = []

      querySnapshot.forEach((doc) => {
        const data = doc.data()
        activities.push({
          id: doc.id,
          ...data,
          // Format date for display
          formattedDate: formatRelativeTime(data.timestamp)
        })
      })

      console.log(`Retrieved ${activities.length} activities for user ${userId}`)

      return NextResponse.json({
        success: true,
        activities,
        message: "Activities retrieved successfully"
      })
    } catch (firestoreError) {
      console.error('Firestore query error:', firestoreError)
      
      // If no activities exist yet, return empty array
      if (firestoreError.code === 'failed-precondition' || firestoreError.code === 'unavailable') {
        console.log('No activities found for user, returning empty array')
        return NextResponse.json({
          success: true,
          activities: [],
          message: "No activities found"
        })
      }
      
      throw firestoreError
    }
  } catch (error) {
    console.error('Error retrieving interview activities:', error)
    return NextResponse.json({ 
      success: false, 
      error: "Failed to retrieve activities",
      details: error.message 
    }, { status: 500 })
  }
}

// Helper function to format relative time
function formatRelativeTime(timestamp) {
  const now = Date.now()
  const diff = now - timestamp
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`
  
  const date = new Date(timestamp)
  return date.toLocaleDateString()
} 