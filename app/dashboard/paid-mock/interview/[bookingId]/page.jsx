"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  Terminal,
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Clock,
  User,
  Star,
  CheckCircle,
  Award,
  Coins,
  Send,
  Building,
} from "lucide-react"
import { useParams } from "next/navigation"

export default function ProfessionalInterviewPage() {
  const params = useParams()
  const bookingId = params.bookingId
  const [booking, setBooking] = useState(null)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isMicOn, setIsMicOn] = useState(true)
  const [interviewStarted, setInterviewStarted] = useState(false)
  const [interviewEnded, setInterviewEnded] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [rating, setRating] = useState(0)
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false)
  const [drillPointsEarned, setDrillPointsEarned] = useState(0)
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)

  useEffect(() => {
    // Fetch booking details
    const fetchBooking = async () => {
      try {
        const response = await fetch(`/api/professional-mock/booking/${bookingId}`)
        const data = await response.json()

        if (data.success) {
          setBooking(data.booking)
        }
      } catch (error) {
        console.error("Failed to fetch booking:", error)
      }
    }

    if (bookingId) {
      fetchBooking()
    }
  }, [bookingId])

  useEffect(() => {
    // Initialize video stream
    const initializeVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        })

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
        }
      } catch (error) {
        console.error("Failed to access camera/microphone:", error)
      }
    }

    initializeVideo()
  }, [])

  useEffect(() => {
    // Timer for interview duration
    let interval = null
    if (interviewStarted && !interviewEnded) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1)
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [interviewStarted, interviewEnded])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleStartInterview = () => {
    setInterviewStarted(true)
  }

  const handleEndInterview = () => {
    setInterviewEnded(true)
    // Calculate drill points based on interview duration and performance
    const basePoints = 50 // Base points for completing interview
    const timeBonus = Math.min(Math.floor(timeElapsed / 60) * 5, 25) // 5 points per minute, max 25
    const totalPoints = basePoints + timeBonus
    setDrillPointsEarned(totalPoints)
  }

  const handleSubmitFeedback = async () => {
    setIsSubmittingFeedback(true)

    try {
      const response = await fetch(`/api/professional-mock/booking/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "complete",
          feedback,
          rating,
          drillPointsAwarded: drillPointsEarned,
        }),
      })

      const result = await response.json()

      if (result.success) {
        alert(`Interview completed! You earned ${drillPointsEarned} drill points!`)
        window.location.href = "/dashboard"
      }
    } catch (error) {
      console.error("Failed to submit feedback:", error)
    } finally {
      setIsSubmittingFeedback(false)
    }
  }

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn)
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const videoTrack = localVideoRef.current.srcObject.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !isVideoOn
      }
    }
  }

  const toggleMic = () => {
    setIsMicOn(!isMicOn)
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const audioTrack = localVideoRef.current.srcObject.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !isMicOn
      }
    }
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 font-mono">Loading interview room...</p>
        </div>
      </div>
    )
  }

  if (interviewEnded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-white font-mono mb-2">Interview Completed!</h1>
            <p className="text-gray-400 font-mono">Duration: {formatTime(timeElapsed)}</p>
          </div>

          <Card className="bg-black/40 border-green-500/20 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white font-mono flex items-center">
                <Award className="w-5 h-5 mr-2 text-green-400" />
                Congratulations!
              </CardTitle>
              <CardDescription className="text-gray-400 font-mono">
                You've completed your professional mock interview
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="bg-green-500/10 border-green-500/30 text-green-400">
                <Coins className="h-4 w-4" />
                <AlertDescription className="font-mono">
                  You've earned {drillPointsEarned} drill points for completing this interview!
                </AlertDescription>
              </Alert>

              <div className="bg-black/20 rounded-lg p-6 border border-gray-600/30">
                <h3 className="text-white font-mono font-bold mb-4">What happens next?</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <span className="text-blue-400 font-mono text-xs">1</span>
                    </div>
                    <span className="text-gray-300 font-mono text-sm">
                      Your expert will provide detailed written feedback within 24 hours
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                      <span className="text-green-400 font-mono text-xs">2</span>
                    </div>
                    <span className="text-gray-300 font-mono text-sm">
                      You'll receive a comprehensive performance report via email
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <span className="text-purple-400 font-mono text-xs">3</span>
                    </div>
                    <span className="text-gray-300 font-mono text-sm">
                      Your drill points have been added to your account
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-white font-mono font-bold mb-3">Rate Your Experience (Optional)</h4>
                <div className="flex items-center space-x-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Button
                      key={star}
                      variant="ghost"
                      size="sm"
                      onClick={() => setRating(star)}
                      className={`p-2 ${star <= rating ? "text-yellow-400" : "text-gray-600"} hover:text-yellow-400`}
                    >
                      <Star className={`w-6 h-6 ${star <= rating ? "fill-current" : ""}`} />
                    </Button>
                  ))}
                </div>

                <Textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Share your experience with this professional mock interview..."
                  className="bg-black/20 border-gray-600 text-white font-mono"
                />
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={handleSubmitFeedback}
                  disabled={isSubmittingFeedback}
                  className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-black font-mono font-bold"
                >
                  {isSubmittingFeedback ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                      Submitting...
                    </div>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Feedback
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => (window.location.href = "/dashboard")}
                  variant="outline"
                  className="flex-1 bg-black/20 border-gray-600 text-white hover:border-green-500 font-mono"
                >
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
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
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <Terminal className="w-5 h-5 text-black" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent font-mono">
                  MockDrilling
                </span>
              </div>
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border-purple-500/30 font-mono">
                Professional Interview
              </Badge>
              {interviewStarted && (
                <Badge variant="secondary" className="bg-red-500/20 text-red-400 border-red-500/30 font-mono">
                  LIVE
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {interviewStarted && (
                <div className="flex items-center space-x-2 bg-black/60 rounded-lg px-3 py-2 border border-green-500/30">
                  <Clock className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 font-mono font-bold">{formatTime(timeElapsed)}</span>
                </div>
              )}

              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleVideo}
                  className={`${isVideoOn ? "text-green-400" : "text-red-400"} hover:text-white`}
                >
                  {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMic}
                  className={`${isMicOn ? "text-green-400" : "text-red-400"} hover:text-white`}
                >
                  {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </Button>
                {interviewStarted && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEndInterview}
                    className="text-red-400 hover:text-red-300"
                  >
                    <PhoneOff className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Video Section */}
          <div className="lg:col-span-3 space-y-6">
            {/* Expert Video */}
            <Card className="bg-black/40 border-green-500/20 backdrop-blur-xl">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={booking.expert.avatar || "/placeholder.svg"}
                      alt={booking.expert.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-green-500/30"
                    />
                    <div>
                      <CardTitle className="text-white font-mono text-lg">{booking.expert.name}</CardTitle>
                      <CardDescription className="text-gray-400 font-mono text-sm">
                        <Building className="w-3 h-3 inline mr-1" />
                        {booking.expert.position} at {booking.expert.company}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-yellow-400 font-mono text-sm">{booking.expert.rating}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    className="w-full h-full rounded-lg object-cover"
                    style={{ display: interviewStarted ? "block" : "none" }}
                  />
                  {!interviewStarted && (
                    <div className="text-center">
                      <User className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400 font-mono">Waiting for expert to join...</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Your Video */}
            <Card className="bg-black/40 border-blue-500/20 backdrop-blur-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-white font-mono text-lg flex items-center">
                  <Video className="w-5 h-5 mr-2 text-blue-400" />
                  Your Video
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
                  <video ref={localVideoRef} autoPlay muted className="w-full h-full object-cover" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Interview Details */}
            <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white font-mono">Interview Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-gray-400 font-mono text-sm">Domain</p>
                  <p className="text-white font-mono">{booking.interview.domain}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-mono text-sm">Level</p>
                  <p className="text-white font-mono">{booking.interview.level}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-mono text-sm">Duration</p>
                  <p className="text-white font-mono">{booking.interview.duration} minutes</p>
                </div>
                {booking.interview.targetCompany && (
                  <div>
                    <p className="text-gray-400 font-mono text-sm">Target Company</p>
                    <p className="text-white font-mono">{booking.interview.targetCompany}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Controls */}
            {!interviewStarted ? (
              <Card className="bg-black/40 border-green-500/20 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white font-mono">Ready to Start?</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={handleStartInterview}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-black font-mono font-bold"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Start Interview
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-black/40 border-orange-500/20 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white font-mono">Interview Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-400 font-mono">{formatTime(timeElapsed)}</p>
                    <p className="text-gray-400 font-mono text-sm">Time Elapsed</p>
                  </div>

                  <Separator className="bg-gray-600" />

                  <div className="space-y-2">
                    <p className="text-gray-400 font-mono text-sm">Expected Duration:</p>
                    <p className="text-white font-mono">{booking.interview.duration} minutes</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tips */}
            <Card className="bg-black/40 border-gray-500/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white font-mono">Interview Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-gray-300 font-mono text-sm">
                  <p>• Speak clearly and confidently</p>
                  <p>• Think out loud during problem solving</p>
                  <p>• Ask clarifying questions</p>
                  <p>• Don't be afraid to admit if you don't know something</p>
                  <p>• Take your time to think through problems</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
