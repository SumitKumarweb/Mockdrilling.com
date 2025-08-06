import { NextResponse } from "next/server"
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

// Update user's daily streak
export async function POST(request) {
  try {
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        error: "User ID is required" 
      }, { status: 400 })
    }

    console.log('Updating streak for user:', userId)

    const userRef = doc(db, 'users', userId)
    const userDoc = await getDoc(userRef)
    
    if (!userDoc.exists()) {
      return NextResponse.json({ 
        success: false, 
        error: "User not found" 
      }, { status: 404 })
    }

    const userData = userDoc.data()
    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD format
    const lastLoginDate = userData.lastLoginDate || null
    const currentStreak = userData.currentStreak || 0
    const longestStreak = userData.longestStreak || 0

    let newStreak = currentStreak
    let streakUpdated = false

    if (!lastLoginDate) {
      // First time login
      newStreak = 1
      streakUpdated = true
    } else {
      const lastLogin = new Date(lastLoginDate)
      const todayDate = new Date(today)
      const diffTime = todayDate.getTime() - lastLogin.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 1) {
        // Consecutive day
        newStreak = currentStreak + 1
        streakUpdated = true
      } else if (diffDays > 1) {
        // Streak broken
        newStreak = 1
        streakUpdated = true
      }
      // If diffDays === 0, same day login, no change
    }

    // Update longest streak if current streak is longer
    const updatedLongestStreak = Math.max(longestStreak, newStreak)

    // Update user data
    const updateData = {
      lastLoginDate: today,
      currentStreak: newStreak,
      longestStreak: updatedLongestStreak,
      updatedAt: new Date().toISOString()
    }

    await updateDoc(userRef, updateData)

    console.log(`Streak updated for user ${userId}: ${currentStreak} -> ${newStreak}`)

    return NextResponse.json({
      success: true,
      streak: {
        current: newStreak,
        longest: updatedLongestStreak,
        updated: streakUpdated,
        lastLogin: today
      },
      message: streakUpdated ? "Streak updated successfully" : "Streak maintained"
    })

  } catch (error) {
    console.error('Error updating streak:', error)
    return NextResponse.json({ 
      success: false, 
      error: "Failed to update streak",
      details: error.message 
    }, { status: 500 })
  }
}

// Get user's streak information
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        error: "User ID is required" 
      }, { status: 400 })
    }

    const userRef = doc(db, 'users', userId)
    const userDoc = await getDoc(userRef)
    
    if (!userDoc.exists()) {
      return NextResponse.json({ 
        success: false, 
        error: "User not found" 
      }, { status: 404 })
    }

    const userData = userDoc.data()
    const streak = {
      current: userData.currentStreak || 0,
      longest: userData.longestStreak || 0,
      lastLogin: userData.lastLoginDate || null
    }

    return NextResponse.json({
      success: true,
      streak,
      message: "Streak information retrieved successfully"
    })

  } catch (error) {
    console.error('Error retrieving streak:', error)
    return NextResponse.json({ 
      success: false, 
      error: "Failed to retrieve streak",
      details: error.message 
    }, { status: 500 })
  }
} 