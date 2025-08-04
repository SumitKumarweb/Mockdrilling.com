"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Terminal,
  CheckCircle,
  Calendar,
  Mail,
  Phone,
  Video,
  Download,
  Share2,
  ArrowLeft,
  Star,
  Building,
  Target,
  MessageSquare,
} from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function BookingConfirmationPage() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get("bookingId")
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (bookingId) {
        try {
          const response = await fetch(`/api/professional-mock/booking/${bookingId}`)
          const data = await response.json()

          if (data.success) {
            setBooking(data.booking)
          }
        } catch (error) {
          console.error("Failed to fetch booking details:", error)
        }
      } else {
        // Mock booking data for demo
        setBooking({
          id: "booking_123",
          meetingId: "meet_456",
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
          meetingLink: "https://meet.mockdrilling.com/room/meet_456",
          status: "confirmed",
          createdAt: "2024-01-15T10:30:00Z",
        })
      }
      setLoading(false)
    }

    fetchBookingDetails()
  }, [bookingId])

  const addToCalendar = () => {
    if (!booking) return

    const startDate = new Date(`${booking.interview.date} ${booking.interview.time}`)
    const endDate = new Date(startDate.getTime() + booking.interview.duration * 60000)

    const event = {
      title: `Professional Mock Interview - ${booking.interview.domain}`,
      start: startDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z",
      end: endDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z",
      description: `Mock interview with ${booking.expert.name} from ${booking.expert.company}`,
      location: booking.meetingLink,
    }

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.start}/${event.end}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`

    window.open(googleCalendarUrl, "_blank")
  }

  const shareBooking = () => {
    if (navigator.share) {
      navigator.share({
        title: "Professional Mock Interview Booked",
        text: `I've booked a professional mock interview with ${booking?.expert.name} from ${booking?.expert.company}!`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Booking link copied to clipboard!")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 font-mono">Loading booking details...</p>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <Card className="w-full max-w-md bg-black/40 border-red-500/20 backdrop-blur-xl">
          <CardContent className="p-6 text-center">
            <div className="text-red-400 mb-4">
              <MessageSquare className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-white font-mono font-bold mb-2">Booking Not Found</h3>
            <p className="text-gray-400 font-mono text-sm mb-4">
              We couldn't find your booking details. Please check your email for confirmation.
            </p>
            <Link href="/dashboard">
              <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-black font-mono font-bold">
                Back to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      {/* Header */}
      <header className="border-b border-green-500/20 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <Terminal className="w-5 h-5 text-black" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent font-mono">
                  MockDrilling
                </span>
              </div>
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30 font-mono">
                Booking Confirmed
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-white font-mono mb-2">Booking Confirmed!</h1>
          <p className="text-gray-400 font-mono">Your professional mock interview has been successfully scheduled</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Booking Details */}
            <Card className="bg-black/40 border-green-500/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white font-mono flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-green-400" />
                  Interview Details
                </CardTitle>
                <CardDescription className="text-gray-400 font-mono">Booking ID: {booking.id}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Expert Info */}
                <div className="flex items-center space-x-4 p-4 bg-black/20 rounded-lg border border-gray-600/30">
                  <img
                    src={booking.expert.avatar || "/placeholder.svg"}
                    alt={booking.expert.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-green-500/30"
                  />
                  <div className="flex-1">
                    <h3 className="text-white font-mono font-bold text-lg">{booking.expert.name}</h3>
                    <p className="text-gray-400 font-mono">
                      <Building className="w-4 h-4 inline mr-1" />
                      {booking.expert.position} at {booking.expert.company}
                    </p>
                    <div className="flex items-center mt-1">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-yellow-400 font-mono text-sm">{booking.expert.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Interview Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-400 font-mono text-sm">Domain</p>
                      <p className="text-white font-mono">{booking.interview.domain}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-mono text-sm">Experience Level</p>
                      <p className="text-white font-mono">{booking.interview.level}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-mono text-sm">Target Company</p>
                      <p className="text-white font-mono">{booking.interview.targetCompany}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-400 font-mono text-sm">Date</p>
                      <p className="text-white font-mono">{new Date(booking.interview.date).toDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-mono text-sm">Time</p>
                      <p className="text-white font-mono">{booking.interview.time} IST</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-mono text-sm">Duration</p>
                      <p className="text-white font-mono">{booking.interview.duration} minutes</p>
                    </div>
                  </div>
                </div>

                <Separator className="bg-gray-600" />

                {/* Meeting Link */}
                <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/30">
                  <h4 className="text-blue-400 font-mono font-bold mb-2 flex items-center">
                    <Video className="w-4 h-4 mr-2" />
                    Meeting Link
                  </h4>
                  <p className="text-gray-300 font-mono text-sm mb-3">
                    Join your interview using this link. It will be active 10 minutes before your scheduled time.
                  </p>
                  <div className="flex items-center space-x-2">
                    <code className="bg-black/20 px-3 py-2 rounded text-blue-400 font-mono text-sm flex-1">
                      {booking.meetingLink}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(booking.meetingLink)}
                      className="bg-black/20 border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                    >
                      Copy
                    </Button>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/30">
                  <div className="flex justify-between items-center">
                    <span className="text-green-400 font-mono font-bold">Payment Status</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 font-mono">
                      Paid ₹{booking.interview.price}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What to Expect */}
            <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white font-mono flex items-center">
                  <Target className="w-5 h-5 mr-2 text-purple-400" />
                  What to Expect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-blue-400 font-mono text-xs">1</span>
                    </div>
                    <div>
                      <h4 className="text-white font-mono font-bold">Pre-Interview (5 mins)</h4>
                      <p className="text-gray-400 font-mono text-sm">Brief introduction and technical setup check</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-green-400 font-mono text-xs">2</span>
                    </div>
                    <div>
                      <h4 className="text-white font-mono font-bold">Technical Interview (45 mins)</h4>
                      <p className="text-gray-400 font-mono text-sm">
                        Real interview experience with coding, system design, or behavioral questions
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-purple-400 font-mono text-xs">3</span>
                    </div>
                    <div>
                      <h4 className="text-white font-mono font-bold">Feedback Session (10 mins)</h4>
                      <p className="text-gray-400 font-mono text-sm">Immediate feedback and improvement suggestions</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-black/40 border-gray-500/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white font-mono">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={addToCalendar}
                  className="w-full bg-blue-500/20 border-blue-500/30 text-blue-400 hover:bg-blue-500/30 font-mono"
                  variant="outline"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Add to Calendar
                </Button>

                <Button
                  onClick={shareBooking}
                  className="w-full bg-green-500/20 border-green-500/30 text-green-400 hover:bg-green-500/30 font-mono"
                  variant="outline"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Booking
                </Button>

                <Button
                  className="w-full bg-purple-500/20 border-purple-500/30 text-purple-400 hover:bg-purple-500/30 font-mono"
                  variant="outline"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Receipt
                </Button>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="bg-black/40 border-gray-500/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white font-mono">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-gray-400 font-mono text-sm">Your Details</p>
                  <p className="text-white font-mono">{booking.user.name}</p>
                  <p className="text-gray-400 font-mono text-sm flex items-center">
                    <Mail className="w-3 h-3 mr-1" />
                    {booking.user.email}
                  </p>
                  <p className="text-gray-400 font-mono text-sm flex items-center">
                    <Phone className="w-3 h-3 mr-1" />
                    {booking.user.phone}
                  </p>
                </div>

                <Separator className="bg-gray-600" />

                <div>
                  <p className="text-gray-400 font-mono text-sm">Expert Contact</p>
                  <p className="text-white font-mono">{booking.expert.name}</p>
                  <p className="text-gray-400 font-mono text-sm flex items-center">
                    <Mail className="w-3 h-3 mr-1" />
                    {booking.expert.email}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Important Notes */}
            <Card className="bg-black/40 border-yellow-500/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white font-mono">Important Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-gray-300 font-mono text-sm space-y-2">
                  <p>• Join 5 minutes early for setup</p>
                  <p>• Ensure stable internet connection</p>
                  <p>• Have your resume ready</p>
                  <p>• Prepare questions for the expert</p>
                  <p>• Check your email for detailed instructions</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Email Confirmation Alert */}
        <Alert className="bg-green-500/10 border-green-500/30 text-green-400 mt-8">
          <Mail className="h-4 w-4" />
          <AlertDescription className="font-mono">
            A confirmation email with meeting details has been sent to {booking.user.email}. Please check your inbox and
            spam folder.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
