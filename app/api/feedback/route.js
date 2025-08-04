import { NextResponse } from "next/server"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "received" // 'received' or 'given'
    const domain = searchParams.get("domain") || "all"
    const userId = searchParams.get("userId") // In real app, get from auth token

    // In a real implementation, you would:
    // 1. Get user ID from authentication token
    // 2. Query database for feedback based on filters
    // 3. Handle pagination
    // 4. Return structured feedback data

    // Mock feedback data
    const mockReceivedFeedback = [
      {
        id: "feedback_1",
        interviewId: "interview_123",
        interviewer: {
          id: "user_456",
          name: "Sarah Chen",
          avatar: "/placeholder.svg?height=40&width=40&text=SC",
          company: "Google",
          position: "Senior SDE",
          experience: "8 years",
        },
        domain: "Frontend",
        date: "2024-01-15T10:30:00Z",
        rating: 4.8,
        score: 92,
        strengths: [
          "Excellent problem-solving approach",
          "Clean and readable code",
          "Good understanding of React concepts",
          "Strong communication skills",
        ],
        improvements: [
          "Could improve time complexity analysis",
          "Consider edge cases more thoroughly",
          "Practice more system design questions",
        ],
        overallFeedback:
          "Great interview! You demonstrated strong technical skills and clear communication. Your approach to breaking down the problem was methodical and well-structured. Keep practicing algorithmic problems to improve speed and consider studying system design patterns for senior roles.",
        status: "completed",
        helpful: true,
        helpfulCount: 12,
      },
      {
        id: "feedback_2",
        interviewId: "interview_124",
        interviewer: {
          id: "user_789",
          name: "Rahul Kumar",
          avatar: "/placeholder.svg?height=40&width=40&text=RK",
          company: "Microsoft",
          position: "Principal Engineer",
          experience: "10 years",
        },
        domain: "Backend",
        date: "2024-01-12T14:20:00Z",
        rating: 4.5,
        score: 88,
        strengths: [
          "Strong system design knowledge",
          "Good database optimization skills",
          "Clear explanation of trade-offs",
          "Solid understanding of microservices",
        ],
        improvements: [
          "Practice more on distributed systems",
          "Improve API design patterns",
          "Study more about caching strategies",
        ],
        overallFeedback:
          "Solid performance overall. Your understanding of backend concepts is good, but there's room for improvement in distributed systems design. I'd recommend studying more about microservices architecture and practicing system design interviews.",
        status: "completed",
        helpful: true,
        helpfulCount: 8,
      },
      {
        id: "feedback_3",
        interviewId: "interview_125",
        interviewer: {
          id: "user_101",
          name: "Priya Sharma",
          avatar: "/placeholder.svg?height=40&width=40&text=PS",
          company: "Amazon",
          position: "Staff Engineer",
          experience: "12 years",
        },
        domain: "DSA",
        date: "2024-01-10T16:45:00Z",
        rating: null,
        score: null,
        strengths: [],
        improvements: [],
        overallFeedback: "",
        status: "pending",
        helpful: false,
        helpfulCount: 0,
      },
    ]

    const mockGivenFeedback = [
      {
        id: "feedback_4",
        interviewId: "interview_126",
        candidate: {
          id: "user_202",
          name: "Amit Patel",
          avatar: "/placeholder.svg?height=40&width=40&text=AP",
          experience: "3 years",
          currentCompany: "Startup Inc",
        },
        domain: "Frontend",
        date: "2024-01-14T11:15:00Z",
        rating: 4.2,
        score: 85,
        strengths: ["Good React knowledge", "Responsive design skills", "Problem-solving approach", "Eager to learn"],
        improvements: [
          "Improve JavaScript fundamentals",
          "Practice more complex algorithms",
          "Study state management patterns",
        ],
        overallFeedback:
          "Good technical foundation with room for growth. Focus on strengthening core JavaScript concepts and practice more algorithmic thinking. Your enthusiasm and willingness to learn are great assets.",
        myRating: 4.9,
        candidateRating: 4.8,
        helpful: true,
        helpfulCount: 15,
      },
      {
        id: "feedback_5",
        interviewId: "interview_127",
        candidate: {
          id: "user_303",
          name: "Neha Singh",
          avatar: "/placeholder.svg?height=40&width=40&text=NS",
          experience: "2 years",
          currentCompany: "Tech Solutions",
        },
        domain: "Backend",
        date: "2024-01-11T09:30:00Z",
        rating: 4.6,
        score: 90,
        strengths: ["Excellent API design", "Strong database knowledge", "Good system thinking", "Clear communication"],
        improvements: ["Consider more edge cases", "Improve error handling", "Study distributed systems"],
        overallFeedback:
          "Impressive performance! Strong technical skills and clear communication. Ready for senior roles with a bit more experience in distributed systems and large-scale architecture.",
        myRating: 4.8,
        candidateRating: 4.9,
        helpful: true,
        helpfulCount: 22,
      },
    ]

    // Filter by domain if specified
    const filterByDomain = (feedback) => {
      if (domain === "all") return feedback
      return feedback.filter((f) => f.domain.toLowerCase() === domain.toLowerCase())
    }

    const feedbackData = type === "received" ? filterByDomain(mockReceivedFeedback) : filterByDomain(mockGivenFeedback)

    // Mock statistics
    const stats = {
      received: {
        total: mockReceivedFeedback.length,
        completed: mockReceivedFeedback.filter((f) => f.status === "completed").length,
        pending: mockReceivedFeedback.filter((f) => f.status === "pending").length,
        avgRating: 4.65,
        avgScore: 90,
      },
      given: {
        total: mockGivenFeedback.length,
        avgRating: 4.4,
        avgScore: 87.5,
        helpfulCount: mockGivenFeedback.reduce((sum, f) => sum + f.helpfulCount, 0),
      },
    }

    return NextResponse.json({
      success: true,
      data: {
        feedback: feedbackData,
        stats,
        filters: {
          type,
          domain,
        },
      },
    })
  } catch (error) {
    console.error("Error fetching feedback:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch feedback" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { interviewId, feedback, rating, score } = body

    // In a real implementation, you would:
    // 1. Validate the feedback data
    // 2. Get user ID from authentication token
    // 3. Store feedback in database
    // 4. Send notification to the recipient
    // 5. Update user ratings and statistics

    // Mock validation
    if (!interviewId || !feedback || !rating) {
      return NextResponse.json({ success: false, error: "Missing required feedback data" }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ success: false, error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    if (score !== undefined && (score < 0 || score > 100)) {
      return NextResponse.json({ success: false, error: "Score must be between 0 and 100" }, { status: 400 })
    }

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Mock feedback creation
    const newFeedback = {
      id: `feedback_${Date.now()}`,
      interviewId,
      rating,
      score,
      feedback,
      createdAt: new Date().toISOString(),
      status: "completed",
    }

    return NextResponse.json({
      success: true,
      message: "Feedback submitted successfully",
      data: newFeedback,
    })
  } catch (error) {
    console.error("Error submitting feedback:", error)
    return NextResponse.json({ success: false, error: "Failed to submit feedback" }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const body = await request.json()
    const { feedbackId, action } = body

    // Handle different feedback actions
    switch (action) {
      case "mark_helpful":
        // Mark feedback as helpful
        return NextResponse.json({
          success: true,
          message: "Feedback marked as helpful",
          data: { helpful: true },
        })

      case "report":
        // Report inappropriate feedback
        return NextResponse.json({
          success: true,
          message: "Feedback reported successfully",
          data: { reported: true },
        })

      case "update":
        // Update existing feedback
        const { rating, score, feedback } = body

        if (!rating || !feedback) {
          return NextResponse.json({ success: false, error: "Missing required data" }, { status: 400 })
        }

        return NextResponse.json({
          success: true,
          message: "Feedback updated successfully",
          data: { feedbackId, rating, score, feedback, updatedAt: new Date().toISOString() },
        })

      default:
        return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error updating feedback:", error)
    return NextResponse.json({ success: false, error: "Failed to update feedback" }, { status: 500 })
  }
}
