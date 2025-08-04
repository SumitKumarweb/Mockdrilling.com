import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const { domain, type, candidateId } = await request.json()

    // Generate session ID
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Mock interviewer assignment
    const interviewerId = `interviewer_${Math.random().toString(36).substr(2, 9)}`

    // Dynamic questions based on domain
    const questionSets = {
      frontend: [
        {
          id: 1,
          question: "Implement a React component that fetches and displays user data",
          difficulty: "Medium",
          timeLimit: 15,
          type: "coding",
        },
        {
          id: 2,
          question: "Explain the difference between useEffect and useLayoutEffect",
          difficulty: "Hard",
          timeLimit: 10,
          type: "conceptual",
        },
        {
          id: 3,
          question: "Optimize this React component for performance",
          difficulty: "Hard",
          timeLimit: 20,
          type: "optimization",
        },
      ],
      backend: [
        {
          id: 1,
          question: "Design a REST API for a social media platform",
          difficulty: "Medium",
          timeLimit: 15,
          type: "system_design",
        },
        {
          id: 2,
          question: "Implement a rate limiting middleware in Node.js",
          difficulty: "Hard",
          timeLimit: 20,
          type: "coding",
        },
        {
          id: 3,
          question: "Explain database indexing and when to use it",
          difficulty: "Medium",
          timeLimit: 10,
          type: "conceptual",
        },
      ],
      dsa: [
        {
          id: 1,
          question: "Implement a binary search tree with insert, delete, and search operations",
          difficulty: "Medium",
          timeLimit: 25,
          type: "coding",
        },
        {
          id: 2,
          question: "Find the longest common subsequence between two strings",
          difficulty: "Hard",
          timeLimit: 30,
          type: "algorithm",
        },
        {
          id: 3,
          question: "Design a LRU cache with O(1) operations",
          difficulty: "Hard",
          timeLimit: 25,
          type: "data_structure",
        },
      ],
    }

    const questions = questionSets[domain] || questionSets.frontend

    // Store session data (in production, use a database)
    const sessionData = {
      sessionId,
      candidateId,
      interviewerId,
      domain,
      type,
      questions,
      startTime: new Date().toISOString(),
      status: "active",
      messages: [],
      codeSubmissions: [],
    }

    // In production, save to database
    // await db.sessions.create(sessionData)

    return NextResponse.json({
      success: true,
      sessionId,
      candidateId,
      interviewerId,
      questions,
      message: "Interview session initialized successfully",
    })
  } catch (error) {
    console.error("Initialize interview error:", error)
    return NextResponse.json({ success: false, error: "Failed to initialize interview" }, { status: 500 })
  }
}
