import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

// Create SMTP transporter for feedback emails
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER || "your-email@gmail.com",
      pass: process.env.SMTP_PASS || "your-app-password",
    },
  })
}

// Send detailed feedback email to candidate
const sendFeedbackEmail = async (feedbackData) => {
  const transporter = createTransporter()

  const { user, expert, interview, feedback, scores, drillPointsAwarded } = feedbackData

  const emailTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Professional Mock Interview Feedback</title>
        <style>
            body { font-family: 'Courier New', monospace; background-color: #0f172a; color: #e2e8f0; margin: 0; padding: 20px; }
            .container { max-width: 700px; margin: 0 auto; background-color: #1e293b; border-radius: 8px; padding: 30px; border: 1px solid #10b981; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { color: #10b981; font-size: 24px; font-weight: bold; }
            .title { color: #ffffff; font-size: 20px; margin: 10px 0; }
            .section { margin: 20px 0; padding: 15px; background-color: #0f172a; border-radius: 6px; border-left: 4px solid #10b981; }
            .section-title { color: #10b981; font-weight: bold; margin-bottom: 10px; font-size: 16px; }
            .score-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 15px 0; }
            .score-item { background-color: #1e293b; padding: 12px; border-radius: 6px; text-align: center; }
            .score-value { color: #10b981; font-size: 24px; font-weight: bold; }
            .score-label { color: #94a3b8; font-size: 12px; }
            .feedback-text { background-color: #1e293b; padding: 15px; border-radius: 6px; margin: 10px 0; line-height: 1.6; }
            .strengths { color: #10b981; }
            .improvements { color: #f59e0b; }
            .recommendations { color: #3b82f6; }
            .drill-points { background: linear-gradient(to right, #10b981, #3b82f6); color: #000000; padding: 15px; border-radius: 6px; text-align: center; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 12px; }
            ul { padding-left: 20px; }
            li { margin: 5px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">MockDrilling</div>
                <div class="title">Professional Mock Interview Feedback 📊</div>
                <p style="color: #94a3b8; margin: 5px 0;">Expert: ${expert.name} from ${expert.company}</p>
            </div>

            <div class="section">
                <div class="section-title">📈 Performance Scores</div>
                <div class="score-grid">
                    <div class="score-item">
                        <div class="score-value">${scores.technical}%</div>
                        <div class="score-label">Technical Skills</div>
                    </div>
                    <div class="score-item">
                        <div class="score-value">${scores.communication}%</div>
                        <div class="score-label">Communication</div>
                    </div>
                    <div class="score-item">
                        <div class="score-value">${scores.problemSolving}%</div>
                        <div class="score-label">Problem Solving</div>
                    </div>
                    <div class="score-item">
                        <div class="score-value">${scores.overall}%</div>
                        <div class="score-label">Overall Score</div>
                    </div>
                </div>
            </div>

            <div class="section">
                <div class="section-title strengths">✅ Key Strengths</div>
                <ul>
                    ${feedback.strengths.map((strength) => `<li>${strength}</li>`).join("")}
                </ul>
            </div>

            <div class="section">
                <div class="section-title improvements">🔧 Areas for Improvement</div>
                <ul>
                    ${feedback.improvements.map((improvement) => `<li>${improvement}</li>`).join("")}
                </ul>
            </div>

            <div class="section">
                <div class="section-title">💬 Detailed Feedback</div>
                <div class="feedback-text">${feedback.detailedFeedback}</div>
            </div>

            <div class="section">
                <div class="section-title recommendations">🎯 Expert Recommendations</div>
                <ul>
                    ${feedback.recommendations.map((rec) => `<li>${rec}</li>`).join("")}
                </ul>
            </div>

            <div class="drill-points">
                <h3 style="margin: 0 0 10px 0;">🎉 Drill Points Earned</h3>
                <div style="font-size: 28px; font-weight: bold;">${drillPointsAwarded} Points</div>
                <p style="margin: 10px 0 0 0; font-size: 14px;">Added to your MockDrilling account</p>
            </div>

            <div class="section">
                <div class="section-title">📚 Next Steps</div>
                <ul>
                    <li>Review the feedback and work on suggested improvements</li>
                    <li>Practice the recommended topics and skills</li>
                    <li>Book another session when you're ready for advanced feedback</li>
                    <li>Use your drill points for more mock interviews</li>
                </ul>
            </div>

            <div class="footer">
                <p>Thank you for choosing MockDrilling Professional Mock Interviews!</p>
                <p>Keep practicing and you'll ace your next real interview! 💪</p>
                <p style="margin-top: 15px;">
                    <a href="https://mockdrilling.com/dashboard" style="color: #10b981;">Dashboard</a> | 
                    <a href="https://mockdrilling.com/book-another" style="color: #10b981;">Book Another</a>
                </p>
            </div>
        </div>
    </body>
    </html>
  `

  const mailOptions = {
    from: `"MockDrilling Expert Feedback" <${process.env.SMTP_USER}>`,
    to: user.email,
    subject: `Your Professional Mock Interview Feedback - ${scores.overall}% Overall Score`,
    html: emailTemplate,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log("Feedback email sent successfully")
    return true
  } catch (error) {
    console.error("Failed to send feedback email:", error)
    return false
  }
}

// Calculate drill points based on performance
const calculateDrillPoints = (scores, interviewDuration, interviewPrice) => {
  const basePoints = 50 // Base points for completing interview
  const performanceBonus = Math.floor(scores.overall * 0.5) // Up to 50 points based on performance
  const durationBonus = Math.min(Math.floor(interviewDuration / 10), 10) // Up to 10 points for duration
  const priceBonus = Math.floor(interviewPrice / 100) // Bonus based on interview price

  return basePoints + performanceBonus + durationBonus + priceBonus
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { bookingId, expertFeedback, scores, interviewDuration } = body

    // Validation
    if (!bookingId || !expertFeedback || !scores) {
      return NextResponse.json({ success: false, error: "Missing required feedback data" }, { status: 400 })
    }

    // Validate scores
    const requiredScores = ["technical", "communication", "problemSolving", "overall"]
    for (const scoreType of requiredScores) {
      if (!scores[scoreType] || scores[scoreType] < 0 || scores[scoreType] > 100) {
        return NextResponse.json(
          {
            success: false,
            error: `Invalid ${scoreType} score. Must be between 0 and 100`,
          },
          { status: 400 },
        )
      }
    }

    // Mock booking data (in real implementation, fetch from database)
    const booking = {
      user: {
        name: "Alex Developer",
        email: "alex@example.com",
      },
      expert: {
        name: "Priya Sharma",
        company: "Google",
      },
      interview: {
        price: 499,
        domain: "Frontend Engineering",
      },
    }

    // Calculate drill points
    const drillPointsAwarded = calculateDrillPoints(scores, interviewDuration || 60, booking.interview.price)

    // Prepare feedback data
    const feedbackData = {
      bookingId,
      user: booking.user,
      expert: booking.expert,
      interview: booking.interview,
      feedback: expertFeedback,
      scores,
      drillPointsAwarded,
      createdAt: new Date().toISOString(),
    }

    // In real implementation, save feedback to database
    // await db.professionalFeedback.create(feedbackData)

    // Send feedback email
    const emailSent = await sendFeedbackEmail(feedbackData)

    // In real implementation, update user's drill points
    // await db.users.updateDrillPoints(booking.user.id, drillPointsAwarded)

    return NextResponse.json({
      success: true,
      message: "Feedback submitted successfully",
      drillPointsAwarded,
      emailSent,
      feedbackId: `feedback_${Date.now()}`,
    })
  } catch (error) {
    console.error("Feedback submission error:", error)
    return NextResponse.json({ success: false, error: "Failed to submit feedback" }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const bookingId = searchParams.get("bookingId")
    const userId = searchParams.get("userId")

    if (bookingId) {
      // Get feedback for specific booking
      // In real implementation, fetch from database
      const mockFeedback = {
        bookingId,
        expert: {
          name: "Priya Sharma",
          company: "Google",
          rating: 4.9,
        },
        scores: {
          technical: 85,
          communication: 78,
          problemSolving: 82,
          overall: 82,
        },
        feedback: {
          strengths: [
            "Strong problem-solving approach",
            "Good understanding of React concepts",
            "Clear communication during explanation",
            "Efficient code implementation",
          ],
          improvements: [
            "Could improve time complexity analysis",
            "Practice more system design concepts",
            "Work on edge case handling",
          ],
          detailedFeedback:
            "Overall excellent performance! You demonstrated strong technical skills and clear thinking. Your approach to the coding problem was methodical and well-structured. Focus on practicing more complex system design scenarios to reach the next level.",
          recommendations: [
            "Study advanced React patterns and performance optimization",
            "Practice system design for large-scale applications",
            "Work on algorithmic complexity analysis",
            "Prepare for behavioral questions with STAR method",
          ],
        },
        drillPointsAwarded: 75,
        createdAt: "2024-01-15T10:30:00Z",
      }

      return NextResponse.json({
        success: true,
        feedback: mockFeedback,
      })
    } else if (userId) {
      // Get all feedback for user
      // In real implementation, fetch from database
      const mockUserFeedback = [
        {
          bookingId: "booking_1",
          expert: { name: "Priya Sharma", company: "Google" },
          domain: "Frontend",
          date: "2024-01-15",
          scores: { overall: 82 },
          drillPointsAwarded: 75,
        },
        {
          bookingId: "booking_2",
          expert: { name: "Rahul Kumar", company: "Microsoft" },
          domain: "Backend",
          date: "2024-01-10",
          scores: { overall: 78 },
          drillPointsAwarded: 68,
        },
      ]

      return NextResponse.json({
        success: true,
        feedback: mockUserFeedback,
      })
    } else {
      return NextResponse.json({ success: false, error: "Missing bookingId or userId parameter" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error fetching feedback:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch feedback" }, { status: 500 })
  }
}
