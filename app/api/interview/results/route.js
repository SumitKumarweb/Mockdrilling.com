import { NextResponse } from "next/server"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("sessionId")

    if (!sessionId) {
      return NextResponse.json({ success: false, error: "Session ID is required" }, { status: 400 })
    }

    // In production, fetch from database
    // const results = await db.interviews.findOne({ sessionId })

    // Mock results for demo
    const results = {
      sessionId,
      overallScore: Math.floor(Math.random() * 30) + 70, // 70-100
      duration: Math.floor(Math.random() * 20) + 30, // 30-50 minutes
      language: "JavaScript",
      domain: "Frontend",
      scores: {
        code: Math.floor(Math.random() * 25) + 75,
        communication: Math.floor(Math.random() * 25) + 70,
        problemSolving: Math.floor(Math.random() * 25) + 72,
      },
      feedback: {
        strengths: [
          "Good code structure and organization",
          "Clear problem-solving approach",
          "Effective communication during video call",
          "Proper use of modern JavaScript features",
        ],
        improvements: [
          "Add more comprehensive error handling",
          "Optimize algorithm time complexity",
          "Improve code documentation",
          "Consider edge cases earlier",
        ],
        detailedFeedback: {
          codeQuality:
            "Your code demonstrates solid understanding of JavaScript fundamentals. The implementation is clean and functional, with good variable naming conventions. Consider adding more comments for complex logic sections.",
          communication:
            "You communicated your thought process clearly during the video interview. Your explanations were easy to follow, though you could be more concise in some areas. Good use of the chat feature for clarifications.",
          problemSolving:
            "Strong analytical approach to breaking down the problem. You identified the core requirements quickly and developed a logical solution path. Work on considering edge cases and optimization opportunities earlier in the process.",
        },
        recommendations: [
          "Practice more advanced algorithm optimization techniques",
          "Study design patterns for better code architecture",
          "Work on explaining complex concepts more concisely",
          "Practice more live coding sessions to improve confidence",
        ],
        nextSteps: [
          "Take a Backend or DSA interview to diversify your skills",
          "Book a professional mock interview for company-specific preparation",
          "Review the recommended learning resources",
          "Join our developer community for peer learning opportunities",
        ],
      },
      createdAt: new Date().toISOString(),
    }

    // Calculate overall score
    results.scores.overall = Math.round(
      (results.scores.code + results.scores.communication + results.scores.problemSolving) / 3,
    )

    return NextResponse.json({
      success: true,
      results,
      message: "Results retrieved successfully",
    })
  } catch (error) {
    console.error("Get results error:", error)
    return NextResponse.json({ success: false, error: "Failed to retrieve results" }, { status: 500 })
  }
}
