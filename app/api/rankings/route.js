import { NextResponse } from "next/server"
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const limitCount = parseInt(searchParams.get("limit") || "50")
    const userId = searchParams.get("userId")

    console.log('Fetching rankings, limit:', limitCount, 'userId:', userId)

    // Get all users - we'll sort by composite score after fetching
    const usersRef = collection(db, 'users')
    const rankingsQuery = query(
      usersRef,
      limit(limitCount * 2) // Get more users to account for sorting
    )

    const querySnapshot = await getDocs(rankingsQuery)
    const rankings = []
    let userRank = null

    // First pass: calculate composite scores
    const userScores = []
    querySnapshot.forEach((doc) => {
      const userData = doc.data()
      
      // Calculate feedback-based score
      const feedbackStats = userData.feedbackStats || {}
      const averageRating = feedbackStats.averageRating || 0
      const averageOverallScore = feedbackStats.averageOverallScore || 0
      const totalFeedback = feedbackStats.totalFeedback || 0
      
      // Calculate composite score (drill points + feedback score)
      const feedbackScore = (averageRating * 20) + (averageOverallScore * 10) // Weighted feedback score
      const compositeScore = (userData.drillPoints || 0) + feedbackScore
      
      userScores.push({
        doc,
        userData,
        compositeScore,
        feedbackStats,
        averageRating,
        averageOverallScore,
        totalFeedback,
        feedbackScore: Math.round(feedbackScore)
      })
    })

    // Sort by composite score
    userScores.sort((a, b) => b.compositeScore - a.compositeScore)

    // Second pass: create ranking entries
    userScores.slice(0, limitCount).forEach((userScore, index) => {
      const { doc, userData, compositeScore, feedbackStats, averageRating, averageOverallScore, totalFeedback, feedbackScore } = userScore
      const rank = index + 1
      
      const rankingEntry = {
        rank,
        userId: doc.id,
        name: userData.displayName || userData.name || 'Anonymous',
        email: userData.email || '',
        drillPoints: userData.drillPoints || 0,
        interviewsTaken: userData.interviewsTaken || 0,
        interviewsGiven: userData.interviewsGiven || 0,
        totalInterviews: (userData.interviewsTaken || 0) + (userData.interviewsGiven || 0),
        level: userData.experience === "0" ? "Beginner" : 
               userData.experience === "1" ? "Novice" :
               userData.experience === "2" ? "Intermediate" :
               userData.experience === "3" ? "Advanced" :
               userData.experience === "4" ? "Expert" :
               userData.experience === "5" ? "Master" : "Legend",
        profilePhoto: userData.profilePhoto || '/placeholder.svg?height=120&width=120&text=AD',
        // Feedback-based metrics
        averageRating: parseFloat(averageRating.toFixed(1)),
        averageOverallScore: parseFloat(averageOverallScore.toFixed(1)),
        totalFeedback: totalFeedback,
        feedbackScore: feedbackScore,
        compositeScore: Math.round(compositeScore)
      }

      rankings.push(rankingEntry)

      // Track current user's rank
      if (userId && doc.id === userId) {
        userRank = rankingEntry
      }
    })

    console.log(`Retrieved ${rankings.length} rankings`)

    return NextResponse.json({
      success: true,
      rankings,
      userRank,
      message: "Rankings retrieved successfully"
    })
  } catch (error) {
    console.error('Error retrieving rankings:', error)
    return NextResponse.json({ 
      success: false, 
      error: "Failed to retrieve rankings",
      details: error.message 
    }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { userId, interviewData } = body

    // In a real implementation, you would:
    // 1. Validate the interview data
    // 2. Update user's performance metrics
    // 3. Recalculate rankings
    // 4. Update leaderboard positions

    // Mock interview data validation
    if (!userId || !interviewData) {
      return NextResponse.json({ success: false, error: "Missing required data" }, { status: 400 })
    }

    const { domain, score, type, duration } = interviewData

    if (!domain || score === undefined || !type) {
      return NextResponse.json({ success: false, error: "Invalid interview data" }, { status: 400 })
    }

    if (score < 0 || score > 100) {
      return NextResponse.json({ success: false, error: "Score must be between 0 and 100" }, { status: 400 })
    }

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Mock updated ranking calculation
    const updatedRanking = {
      userId,
      previousRank: 25,
      newRank: 23,
      scoreChange: +2.5,
      pointsEarned: type === "given" ? 100 : -120,
    }

    return NextResponse.json({
      success: true,
      message: "Rankings updated successfully",
      data: updatedRanking,
    })
  } catch (error) {
    console.error("Error updating rankings:", error)
    return NextResponse.json({ success: false, error: "Failed to update rankings" }, { status: 500 })
  }
}
