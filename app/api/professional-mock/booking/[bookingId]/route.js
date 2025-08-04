import { NextResponse } from "next/server"

export async function GET(request, { params }) {
  try {
    const { bookingId } = params

    if (!bookingId) {
      return NextResponse.json({ success: false, error: "Booking ID is required" }, { status: 400 })
    }

    // In real implementation, fetch from database
    // const booking = await db.bookings.findById(bookingId)

    // Mock booking data for demo
    const mockBooking = {
      id: bookingId,
      meetingId: `meet_${bookingId}`,
      expert: {
        name: "Priya Sharma",
        avatar: "/placeholder.svg?height=80&width=80&text=PS",
        company: "Google",
        position: "Staff Software Engineer",
        rating: 4.9,
        email: "priya.sharma@mockdrilling.com",
      },
      user: {
        name: "Alex Developer",
        email: "alex@example.com",
        phone: "+91 9876543210",
      },
      interview: {
        domain: "Frontend Engineering",
        level: "Senior (5-8 years)",
        targetCompany: "Google",
        date: "2024-01-25",
        time: "03:00 PM",
        duration: 60,
        price: 499,
      },
      meetingLink: `https://meet.mockdrilling.com/room/meet_${bookingId}`,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      booking: mockBooking,
    })
  } catch (error) {
    console.error("Error fetching booking:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch booking details" }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const { bookingId } = params
    const body = await request.json()
    const { action } = body

    if (!bookingId) {
      return NextResponse.json({ success: false, error: "Booking ID is required" }, { status: 400 })
    }

    switch (action) {
      case "cancel":
        // Handle booking cancellation
        // In real implementation, update database and send cancellation emails
        return NextResponse.json({
          success: true,
          message: "Booking cancelled successfully",
          refundAmount: body.refundAmount || 0,
        })

      case "reschedule":
        // Handle booking rescheduling
        const { newDate, newTime } = body
        if (!newDate || !newTime) {
          return NextResponse.json({ success: false, error: "New date and time required" }, { status: 400 })
        }

        // In real implementation, update database and send rescheduling emails
        return NextResponse.json({
          success: true,
          message: "Booking rescheduled successfully",
          newDate,
          newTime,
        })

      case "complete":
        // Mark interview as completed and process feedback
        const { feedback, rating, drillPointsAwarded } = body

        // In real implementation, save feedback and update user points
        return NextResponse.json({
          success: true,
          message: "Interview completed successfully",
          drillPointsAwarded: drillPointsAwarded || 0,
        })

      default:
        return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error updating booking:", error)
    return NextResponse.json({ success: false, error: "Failed to update booking" }, { status: 500 })
  }
}
