import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const { sessionId, message } = await request.json()

    // In production, save message to database and broadcast to other participants
    const messageData = {
      ...message,
      sessionId,
      createdAt: new Date().toISOString(),
    }

    // Mock response from interviewer (in production, this would be real-time)
    const responses = [
      "That's a good point. Can you elaborate on that?",
      "Interesting approach. What about edge cases?",
      "Great! Now let's move to the next part.",
      "Can you explain your thought process?",
      "Good solution. How would you optimize it further?",
    ]

    // Simulate interviewer response after 2-5 seconds
    setTimeout(
      () => {
        const randomResponse = responses[Math.floor(Math.random() * responses.length)]
        // In production, broadcast this via WebSocket
        console.log("Interviewer response:", randomResponse)
      },
      Math.random() * 3000 + 2000,
    )

    return NextResponse.json({
      success: true,
      message: "Message sent successfully",
      messageId: messageData.id,
    })
  } catch (error) {
    console.error("Send message error:", error)
    return NextResponse.json({ success: false, error: "Failed to send message" }, { status: 500 })
  }
}
