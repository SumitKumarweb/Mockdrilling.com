import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const { sessionId, endTime, code, language, responses } = await request.json()

    // Calculate interview duration
    const startTime = new Date(Date.now() - 45 * 60 * 1000) // Mock start time
    const duration = Math.floor((new Date(endTime) - startTime) / 1000 / 60) // in minutes

    // Generate dynamic feedback based on code and responses
    const feedback = await generateFeedback(code, language, responses, duration)

    // Calculate scores
    const scores = calculateScores(code, language, responses)

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
      status: "completed",
      createdAt: new Date().toISOString(),
    }

    // In production: await db.interviews.create(results)

    return NextResponse.json({
      success: true,
      sessionId,
      results,
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
