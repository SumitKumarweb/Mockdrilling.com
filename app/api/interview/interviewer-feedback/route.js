import { NextResponse } from "next/server"

// Mock database for storing interviewer feedback
const interviewerFeedbackStore = new Map()

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("sessionId")

    if (!sessionId) {
      return NextResponse.json({ success: false, error: "Session ID is required" }, { status: 400 })
    }

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if interviewer has provided feedback
    const feedbackKey = `interviewer_${sessionId}`
    const feedback = interviewerFeedbackStore.get(feedbackKey)

    if (feedback) {
      return NextResponse.json({
        success: true,
        feedback,
        message: "Interviewer feedback retrieved successfully",
      })
    }

    // Simulate random feedback availability (60% chance)
    const hasFeedback = Math.random() > 0.4

    if (hasFeedback) {
      // Generate mock interviewer feedback
      const mockFeedback = {
        feedback: "Good approach to the problem. Consider optimizing the time complexity and adding error handling.",
        rating: Math.floor(Math.random() * 2) + 4, // 4-5 rating
        timestamp: new Date().toISOString(),
        type: "interviewer",
      }

      // Store in mock database
      interviewerFeedbackStore.set(feedbackKey, mockFeedback)

      return NextResponse.json({
        success: true,
        feedback: mockFeedback,
        message: "Interviewer feedback available",
      })
    } else {
      // No feedback available yet
      return NextResponse.json({
        success: false,
        error: "Feedback not available yet",
        pending: true,
        message: "Interviewer hasn't provided feedback yet",
      })
    }
  } catch (error) {
    console.error("Get interviewer feedback error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve interviewer feedback",
        pending: true,
      },
      { status: 500 },
    )
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { sessionId, feedback, rating, timestamp } = body

    if (!sessionId) {
      return NextResponse.json({ success: false, error: "Session ID is required" }, { status: 400 })
    }

    // Store interviewer feedback
    const feedbackKey = `interviewer_${sessionId}`
    const interviewerFeedback = {
      feedback: feedback || "",
      rating: rating || 0,
      timestamp: timestamp || new Date().toISOString(),
      type: "interviewer",
    }

    interviewerFeedbackStore.set(feedbackKey, interviewerFeedback)

    return NextResponse.json({
      success: true,
      message: "Interviewer feedback saved successfully",
      data: interviewerFeedback,
    })
  } catch (error) {
    console.error("Save interviewer feedback error:", error)
    return NextResponse.json({ success: false, error: "Failed to save interviewer feedback" }, { status: 500 })
  }
}
