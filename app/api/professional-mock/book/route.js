import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

// Create SMTP transporter
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

// Generate meeting room ID
const generateMeetingId = () => {
  return `meet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Generate booking ID
const generateBookingId = () => {
  return `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Send confirmation email
const sendConfirmationEmail = async (bookingData) => {
  const transporter = createTransporter()

  const { user, expert, interview, meetingId, meetingLink, bookingId } = bookingData

  const emailTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Professional Mock Interview Confirmation</title>
        <style>
            body { font-family: 'Courier New', monospace; background-color: #0f172a; color: #e2e8f0; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background-color: #1e293b; border-radius: 8px; padding: 30px; border: 1px solid #10b981; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { color: #10b981; font-size: 24px; font-weight: bold; }
            .title { color: #ffffff; font-size: 20px; margin: 10px 0; }
            .section { margin: 20px 0; padding: 15px; background-color: #0f172a; border-radius: 6px; border-left: 4px solid #10b981; }
            .section-title { color: #10b981; font-weight: bold; margin-bottom: 10px; }
            .detail-row { display: flex; justify-content: space-between; margin: 8px 0; }
            .detail-label { color: #94a3b8; }
            .detail-value { color: #ffffff; font-weight: bold; }
            .meeting-link { background-color: #1e40af; color: #ffffff; padding: 12px; border-radius: 6px; text-align: center; margin: 15px 0; }
            .meeting-link a { color: #ffffff; text-decoration: none; font-weight: bold; }
            .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 12px; }
            .button { background: linear-gradient(to right, #10b981, #3b82f6); color: #000000; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block; margin: 10px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">MockDrilling</div>
                <div class="title">Professional Mock Interview Confirmed! 🎉</div>
            </div>

            <div class="section">
                <div class="section-title">📅 Interview Details</div>
                <div class="detail-row">
                    <span class="detail-label">Booking ID:</span>
                    <span class="detail-value">${bookingId}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Date:</span>
                    <span class="detail-value">${new Date(interview.date).toDateString()}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Time:</span>
                    <span class="detail-value">${interview.time} IST</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Duration:</span>
                    <span class="detail-value">${interview.duration} minutes</span>
                </div>
                <div class="detail-row">
                    \` minutes</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Domain:</span>
                    <span class="detail-value">${interview.domain}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Level:</span>
                    <span class="detail-value">${interview.level}</span>
                </div>
            </div>

            <div class="section">
                <div class="section-title">👨‍💼 Your Expert Interviewer</div>
                <div class="detail-row">
                    <span class="detail-label">Name:</span>
                    <span class="detail-value">${expert.name}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Company:</span>
                    <span class="detail-value">${expert.company}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Position:</span>
                    <span class="detail-value">${expert.position}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Experience:</span>
                    <span class="detail-value">${expert.experience}</span>
                </div>
            </div>

            <div class="meeting-link">
                <div style="margin-bottom: 10px;">🎥 <strong>Meeting Link</strong></div>
                <a href="${meetingLink}" target="_blank">${meetingLink}</a>
                <div style="margin-top: 10px; font-size: 12px;">
                    Link will be active 10 minutes before your scheduled time
                </div>
            </div>

            <div class="section">
                <div class="section-title">📋 What to Prepare</div>
                <ul style="color: #e2e8f0; margin: 10px 0; padding-left: 20px;">
                    <li>Join 5 minutes early for technical setup</li>
                    <li>Ensure stable internet connection and quiet environment</li>
                    <li>Have your resume ready to share</li>
                    <li>Prepare questions about the role/company</li>
                    <li>Test your camera and microphone beforehand</li>
                </ul>
            </div>

            <div class="section">
                <div class="section-title">💰 Payment Confirmation</div>
                <div class="detail-row">
                    <span class="detail-label">Amount Paid:</span>
                    <span class="detail-value">₹${interview.price}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Payment Status:</span>
                    <span class="detail-value" style="color: #10b981;">✅ Confirmed</span>
                </div>
            </div>

            <div style="text-align: center; margin: 30px 0;">
                <a href="${meetingLink}" class="button">Join Interview Room</a>
            </div>

            <div class="footer">
                <p>Need help? Contact us at support@mockdrilling.com</p>
                <p>MockDrilling - Your path to interview success</p>
                <p style="margin-top: 15px;">
                    <a href="https://mockdrilling.com/dashboard" style="color: #10b981;">Dashboard</a> | 
                    <a href="https://mockdrilling.com/support" style="color: #10b981;">Support</a>
                </p>
            </div>
        </div>
    </body>
    </html>
  `

  const mailOptions = {
    from: `"MockDrilling" <${process.env.SMTP_USER}>`,
    to: user.email,
    subject: `Professional Mock Interview Confirmed - ${new Date(interview.date).toDateString()}`,
    html: emailTemplate,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log("Confirmation email sent successfully")
    return true
  } catch (error) {
    console.error("Failed to send confirmation email:", error)
    return false
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { expertId, date, time, domain, level, targetCompany, userDetails, price } = body

    // Validation
    if (!expertId || !date || !time || !domain || !level || !userDetails) {
      return NextResponse.json({ success: false, error: "Missing required booking information" }, { status: 400 })
    }

    if (!userDetails.name || !userDetails.email || !userDetails.phone) {
      return NextResponse.json({ success: false, error: "Missing user contact information" }, { status: 400 })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(userDetails.email)) {
      return NextResponse.json({ success: false, error: "Invalid email format" }, { status: 400 })
    }

    // Phone validation
    const phoneRegex = /^\+?[\d\s\-()]+$/
    if (!phoneRegex.test(userDetails.phone)) {
      return NextResponse.json({ success: false, error: "Invalid phone format" }, { status: 400 })
    }

    // Check if date is in the future
    const selectedDate = new Date(date)
    const now = new Date()
    if (selectedDate <= now) {
      return NextResponse.json({ success: false, error: "Interview date must be in the future" }, { status: 400 })
    }

    // Generate IDs
    const bookingId = generateBookingId()
    const meetingId = generateMeetingId()
    const meetingLink = `https://meet.mockdrilling.com/room/${meetingId}`

    // Mock expert data (in real implementation, fetch from database)
    const experts = {
      expert_1: {
        name: "Priya Sharma",
        company: "Google",
        position: "Staff Software Engineer",
        experience: "12 years",
        email: "priya.sharma@mockdrilling.com",
      },
      expert_2: {
        name: "Rahul Kumar",
        company: "Microsoft",
        position: "Principal Engineer",
        experience: "15 years",
        email: "rahul.kumar@mockdrilling.com",
      },
      expert_3: {
        name: "Sarah Chen",
        company: "Amazon",
        position: "Senior Principal Engineer",
        experience: "18 years",
        email: "sarah.chen@mockdrilling.com",
      },
    }

    const expert = experts[expertId]
    if (!expert) {
      return NextResponse.json({ success: false, error: "Invalid expert selected" }, { status: 400 })
    }

    // Create booking data
    const bookingData = {
      bookingId,
      meetingId,
      meetingLink,
      user: userDetails,
      expert,
      interview: {
        domain,
        level,
        targetCompany,
        date,
        time,
        duration: 60,
        price,
      },
      status: "confirmed",
      createdAt: new Date().toISOString(),
    }

    // In real implementation, save to database
    // await db.bookings.create(bookingData)

    // Send confirmation email
    const emailSent = await sendConfirmationEmail(bookingData)

    // Calculate drill points bonus (based on interview price)
    const bonusDrillPoints = Math.floor(price / 10) // 10% of price as bonus points

    // In real implementation, update user's drill points
    // await db.users.updateDrillPoints(userDetails.userId, bonusDrillPoints)

    return NextResponse.json({
      success: true,
      bookingId,
      meetingId,
      meetingLink,
      emailSent,
      bonusDrillPoints,
      message: "Professional mock interview booked successfully",
    })
  } catch (error) {
    console.error("Booking error:", error)
    return NextResponse.json({ success: false, error: "Failed to book interview" }, { status: 500 })
  }
}
