"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Terminal,
  Trophy,
  Clock,
  Target,
  TrendingUp,
  ArrowRight,
  Home,
  RotateCcw,
  Share2,
  Download,
  CheckCircle,
  Zap,
  Gift,
  Calendar,
  BookOpen,
  Users,
  Award,
  Code,
  MessageSquare,
  Video,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function InterviewResultsPage() {
  const [showResults, setShowResults] = useState(false)
  const [countdown, setCountdown] = useState(600) // 10 minutes in seconds
  const [isProcessing, setIsProcessing] = useState(true)
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("sessionId")
  const interviewType = searchParams.get("type") || "take"

  // Fetch results from backend
  useEffect(() => {
    const fetchResults = async () => {
      if (sessionId) {
        try {
          const response = await fetch(`/api/interview/results?sessionId=${sessionId}`)
          const data = await response.json()

          if (data.success) {
            setResults(data.results)
          }
        } catch (error) {
          console.error("Failed to fetch results:", error)
        } finally {
          setLoading(false)
        }
      } else {
        // Mock results for demo
        setResults({
          sessionId: "demo_session",
          overallScore: 78,
          duration: 42,
          language: "JavaScript",
          domain: "Frontend",
          scores: {
            code: 82,
            communication: 75,
            problemSolving: 77,
            overall: 78,
          },
          feedback: {
            strengths: ["Good code structure", "Clear problem-solving approach", "Proper variable naming"],
            improvements: ["Add more error handling", "Optimize time complexity", "Improve code comments"],
            detailedFeedback: {
              codeQuality:
                "Your code demonstrates good understanding of JavaScript fundamentals. The solution is functional and well-structured.",
              communication:
                "You explained your thought process clearly during the interview. Consider being more concise in explanations.",
              problemSolving:
                "Good approach to breaking down the problem. Work on considering edge cases earlier in the process.",
            },
            recommendations: [
              "Practice more algorithm optimization techniques",
              "Study advanced JavaScript concepts like closures",
              "Work on explaining complex concepts more clearly",
              "Practice more coding challenges on LeetCode",
            ],
            nextSteps: [
              "Take a Backend interview to diversify skills",
              "Book a professional mock for company-specific prep",
              "Review recommended resources",
              "Practice with peers in the community",
            ],
          },
        })
        setLoading(false)
      }
    }

    fetchResults()
  }, [sessionId])

  // Countdown effect
  useEffect(() => {
    if (isProcessing && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    } else if (countdown === 0) {
      setIsProcessing(false)
      setShowResults(true)
    }
  }, [isProcessing, countdown])

  const handleShowResultsNow = () => {
    setIsProcessing(false)
    setShowResults(true)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-400"
    if (score >= 60) return "text-yellow-400"
    return "text-red-400"
  }

  const getScoreBadgeColor = (score) => {
    if (score >= 80) return "bg-green-500/20 text-green-400 border-green-500/30"
    if (score >= 60) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
    return "bg-red-500/20 text-red-400 border-red-500/30"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
      </div>
    )
  }

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-black/40 border-green-500/20 backdrop-blur-xl">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center animate-pulse">
                <Terminal className="w-8 h-8 text-black" />
              </div>
            </div>
            <CardTitle className="text-3xl text-white font-mono mb-2">🎉 Congratulations!</CardTitle>
            <CardDescription className="text-gray-300 font-mono text-lg">
              {interviewType === "take"
                ? "You've successfully completed your video interview!"
                : "You've successfully conducted a video interview!"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <Alert className="bg-blue-500/10 border-blue-500/30 text-blue-400">
              <Clock className="h-4 w-4" />
              <AlertDescription className="font-mono">
                <div className="flex items-center justify-between">
                  <span>Our AI is analyzing your video interview performance...</span>
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30 font-mono">
                    {formatTime(countdown)}
                  </Badge>
                </div>
              </AlertDescription>
            </Alert>

            <div className="text-center space-y-4">
              <div className="w-24 h-24 mx-auto bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full flex items-center justify-center border border-green-500/30">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white font-mono">Analyzing Your Performance</h3>
                <p className="text-gray-400 font-mono text-sm">
                  Processing video call data, code submissions, and communication patterns
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                <div className="bg-black/20 rounded-lg p-4 border border-gray-600/30">
                  <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <p className="text-green-400 font-mono text-sm">Video Interview Completed</p>
                </div>
                <div className="bg-black/20 rounded-lg p-4 border border-gray-600/30">
                  <div className="animate-pulse">
                    <div className="w-6 h-6 bg-yellow-400 rounded mx-auto mb-2"></div>
                  </div>
                  <p className="text-yellow-400 font-mono text-sm">Generating AI Report</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-white font-mono font-bold">What's Being Analyzed:</h4>
              <div className="space-y-2 text-gray-300 font-mono text-sm">
                <div className="flex items-center space-x-2">
                  <Code className="w-4 h-4 text-purple-400" />
                  <span>Code quality and implementation approach</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Video className="w-4 h-4 text-blue-400" />
                  <span>Video communication and presentation skills</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-yellow-400" />
                  <span>Chat interactions and collaboration</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-green-400" />
                  <span>Problem-solving methodology</span>
                </div>
              </div>
            </div>

            <Alert className="bg-green-500/10 border-green-500/30 text-green-400">
              <Gift className="h-4 w-4" />
              <AlertDescription className="font-mono">
                {results?.drillPointsEarned 
                  ? `${results.drillPointsEarned >= 0 ? '+' : ''}${results.drillPointsEarned} Drill Points ${results.drillPointsEarned >= 0 ? 'earned' : 'deducted'} from your account`
                  : interviewType === "take"
                    ? "Drill Points will be deducted from your account"
                    : "Drill Points will be added to your account"}
              </AlertDescription>
            </Alert>

            <div className="flex space-x-4">
              <Button
                onClick={handleShowResultsNow}
                className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-black font-mono font-bold"
              >
                <Zap className="w-4 h-4 mr-2" />
                Show Results Now
              </Button>
              <Link href="/dashboard" className="flex-1">
                <Button
                  variant="outline"
                  className="w-full bg-black/20 border-gray-600 text-white hover:border-green-500 font-mono"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <Card className="w-full max-w-md bg-black/40 border-red-500/20 backdrop-blur-xl">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-white font-mono font-bold mb-2">Results Not Found</h3>
            <p className="text-gray-400 font-mono text-sm mb-4">Unable to load interview results. Please try again.</p>
            <Link href="/dashboard">
              <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-black font-mono font-bold">
                <Home className="w-4 h-4 mr-2" />
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
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <Terminal className="w-5 h-5 text-black" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent font-mono">
                  MockDrilling
                </span>
              </div>
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30 font-mono">
                Interview Results
              </Badge>
            </div>

            <Link href="/dashboard">
              <Button
                variant="outline"
                className="bg-black/20 border-gray-600 text-white hover:border-green-500 font-mono"
              >
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Congratulations Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Trophy className="w-12 h-12 text-yellow-400" />
            <h1 className="text-4xl font-bold text-white font-mono">Outstanding Performance!</h1>
            <Trophy className="w-12 h-12 text-yellow-400" />
          </div>
          <p className="text-xl text-gray-300 font-mono">Your video interview has been analyzed by our AI system</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overall Score */}
            <Card className="bg-black/40 border-green-500/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white font-mono flex items-center">
                  <Target className="w-5 h-5 mr-2 text-green-400" />
                  Overall Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-center">
                    <div className={`text-6xl font-bold font-mono ${getScoreColor(results.scores.overall)}`}>
                      {results.scores.overall}%
                    </div>
                    <Badge variant="secondary" className={`${getScoreBadgeColor(results.scores.overall)} font-mono`}>
                      {results.scores.overall >= 80
                        ? "Excellent"
                        : results.scores.overall >= 60
                          ? "Good"
                          : "Needs Work"}
                    </Badge>
                  </div>
                  <div className="flex-1 ml-8">
                    <Progress value={results.scores.overall} className="h-4 mb-4" />
                    <div className="grid grid-cols-2 gap-4 text-sm font-mono">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Duration:</span>
                        <span className="text-white">{results.duration} minutes</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Language:</span>
                        <span className="text-white">{results.language}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Domain:</span>
                        <span className="text-white">{results.domain}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Session:</span>
                        <span className="text-white">{results.sessionId?.substring(0, 8)}...</span>
                      </div>
                      {results.drillPointsEarned && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Drill Points:</span>
                          <span className={`font-mono ${results.drillPointsEarned >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {results.drillPointsEarned >= 0 ? '+' : ''}{results.drillPointsEarned} points
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Scores */}
            <Card className="bg-black/40 border-gray-500/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white font-mono flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-gray-400" />
                  Detailed Performance Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="scores" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-black/20">
                    <TabsTrigger value="scores" className="font-mono">
                      Scores
                    </TabsTrigger>
                    <TabsTrigger value="feedback" className="font-mono">
                      AI Feedback
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="scores" className="space-y-4 mt-4">
                    <div className="space-y-4">
                      <div className="bg-black/20 rounded-lg p-4 border border-gray-600/30">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white font-mono">Code Quality</span>
                          <span className={`font-mono font-bold ${getScoreColor(results.scores.code)}`}>
                            {results.scores.code}%
                          </span>
                        </div>
                        <Progress value={results.scores.code} className="h-2" />
                      </div>

                      <div className="bg-black/20 rounded-lg p-4 border border-gray-600/30">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white font-mono">Communication</span>
                          <span className={`font-mono font-bold ${getScoreColor(results.scores.communication)}`}>
                            {results.scores.communication}%
                          </span>
                        </div>
                        <Progress value={results.scores.communication} className="h-2" />
                      </div>

                      <div className="bg-black/20 rounded-lg p-4 border border-gray-600/30">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white font-mono">Problem Solving</span>
                          <span className={`font-mono font-bold ${getScoreColor(results.scores.problemSolving)}`}>
                            {results.scores.problemSolving}%
                          </span>
                        </div>
                        <Progress value={results.scores.problemSolving} className="h-2" />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="feedback" className="space-y-4 mt-4">
                    <div className="space-y-4">
                      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                        <h4 className="text-blue-400 font-mono font-bold mb-2">Code Quality Feedback:</h4>
                        <p className="text-blue-300 font-mono text-sm">
                          {results.feedback.detailedFeedback.codeQuality}
                        </p>
                      </div>

                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                        <h4 className="text-green-400 font-mono font-bold mb-2">Communication Feedback:</h4>
                        <p className="text-green-300 font-mono text-sm">
                          {results.feedback.detailedFeedback.communication}
                        </p>
                      </div>

                      <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                        <h4 className="text-purple-400 font-mono font-bold mb-2">Problem Solving Feedback:</h4>
                        <p className="text-purple-300 font-mono text-sm">
                          {results.feedback.detailedFeedback.problemSolving}
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white font-mono flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-purple-400" />
                  AI-Generated Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-green-400 font-mono font-bold mb-2">🎯 Focus Areas for Improvement:</h4>
                  <div className="space-y-2">
                    {results.feedback.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <ArrowRight className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300 font-mono text-sm">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="bg-gray-600" />

                <div>
                  <h4 className="text-blue-400 font-mono font-bold mb-2">🚀 Next Steps:</h4>
                  <div className="space-y-2">
                    {results.feedback.nextSteps.map((step, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300 font-mono text-sm">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Strengths & Improvements */}
            <Card className="bg-black/40 border-green-500/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white font-mono flex items-center">
                  <Award className="w-5 h-5 mr-2 text-green-400" />
                  Performance Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-green-400 font-mono font-bold mb-2">✅ Strengths:</h4>
                  <div className="space-y-1">
                    {results.feedback.strengths.map((strength, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-green-500/20 text-green-400 border-green-500/30 font-mono text-xs mr-1 mb-1"
                      >
                        {strength}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-yellow-400 font-mono font-bold mb-2">🔧 Areas to Improve:</h4>
                  <div className="space-y-1">
                    {results.feedback.improvements.map((improvement, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 font-mono text-xs mr-1 mb-1"
                      >
                        {improvement}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-black/40 border-blue-500/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white font-mono flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-blue-400" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/dashboard/interview-select">
                  <Button className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-black font-mono font-bold">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Take Another Interview
                  </Button>
                </Link>

                <Link href="/dashboard/paid-mock">
                  <Button
                    variant="outline"
                    className="w-full bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20 font-mono"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Expert Session
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  className="w-full bg-black/20 border-gray-600 text-white hover:border-green-500 font-mono"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Results
                </Button>

                <Button
                  variant="outline"
                  className="w-full bg-black/20 border-gray-600 text-white hover:border-green-500 font-mono"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
              </CardContent>
            </Card>

            {/* Community */}
            <Card className="bg-black/40 border-orange-500/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white font-mono flex items-center">
                  <Users className="w-5 h-5 mr-2 text-orange-400" />
                  Join the Community
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-300 font-mono text-sm">
                  Connect with other developers, share experiences, and learn together!
                </p>
                <Button
                  variant="outline"
                  className="w-full bg-orange-500/10 border-orange-500/30 text-orange-400 hover:bg-orange-500/20 font-mono"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Join Discord
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
