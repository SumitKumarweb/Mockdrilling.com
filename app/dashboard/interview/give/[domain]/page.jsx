"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Terminal,
  Clock,
  Code,
  Database,
  Brain,
  ArrowLeft,
  ArrowRight,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Send,
  CheckCircle,
  AlertCircle,
  Users,
  Star,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  PhoneOff,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

export default function GiveInterviewPage() {
  const params = useParams()
  const domain = params.domain
  const { user, updateInterviewCounts } = useAuth()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [timeLeft, setTimeLeft] = useState(45 * 60) // 45 minutes
  const [feedback, setFeedback] = useState("")
  const [rating, setRating] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [interviewStarted, setInterviewStarted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [candidateConnected, setCandidateConnected] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const [backendFeedback, setBackendFeedback] = useState(null)
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false)
  const [feedbackError, setFeedbackError] = useState(null)

  const domainInfo = {
    frontend: { name: "Frontend", icon: Code, color: "blue" },
    backend: { name: "Backend", icon: Database, color: "green" },
    dsa: { name: "DSA", icon: Brain, color: "purple" },
  }

  const candidateInfo = {
    name: "Sarah Johnson",
    level: "Intermediate",
    experience: "2 years",
    targetCompany: "Google",
  }

  const questions = {
    frontend: [
      {
        id: 1,
        question: "Explain the difference between let, const, and var in JavaScript. When would you use each?",
        difficulty: "Medium",
        timeLimit: 8,
        suggestedFollowUp: "Can you show me an example of hoisting with var?",
      },
      {
        id: 2,
        question: "How does React's Virtual DOM work? What are the benefits of using it?",
        difficulty: "Medium",
        timeLimit: 10,
        suggestedFollowUp: "How would you optimize a React component that re-renders frequently?",
      },
      {
        id: 3,
        question: "Implement a debounce function in JavaScript. Explain when and why you would use it.",
        difficulty: "Hard",
        timeLimit: 15,
        suggestedFollowUp: "What's the difference between debounce and throttle?",
      },
    ],
    backend: [
      {
        id: 1,
        question: "Explain the difference between SQL and NoSQL databases. When would you choose one over the other?",
        difficulty: "Medium",
        timeLimit: 8,
        suggestedFollowUp: "Can you give me examples of when you'd use each type?",
      },
      {
        id: 2,
        question: "What is middleware in Express.js? How would you implement authentication middleware?",
        difficulty: "Medium",
        timeLimit: 10,
        suggestedFollowUp: "How would you handle JWT token validation in middleware?",
      },
      {
        id: 3,
        question: "Design a REST API for a blog system. Include endpoints for posts, comments, and users.",
        difficulty: "Hard",
        timeLimit: 15,
        suggestedFollowUp: "How would you handle pagination and filtering in your API?",
      },
    ],
    dsa: [
      {
        id: 1,
        question: "Implement a function to reverse a linked list. Explain the time and space complexity.",
        difficulty: "Medium",
        timeLimit: 12,
        suggestedFollowUp: "Can you do this iteratively and recursively?",
      },
      {
        id: 2,
        question: "Find the longest palindromic substring in a given string. Optimize for time complexity.",
        difficulty: "Hard",
        timeLimit: 15,
        suggestedFollowUp: "What's the time complexity of your solution? Can you optimize it further?",
      },
      {
        id: 3,
        question: "Implement a LRU (Least Recently Used) cache with O(1) operations.",
        difficulty: "Hard",
        timeLimit: 18,
        suggestedFollowUp: "How would you handle thread safety in a multi-threaded environment?",
      },
    ],
  }

  const currentQuestions = questions[domain] || questions.frontend
  const currentDomain = domainInfo[domain] || domainInfo.frontend
  const Icon = currentDomain.icon

  // Fetch feedback from backend
  const fetchBackendFeedback = async (questionId) => {
    if (!sessionId) return

    setIsLoadingFeedback(true)
    setFeedbackError(null)

    try {
      const response = await fetch(`/api/interview/feedback?sessionId=${sessionId}&questionId=${questionId}`)
      const data = await response.json()

      if (data.success && data.feedback) {
        setBackendFeedback(data.feedback)
      } else {
        setBackendFeedback(null)
      }
    } catch (error) {
      console.error("Failed to fetch feedback:", error)
      setFeedbackError("Failed to load feedback from backend")
      setBackendFeedback(null)
    } finally {
      setIsLoadingFeedback(false)
    }
  }

  // Save feedback to backend
  const saveFeedbackToBackend = async () => {
    if (!sessionId || !feedback.trim()) return

    try {
      const response = await fetch("/api/interview/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          questionId: currentQuestions[currentQuestion].id,
          feedback: feedback.trim(),
          rating,
          timestamp: new Date().toISOString(),
        }),
      })

      const data = await response.json()
      if (data.success) {
        // Feedback saved successfully
        console.log("Feedback saved to backend")
      }
    } catch (error) {
      console.error("Failed to save feedback:", error)
    }
  }

  // Timer effect
  useEffect(() => {
    if (interviewStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [interviewStarted, timeLeft])

  // Simulate candidate connection and session initialization
  useEffect(() => {
    if (interviewStarted) {
      // Generate session ID
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      setSessionId(newSessionId)

      setTimeout(() => {
        setCandidateConnected(true)
      }, 2000)
    }
  }, [interviewStarted])

  // Fetch feedback when question changes
  useEffect(() => {
    if (candidateConnected && sessionId) {
      fetchBackendFeedback(currentQuestions[currentQuestion].id)
    }
  }, [currentQuestion, candidateConnected, sessionId])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleStartInterview = () => {
    setInterviewStarted(true)
  }

  const handleNextQuestion = () => {
    if (currentQuestion < currentQuestions.length - 1) {
      // Save current feedback before moving to next question
      if (feedback.trim()) {
        saveFeedbackToBackend()
      }

      setCurrentQuestion(currentQuestion + 1)
      setFeedback("")
      setRating(0)
      setBackendFeedback(null)
    }
  }

  const handleSaveFeedback = () => {
    saveFeedbackToBackend()
  }

  const handleSubmitInterview = async () => {
    setIsSubmitting(true)

    try {
      // Save final feedback
      if (feedback.trim()) {
        await saveFeedbackToBackend()
      }

      // Submit interview to API
      const response = await fetch("/api/interview/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          endTime: new Date().toISOString(),
          code: "", // No code for giving interviews
          language: "none",
          responses: [], // No responses for giving interviews
          userId: user?.uid,
          interviewType: 'give',
          domain: domain,
        }),
      })

      const result = await response.json()

      if (result.success) {
        console.log('Interview submitted successfully:', result)
        if (result.drillPointsUpdate?.success) {
          console.log(`Drill points updated: ${result.drillPointsUpdate.pointsChange} points`)
        }
        
        // Update interview counts locally
        if (user?.uid) {
          await updateInterviewCounts('give', 1)
          console.log('Interview count updated locally')
        }
      }

      // Redirect to results
      window.location.href = "/dashboard/interview/results?type=give"
    } catch (error) {
      console.error("Failed to submit interview:", error)
      setIsSubmitting(false)
    }
  }

  const progress = ((currentQuestion + 1) / currentQuestions.length) * 100

  if (!interviewStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-black/40 border-green-500/20 backdrop-blur-xl">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className={`w-12 h-12 bg-${currentDomain.color}-500/20 rounded-lg flex items-center justify-center`}>
                <Icon className={`w-6 h-6 text-${currentDomain.color}-400`} />
              </div>
              <div>
                <CardTitle className="text-white font-mono text-2xl">Give {currentDomain.name} Interview</CardTitle>
                <CardDescription className="text-gray-400 font-mono">Help a fellow developer practice</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="bg-green-500/10 border-green-500/30 text-green-400">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="font-mono">
                You'll earn 100 Drill Points for conducting this interview. Help the candidate improve their skills!
              </AlertDescription>
            </Alert>

            {/* Candidate Info */}
            <Card className="bg-gray-800/50 border-gray-600/30">
              <CardHeader>
                <CardTitle className="text-white font-mono text-lg">Candidate Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400 font-mono">Name:</span>
                  <span className="text-white font-mono">{candidateInfo.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-mono">Level:</span>
                  <span className="text-white font-mono">{candidateInfo.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-mono">Experience:</span>
                  <span className="text-white font-mono">{candidateInfo.experience}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-mono">Target Company:</span>
                  <span className="text-white font-mono">{candidateInfo.targetCompany}</span>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="text-white font-mono font-bold">Interviewer Guidelines:</h3>
              <div className="space-y-2 text-gray-300 font-mono text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Ask follow-up questions to test deeper understanding</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Provide constructive feedback after each answer</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Rate the candidate's performance honestly</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Be encouraging and professional</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                variant="outline"
                className="flex-1 bg-black/20 border-gray-600 text-white hover:border-green-500 font-mono"
                onClick={() => setIsVideoOn(!isVideoOn)}
              >
                {isVideoOn ? <Video className="w-4 h-4 mr-2" /> : <VideoOff className="w-4 h-4 mr-2" />}
                {isVideoOn ? "Video On" : "Video Off"}
              </Button>
              <Button
                variant="outline"
                className="flex-1 bg-black/20 border-gray-600 text-white hover:border-green-500 font-mono"
                onClick={() => setIsRecording(!isRecording)}
              >
                {isRecording ? <Mic className="w-4 h-4 mr-2" /> : <MicOff className="w-4 h-4 mr-2" />}
                {isRecording ? "Mic On" : "Mic Off"}
              </Button>
            </div>

            <Button
              onClick={handleStartInterview}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-black font-mono font-bold text-lg py-6"
            >
              <Users className="w-5 h-5 mr-2" />
              Start Interview (+100 DP)
            </Button>

            <div className="text-center">
              <Link href="/dashboard/interview-select" className="text-gray-400 hover:text-white font-mono text-sm">
                ← Back to Interview Selection
              </Link>
            </div>
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
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 bg-${currentDomain.color}-500/20 rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 text-${currentDomain.color}-400`} />
                </div>
                <span className="text-xl font-bold text-white font-mono">Interviewing {candidateInfo.name}</span>
              </div>
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30 font-mono">
                INTERVIEWER
              </Badge>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-black/60 rounded-lg px-3 py-2 border border-green-500/30">
                <Clock className="w-4 h-4 text-green-400" />
                <span className="text-green-400 font-mono font-bold">{formatTime(timeLeft)}</span>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsVideoOn(!isVideoOn)}
                  className={`${isVideoOn ? "text-green-400" : "text-gray-400"} hover:text-white`}
                >
                  {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsRecording(!isRecording)}
                  className={`${isRecording ? "text-green-400" : "text-gray-400"} hover:text-white`}
                >
                  {isRecording ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (confirm("Are you sure you want to end the interview? This will complete the session.")) {
                      handleSubmitInterview()
                    }
                  }}
                  className="text-red-400 hover:text-red-300"
                >
                  <PhoneOff className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!candidateConnected && (
          <Alert className="mb-6 bg-yellow-500/10 border-yellow-500/30 text-yellow-400">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="font-mono">
              Waiting for candidate to join... This usually takes 1-2 minutes.
            </AlertDescription>
          </Alert>
        )}

        {candidateConnected && (
          <>
            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400 font-mono text-sm">
                  Question {currentQuestion + 1} of {currentQuestions.length}
                </span>
                <span className="text-gray-400 font-mono text-sm">{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Left Column - Question & Controls */}
              <div className="space-y-6">
                {/* Question Card */}
                <Card className="bg-black/40 border-green-500/20 backdrop-blur-xl">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-white font-mono text-xl mb-2">
                          Question {currentQuestion + 1}
                        </CardTitle>
                        <Badge
                          variant="secondary"
                          className={`${
                            currentQuestions[currentQuestion].difficulty === "Easy"
                              ? "bg-green-500/20 text-green-400 border-green-500/30"
                              : currentQuestions[currentQuestion].difficulty === "Medium"
                                ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                : "bg-red-500/20 text-red-400 border-red-500/30"
                          } font-mono`}
                        >
                          {currentQuestions[currentQuestion].difficulty}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-gray-400 font-mono text-sm">Suggested Time</div>
                        <div className="text-white font-mono font-bold">
                          {currentQuestions[currentQuestion].timeLimit} min
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-white font-mono text-lg leading-relaxed">
                      {currentQuestions[currentQuestion].question}
                    </p>

                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                      <h4 className="text-blue-400 font-mono font-bold mb-2">Suggested Follow-up:</h4>
                      <p className="text-blue-300 font-mono text-sm">
                        {currentQuestions[currentQuestion].suggestedFollowUp}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Backend Feedback Display */}
                {isLoadingFeedback || backendFeedback || feedbackError ? (
                  <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl">
                    <CardHeader>
                      <CardTitle className="text-white font-mono flex items-center">
                        <MessageSquare className="w-5 h-5 mr-2 text-purple-400" />
                        Backend Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isLoadingFeedback && (
                        <div className="flex items-center space-x-2 text-purple-400">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="font-mono text-sm">Loading AI feedback...</span>
                        </div>
                      )}

                      {feedbackError && (
                        <Alert className="bg-red-500/10 border-red-500/30 text-red-400">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="font-mono text-sm">{feedbackError}</AlertDescription>
                        </Alert>
                      )}

                      {backendFeedback && (
                        <div className="space-y-3">
                          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                            <h5 className="text-purple-400 font-mono font-bold text-sm mb-2">AI Suggestions:</h5>
                            <p className="text-purple-300 font-mono text-sm">{backendFeedback.suggestions}</p>
                          </div>
                          {backendFeedback.score && (
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-400 font-mono text-sm">AI Score:</span>
                              <Badge
                                variant="secondary"
                                className="bg-purple-500/20 text-purple-400 border-purple-500/30 font-mono"
                              >
                                {backendFeedback.score}/10
                              </Badge>
                            </div>
                          )}
                        </div>
                      )}

                      {!isLoadingFeedback && !backendFeedback && !feedbackError && (
                        <div className="text-center py-4">
                          <div className="text-gray-400 font-mono text-sm">
                            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-purple-400" />
                            Pending feedback from backend...
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : null}

                {/* Quick Actions */}
                <Card className="bg-black/40 border-gray-500/20 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-white font-mono flex items-center">
                      <MessageSquare className="w-5 h-5 mr-2 text-gray-400" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20 font-mono"
                      >
                        <ThumbsUp className="w-4 h-4 mr-2" />
                        Good Answer
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-yellow-500/10 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20 font-mono"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Ask Follow-up
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20 font-mono"
                      >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Next Question
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 font-mono"
                      >
                        <ThumbsDown className="w-4 h-4 mr-2" />
                        Needs Work
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Feedback & Rating */}
              <div className="space-y-6">
                {/* Rating */}
                <Card className="bg-black/40 border-yellow-500/20 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-white font-mono flex items-center">
                      <Star className="w-5 h-5 mr-2 text-yellow-400" />
                      Rate This Answer
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex space-x-2 mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Button
                          key={star}
                          variant="ghost"
                          size="sm"
                          onClick={() => setRating(star)}
                          className={`p-2 ${
                            star <= rating ? "text-yellow-400" : "text-gray-600"
                          } hover:text-yellow-400`}
                        >
                          <Star className={`w-6 h-6 ${star <= rating ? "fill-current" : ""}`} />
                        </Button>
                      ))}
                    </div>
                    <div className="text-center">
                      <span className="text-gray-400 font-mono text-sm">
                        {rating === 0 && "Click to rate"}
                        {rating === 1 && "Poor - Needs significant improvement"}
                        {rating === 2 && "Below Average - Some understanding shown"}
                        {rating === 3 && "Average - Decent answer with room for improvement"}
                        {rating === 4 && "Good - Strong understanding demonstrated"}
                        {rating === 5 && "Excellent - Outstanding answer"}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Feedback */}
                <Card className="bg-black/40 border-gray-500/20 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-white font-mono flex items-center">
                      <Terminal className="w-5 h-5 mr-2 text-green-400" />
                      Feedback Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Provide constructive feedback for the candidate...

Examples:
- Strengths in the answer
- Areas for improvement  
- Suggestions for better approach
- Additional concepts to explore"
                      className="min-h-[200px] bg-black/20 border-gray-600 text-white placeholder:text-gray-400 focus:border-green-500 font-mono resize-none"
                    />
                    <div className="flex justify-between items-center mt-4">
                      <div className="text-gray-400 font-mono text-sm">{feedback.length} characters</div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSaveFeedback}
                        className="bg-black/20 border-gray-600 text-white hover:border-green-500 font-mono"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Save Feedback
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Candidate Video Placeholder */}
                <Card className="bg-black/40 border-gray-500/20 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-white font-mono flex items-center">
                      <Video className="w-5 h-5 mr-2 text-gray-400" />
                      Candidate Video
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Video className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                        <p className="text-gray-400 font-mono text-sm">{candidateInfo.name}</p>
                        <Badge
                          variant="secondary"
                          className="bg-green-500/20 text-green-400 border-green-500/30 font-mono text-xs"
                        >
                          Connected
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                disabled={currentQuestion === 0}
                className="bg-black/20 border-gray-600 text-white hover:border-green-500 font-mono"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentQuestion < currentQuestions.length - 1 ? (
                <Button
                  onClick={handleNextQuestion}
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-black font-mono font-bold"
                >
                  Next Question
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmitInterview}
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-mono font-bold"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Completing...
                    </div>
                  ) : (
                    <>
                      Complete Interview (+100 DP)
                      <CheckCircle className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
