import { NextResponse } from "next/server"
import { doc, setDoc, getDoc, updateDoc, collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

// POST - Submit feedback for an interview
export async function POST(request) {
  try {
    const body = await request.json()
    const { 
      sessionId, 
      interviewerId, 
      intervieweeId, 
      domain, 
      rating, 
      comments, 
      technicalScore, 
      communicationScore, 
      problemSolvingScore 
    } = body

    console.log('Submitting feedback for session:', sessionId)

    if (!sessionId || !interviewerId || !intervieweeId || !domain || !rating) {
      return NextResponse.json({ 
        success: false, 
        error: "Missing required fields" 
      }, { status: 400 })
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ 
        success: false, 
        error: "Rating must be between 1 and 5" 
      }, { status: 400 })
    }

    // Create feedback document
    const feedbackData = {
      sessionId,
      interviewerId,
      intervieweeId,
      domain,
      rating: parseFloat(rating),
      comments: comments || "",
      technicalScore: parseFloat(technicalScore) || 0,
      communicationScore: parseFloat(communicationScore) || 0,
      problemSolvingScore: parseFloat(problemSolvingScore) || 0,
      timestamp: new Date().toISOString(),
      // Calculate overall score
      overallScore: calculateOverallScore(rating, technicalScore, communicationScore, problemSolvingScore)
    }

    // Store feedback in Firestore
    await setDoc(doc(db, 'feedback', sessionId), feedbackData)

    // Update interviewee's feedback stats
    await updateUserFeedbackStats(intervieweeId, feedbackData)

    // Calculate achievements for feedback received
    try {
      console.log('Calculating achievements for feedback received')
      const achievementResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/api/achievements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: intervieweeId,
          action: 'feedback_received',
          data: feedbackData
        })
      })
      const achievementResult = await achievementResponse.json()
      console.log('Achievement calculation result:', achievementResult)
      if (achievementResult.success && achievementResult.newAchievements.length > 0) {
        console.log(`Awarded ${achievementResult.newAchievements.length} new achievements for feedback`)
      }
    } catch (achievementError) {
      console.error('Error calculating achievements for feedback:', achievementError)
    }

    console.log('Feedback submitted successfully for session:', sessionId)

    return NextResponse.json({
      success: true,
      message: "Feedback submitted successfully",
      feedback: feedbackData
    })

  } catch (error) {
    console.error('Error submitting feedback:', error)
    return NextResponse.json({ 
      success: false, 
      error: "Failed to submit feedback",
      details: error.message 
    }, { status: 500 })
  }
}

// GET - Retrieve feedback for a user
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const limit = parseInt(searchParams.get("limit") || "10")

    console.log('Fetching feedback for user:', userId, 'limit:', limit)

    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        error: "User ID is required" 
      }, { status: 400 })
    }

    // Get feedback where user is the interviewee
    const feedbackRef = collection(db, 'feedback')
    const feedbackQuery = query(
      feedbackRef,
      where('intervieweeId', '==', userId),
      orderBy('timestamp', 'desc'),
      orderBy('timestamp', 'desc'),
    )

    const querySnapshot = await getDocs(feedbackQuery)
    const feedback = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      feedback.push({
        id: doc.id,
        ...data,
        formattedDate: formatRelativeTime(data.timestamp)
      })
    })

    console.log(`Retrieved ${feedback.length} feedback entries for user ${userId}`)

    return NextResponse.json({
      success: true,
      feedback,
      message: "Feedback retrieved successfully"
    })

  } catch (error) {
    console.error('Error retrieving feedback:', error)
    return NextResponse.json({ 
      success: false, 
      error: "Failed to retrieve feedback",
      details: error.message 
    }, { status: 500 })
  }
}

// Helper function to calculate overall score
function calculateOverallScore(rating, technicalScore, communicationScore, problemSolvingScore) {
  const weights = {
    rating: 0.4,
    technical: 0.25,
    communication: 0.2,
    problemSolving: 0.15
  }

  return (
    (rating * weights.rating) +
    ((technicalScore || 0) * weights.technical) +
    ((communicationScore || 0) * weights.communication) +
    ((problemSolvingScore || 0) * weights.problemSolving)
  )
}

// Helper function to update user feedback stats
async function updateUserFeedbackStats(userId, feedbackData) {
  try {
    const userRef = doc(db, 'users', userId)
    const userDoc = await getDoc(userRef)
    
    if (userDoc.exists()) {
      const userData = userDoc.data()
      const currentStats = userData.feedbackStats || {
        totalFeedback: 0,
        averageRating: 0,
        totalRating: 0,
        averageOverallScore: 0,
        totalOverallScore: 0,
        domains: {}
      }

      // Update stats
      const newTotalFeedback = currentStats.totalFeedback + 1
      const newTotalRating = currentStats.totalRating + feedbackData.rating
      const newTotalOverallScore = currentStats.totalOverallScore + feedbackData.overallScore
      
      const updatedStats = {
        totalFeedback: newTotalFeedback,
        averageRating: newTotalRating / newTotalFeedback,
        totalRating: newTotalRating,
        averageOverallScore: newTotalOverallScore / newTotalFeedback,
        totalOverallScore: newTotalOverallScore,
        domains: {
          ...currentStats.domains,
          [feedbackData.domain]: (currentStats.domains[feedbackData.domain] || 0) + 1
        }
      }

      await updateDoc(userRef, {
        feedbackStats: updatedStats,
        updatedAt: new Date().toISOString()
      })

      console.log('Updated feedback stats for user:', userId)
    }
  } catch (error) {
    console.error('Error updating user feedback stats:', error)
  }
}

// Helper function to format relative time
function formatRelativeTime(timestamp) {
  const now = new Date()
  const time = new Date(timestamp)
  const diffInSeconds = Math.floor((now - time) / 1000)

  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`
  return `${Math.floor(diffInSeconds / 2592000)}mo ago`
}
