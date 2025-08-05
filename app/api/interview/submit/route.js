import { NextResponse } from "next/server"
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export async function POST(request) {
  try {
    const { sessionId, endTime, code, language, responses, userId, interviewType = 'take', domain } = await request.json()

    // Calculate interview duration
    const startTime = new Date(Date.now() - 45 * 60 * 1000) // Mock start time
    const duration = Math.floor((new Date(endTime) - startTime) / 1000 / 60) // in minutes

    // Generate dynamic feedback based on code and responses
    const feedback = await generateFeedback(code, language, responses, duration)

    // Calculate scores
    const scores = calculateScores(code, language, responses)

    // Calculate drill points based on performance and interview type
    const drillPointsChange = calculateDrillPoints(scores, duration, interviewType)

    // Update user's drill points and interview counts
    let drillPointsUpdate = null
    let interviewCountsUpdate = null
    let activityStored = null
    
    if (userId) {
      try {
        // Get current user profile
        const userDoc = await getDoc(doc(db, 'users', userId))
        if (userDoc.exists()) {
          const userData = userDoc.data()
          const currentPoints = userData.drillPoints || 0
          const newPoints = Math.max(0, currentPoints + drillPointsChange)
          
          // Update drill points
          await updateDoc(doc(db, 'users', userId), {
            drillPoints: newPoints,
            interviewsTaken: interviewType === 'take' ? (userData.interviewsTaken || 0) + 1 : userData.interviewsTaken || 0,
            interviewsGiven: interviewType === 'give' ? (userData.interviewsGiven || 0) + 1 : userData.interviewsGiven || 0,
            updatedAt: new Date().toISOString(),
          })
          
          drillPointsUpdate = { success: true, newPoints, pointsChange: drillPointsChange }
          interviewCountsUpdate = { success: true, type: interviewType }
          
          console.log(`Drill points updated for user ${userId}: ${drillPointsChange} points (${interviewType} interview)`)
          
          // Store interview activity
          try {
            console.log('Storing interview activity:', {
              userId,
              sessionId,
              interviewType,
              domain: domain || 'unknown',
              score: scores.overall,
              points: drillPointsChange,
              duration,
              language,
            })
            
            const activityResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/api/interview/activity`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId,
                sessionId,
                interviewType,
                domain: domain || 'unknown',
                score: scores.overall,
                points: drillPointsChange,
                duration,
                language,
              })
            })
            
            const activityResult = await activityResponse.json()
            console.log('Activity storage result:', activityResult)
            
            if (activityResult.success) {
              activityStored = { success: true, activity: activityResult.activity }
              console.log('Interview activity stored successfully')
            } else {
              console.error('Failed to store activity:', activityResult.error)
              activityStored = { success: false, error: activityResult.error }
            }
          } catch (activityError) {
            console.error('Error storing activity:', activityError)
            activityStored = { success: false, error: activityError.message }
          }
        }
      } catch (firestoreError) {
        console.error('Error updating user drill points:', firestoreError)
        drillPointsUpdate = { success: false, error: firestoreError.message }
      }
    }

    // Store interview results (in production, save to database)
    const results = {
      sessionId,
      endTime,
      duration,
      code,
      language,
      responses,
      feedback,
      scores,
      overallScore: scores.overall,
      drillPointsEarned: drillPointsChange,
      interviewType,
      status: "completed",
      createdAt: new Date().toISOString(),
    }

    // In production: await db.interviews.create(results)

    return NextResponse.json({
      success: true,
      sessionId,
      results,
      drillPointsUpdate,
      interviewCountsUpdate,
      activityStored,
      message: "Interview submitted successfully",
    })
  } catch (error) {
    console.error("Submit interview error:", error)
    return NextResponse.json({ success: false, error: "Failed to submit interview" }, { status: 500 })
  }
}

async function generateFeedback(code, language, responses, duration) {
  // Dynamic feedback generation based on code analysis
  const feedback = {
    strengths: [],
    improvements: [],
    detailedFeedback: {},
    recommendations: [],
    nextSteps: [],
  }

  // Analyze code quality
  if (code) {
    if (code.length > 100) {
      feedback.strengths.push("Good code length and detail")
    }

    if (code.includes("function") || code.includes("def") || code.includes("class")) {
      feedback.strengths.push("Proper function/class structure")
    }

    if (code.includes("//") || code.includes("#") || code.includes("/*")) {
      feedback.strengths.push("Good code commenting")
    } else {
      feedback.improvements.push("Add more code comments")
    }

    if (language === "javascript" && code.includes("const") && code.includes("let")) {
      feedback.strengths.push("Proper variable declarations")
    }

    if (language === "python" && code.includes("try:") && code.includes("except:")) {
      feedback.strengths.push("Good error handling")
    }

    if (language === "react" && code.includes("useState") && code.includes("useEffect")) {
      feedback.strengths.push("Proper React hooks usage")
    }
  }

  // Time-based feedback
  if (duration < 30) {
    feedback.improvements.push("Take more time to think through solutions")
  } else if (duration > 40) {
    feedback.improvements.push("Work on solving problems more efficiently")
  } else {
    feedback.strengths.push("Good time management")
  }

  // Generate recommendations
  feedback.recommendations = [
    `Practice more ${language} coding challenges`,
    "Focus on code optimization techniques",
    "Improve problem-solving approach",
    "Work on explaining solutions clearly",
  ]

  feedback.nextSteps = [
    "Take another interview in a different domain",
    "Book a professional mock for detailed feedback",
    "Practice on coding platforms like LeetCode",
    "Join the developer community for peer learning",
  ]

  return feedback
}

function calculateScores(code, language, responses) {
  let codeScore = 50 // Base score
  let communicationScore = 50
  let problemSolvingScore = 50

  // Code quality scoring
  if (code) {
    if (code.length > 50) codeScore += 10
    if (code.includes("function") || code.includes("def")) codeScore += 15
    if (code.includes("//") || code.includes("#")) codeScore += 10
    if (code.includes("return")) codeScore += 10

    // Language-specific scoring
    switch (language) {
      case "javascript":
        if (code.includes("const") || code.includes("let")) codeScore += 5
        if (code.includes("arrow function") || code.includes("=>")) codeScore += 5
        break
      case "python":
        if (code.includes("def ")) codeScore += 5
        if (code.includes("if __name__")) codeScore += 5
        break
      case "react":
        if (code.includes("useState")) codeScore += 10
        if (code.includes("useEffect")) codeScore += 10
        break
    }
  }

  // Communication scoring (mock)
  communicationScore = Math.floor(Math.random() * 30) + 60 // 60-90

  // Problem solving scoring (mock)
  problemSolvingScore = Math.floor(Math.random() * 25) + 65 // 65-90

  // Ensure scores don't exceed 100
  codeScore = Math.min(codeScore, 100)
  communicationScore = Math.min(communicationScore, 100)
  problemSolvingScore = Math.min(problemSolvingScore, 100)

  const overall = Math.round((codeScore + communicationScore + problemSolvingScore) / 3)

  return {
    code: codeScore,
    communication: communicationScore,
    problemSolving: problemSolvingScore,
    overall,
  }
}

// Calculate drill points based on interview type
function calculateDrillPoints(scores, duration, interviewType) {
  if (interviewType === 'take') {
    // Taking an interview directly deducts 120 points
    return -120
  } else if (interviewType === 'give') {
    // Giving an interview directly adds 100 points
    return 100
  }
  
  return 0
}
