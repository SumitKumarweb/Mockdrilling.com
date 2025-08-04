import { NextResponse } from "next/server"

// Mock database for storing feedback
const feedbackStore = new Map()

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("sessionId")
    const questionId = searchParams.get("questionId")

    if (!sessionId || !questionId) {
      return NextResponse.json({ success: false, error: "Session ID and Question ID are required" }, { status: 400 })
    }

    // Simulate backend processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Check if feedback exists in our mock store
    const feedbackKey = `${sessionId}_${questionId}`
    const existingFeedback = feedbackStore.get(feedbackKey)

    if (existingFeedback) {
      return NextResponse.json({
        success: true,
        feedback: existingFeedback,
        message: "Feedback retrieved successfully",
      })
    }

    // Simulate AI-generated feedback based on question
    const mockFeedbacks = {
      1: {
        suggestions:
          "Consider asking about hoisting behavior and scope differences. Test their understanding of temporal dead zone with let/const.",
        score: Math.floor(Math.random() * 3) + 7, // 7-10
        analysis: "Candidate shows good understanding of variable declarations",
        timestamp: new Date().toISOString(),
      },
      2: {
        suggestions:
          "Dive deeper into reconciliation process and fiber architecture. Ask about performance optimization techniques.",
        score: Math.floor(Math.random() * 3) + 6, // 6-9
        analysis: "Good grasp of Virtual DOM concepts, could improve on implementation details",
        timestamp: new Date().toISOString(),
      },
      3: {
        suggestions:
          "Test their understanding of closure and timing. Compare with throttling and ask for real-world use cases.",
        score: Math.floor(Math.random() * 4) + 6, // 6-10
        analysis: "Strong problem-solving approach, good code structure",
        timestamp: new Date().toISOString(),
      },
    }

    // Randomly decide if backend has processed the feedback yet (70% chance)
    const hasProcessed = Math.random() > 0.3

    if (hasProcessed) {
      const feedback = mockFeedbacks[questionId] || {
        suggestions: "Continue with follow-up questions to assess deeper understanding.",
        score: Math.floor(Math.random() * 4) + 6,
        analysis: "Candidate response is being analyzed",
        timestamp: new Date().toISOString(),
      }

      // Store in mock database
      feedbackStore.set(feedbackKey, feedback)

      return NextResponse.json({
        success: true,
        feedback,
        message: "AI feedback generated successfully",
      })
    } else {
      // Backend hasn't processed yet
      return NextResponse.json({
        success: false,
        error: "Feedback not ready yet",
        pending: true,
        message: "Backend is still processing the candidate's response",
      })
    }
  } catch (error) {
    console.error("Get feedback error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve feedback",
        pending: true,
      },
      { status: 500 },
    )
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { sessionId, questionId, feedback, rating, timestamp } = body

    if (!sessionId || !questionId) {
      return NextResponse.json({ success: false, error: "Session ID and Question ID are required" }, { status: 400 })
    }

    // Store interviewer feedback
    const feedbackKey = `interviewer_${sessionId}_${questionId}`
    const interviewerFeedback = {
      feedback: feedback || "",
      rating: rating || 0,
      timestamp: timestamp || new Date().toISOString(),
      type: "interviewer",
    }

    feedbackStore.set(feedbackKey, interviewerFeedback)

    // In production, save to database
    // await db.feedback.create({
    //   sessionId,
    //   questionId,
    //   feedback,
    //   rating,
    //   timestamp,
    //   type: 'interviewer'
    // })

    return NextResponse.json({
      success: true,
      message: "Feedback saved successfully",
      data: interviewerFeedback,
    })
  } catch (error) {
    console.error("Save feedback error:", error)
    return NextResponse.json({ success: false, error: "Failed to save feedback" }, { status: 500 })
  }
}
