"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Terminal,
  ArrowLeft,
  MessageSquare,
  Star,
  ThumbsUp,
  ThumbsDown,
  Code,
  Database,
  Brain,
  Calendar,
  User,
  Mail,
} from "lucide-react"
import Link from "next/link"

export default function FeedbackPage() {
  const [activeTab, setActiveTab] = useState("received")
  const [selectedDomain, setSelectedDomain] = useState("all")
  const [receivedFeedback, setReceivedFeedback] = useState([])
  const [givenFeedback, setGivenFeedback] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeedback = async () => {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock received feedback data
      const mockReceivedFeedback = [
        {
          id: 1,
          interviewer: {
            name: "Sarah Chen",
            avatar: "/placeholder.svg?height=40&width=40&text=SC",
            company: "Google",
            position: "Senior SDE",
          },
          domain: "Frontend",
          date: "2024-01-15",
          rating: 4.8,
          score: 92,
          strengths: [
            "Excellent problem-solving approach",
            "Clean and readable code",
            "Good understanding of React concepts",
          ],
          improvements: ["Could improve time complexity analysis", "Consider edge cases more thoroughly"],
          overallFeedback:
            "Great interview! You demonstrated strong technical skills and clear communication. Your approach to breaking down the problem was methodical and well-structured. Keep practicing algorithmic problems to improve speed.",
          status: "completed",
        },
        {
          id: 2,
          interviewer: {
            name: "Rahul Kumar",
            avatar: "/placeholder.svg?height=40&width=40&text=RK",
            company: "Microsoft",
            position: "Principal Engineer",
          },
          domain: "Backend",
          date: "2024-01-12",
          rating: 4.5,
          score: 88,
          strengths: [
            "Strong system design knowledge",
            "Good database optimization skills",
            "Clear explanation of trade-offs",
          ],
          improvements: ["Practice more on distributed systems", "Improve API design patterns"],
          overallFeedback:
            "Solid performance overall. Your understanding of backend concepts is good, but there's room for improvement in distributed systems design. I'd recommend studying more about microservices architecture.",
          status: "completed",
        },
        {
          id: 3,
          interviewer: {
            name: "Priya Sharma",
            avatar: "/placeholder.svg?height=40&width=40&text=PS",
            company: "Amazon",
            position: "Staff Engineer",
          },
          domain: "DSA",
          date: "2024-01-10",
          rating: null,
          score: null,
          strengths: [],
          improvements: [],
          overallFeedback: "",
          status: "pending",
        },
      ]

      // Mock given feedback data
      const mockGivenFeedback = [
        {
          id: 1,
          candidate: {
            name: "Amit Patel",
            avatar: "/placeholder.svg?height=40&width=40&text=AP",
            experience: "3 years",
          },
          domain: "Frontend",
          date: "2024-01-14",
          rating: 4.2,
          score: 85,
          strengths: ["Good React knowledge", "Responsive design skills", "Problem-solving approach"],
          improvements: ["Improve JavaScript fundamentals", "Practice more complex algorithms"],
          overallFeedback:
            "Good technical foundation with room for growth. Focus on strengthening core JavaScript concepts and practice more algorithmic thinking.",
          myRating: 4.9,
        },
        {
          id: 2,
          candidate: {
            name: "Neha Singh",
            avatar: "/placeholder.svg?height=40&width=40&text=NS",
            experience: "2 years",
          },
          domain: "Backend",
          date: "2024-01-11",
          rating: 4.6,
          score: 90,
          strengths: ["Excellent API design", "Strong database knowledge", "Good system thinking"],
          improvements: ["Consider more edge cases", "Improve error handling"],
          overallFeedback:
            "Impressive performance! Strong technical skills and clear communication. Ready for senior roles with a bit more experience.",
          myRating: 4.8,
        },
      ]

      setReceivedFeedback(mockReceivedFeedback)
      setGivenFeedback(mockGivenFeedback)
      setLoading(false)
    }

    fetchFeedback()
  }, [selectedDomain])

  const getDomainIcon = (domain) => {
    switch (domain) {
      case "Frontend":
        return <Code className="w-4 h-4 text-blue-400" />
      case "Backend":
        return <Database className="w-4 h-4 text-green-400" />
      case "DSA":
        return <Brain className="w-4 h-4 text-purple-400" />
      default:
        return <MessageSquare className="w-4 h-4 text-gray-400" />
    }
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-600"}`}
      />
    ))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 font-mono">Loading feedback...</p>
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
                Feedback
              </Badge>
            </div>

            <Select value={selectedDomain} onValueChange={setSelectedDomain}>
              <SelectTrigger className="w-40 bg-black/20 border-gray-600 text-white font-mono">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black border-gray-600">
                <SelectItem value="all">All Domains</SelectItem>
                <SelectItem value="frontend">Frontend</SelectItem>
                <SelectItem value="backend">Backend</SelectItem>
                <SelectItem value="dsa">DSA</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white font-mono mb-2">Interview Feedback</h1>
          <p className="text-gray-400 font-mono">Review feedback from your interviews and track your progress</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-black/40 border border-gray-600/30">
            <TabsTrigger
              value="received"
              className="font-mono data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Received ({receivedFeedback.length})
            </TabsTrigger>
            <TabsTrigger
              value="given"
              className="font-mono data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
            >
              <User className="w-4 h-4 mr-2" />
              Given ({givenFeedback.length})
            </TabsTrigger>
          </TabsList>

          {/* Received Feedback Tab */}
          <TabsContent value="received" className="space-y-6">
            {receivedFeedback.map((feedback) => (
              <Card key={feedback.id} className="bg-black/40 border-gray-500/20 backdrop-blur-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage
                          src={feedback.interviewer.avatar || "/placeholder.svg"}
                          alt={feedback.interviewer.name}
                        />
                        <AvatarFallback className="bg-gray-600 text-white font-mono">
                          {feedback.interviewer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-white font-mono">{feedback.interviewer.name}</CardTitle>
                        <CardDescription className="text-gray-400 font-mono">
                          {feedback.interviewer.position} at {feedback.interviewer.company}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30 font-mono">
                        {getDomainIcon(feedback.domain)}
                        <span className="ml-1">{feedback.domain}</span>
                      </Badge>
                      <div className="flex items-center text-gray-400 font-mono text-sm">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(feedback.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {feedback.status === "pending" ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 border-4 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-yellow-400 font-mono font-bold">Feedback Pending</p>
                      <p className="text-gray-400 font-mono text-sm">The interviewer hasn't provided feedback yet</p>
                    </div>
                  ) : (
                    <>
                      {/* Rating and Score */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="text-center">
                          <p className="text-gray-400 font-mono text-sm mb-2">Overall Rating</p>
                          <div className="flex items-center justify-center space-x-1 mb-2">
                            {renderStars(feedback.rating)}
                          </div>
                          <p className="text-2xl font-bold text-yellow-400 font-mono">{feedback.rating}/5</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-400 font-mono text-sm mb-2">Interview Score</p>
                          <p className="text-3xl font-bold text-green-400 font-mono">{feedback.score}%</p>
                        </div>
                      </div>

                      {/* Strengths */}
                      <div>
                        <h4 className="text-white font-mono font-bold mb-3 flex items-center">
                          <ThumbsUp className="w-4 h-4 mr-2 text-green-400" />
                          Strengths
                        </h4>
                        <div className="space-y-2">
                          {feedback.strengths.map((strength, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                              <p className="text-gray-300 font-mono text-sm">{strength}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Areas for Improvement */}
                      <div>
                        <h4 className="text-white font-mono font-bold mb-3 flex items-center">
                          <ThumbsDown className="w-4 h-4 mr-2 text-orange-400" />
                          Areas for Improvement
                        </h4>
                        <div className="space-y-2">
                          {feedback.improvements.map((improvement, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                              <p className="text-gray-300 font-mono text-sm">{improvement}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Overall Feedback */}
                      <div>
                        <h4 className="text-white font-mono font-bold mb-3">Overall Feedback</h4>
                        <div className="bg-black/20 rounded-lg p-4 border border-gray-600/30">
                          <p className="text-gray-300 font-mono text-sm leading-relaxed">{feedback.overallFeedback}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-3">
                        <Link href={`/profile/${feedback.interviewer.name.toLowerCase().replace(" ", "-")}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-black/20 border-blue-500/30 text-blue-400 hover:bg-blue-500/10 font-mono"
                          >
                            <User className="w-4 h-4 mr-2" />
                            View Profile
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-black/20 border-green-500/30 text-green-400 hover:bg-green-500/10 font-mono"
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Given Feedback Tab */}
          <TabsContent value="given" className="space-y-6">
            {givenFeedback.map((feedback) => (
              <Card key={feedback.id} className="bg-black/40 border-gray-500/20 backdrop-blur-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage
                          src={feedback.candidate.avatar || "/placeholder.svg"}
                          alt={feedback.candidate.name}
                        />
                        <AvatarFallback className="bg-gray-600 text-white font-mono">
                          {feedback.candidate.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-white font-mono">{feedback.candidate.name}</CardTitle>
                        <CardDescription className="text-gray-400 font-mono">
                          {feedback.candidate.experience} experience
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge
                        variant="secondary"
                        className="bg-green-500/20 text-green-400 border-green-500/30 font-mono"
                      >
                        {getDomainIcon(feedback.domain)}
                        <span className="ml-1">{feedback.domain}</span>
                      </Badge>
                      <div className="flex items-center text-gray-400 font-mono text-sm">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(feedback.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Rating and Score */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <p className="text-gray-400 font-mono text-sm mb-2">Your Rating</p>
                      <div className="flex items-center justify-center space-x-1 mb-2">
                        {renderStars(feedback.rating)}
                      </div>
                      <p className="text-2xl font-bold text-yellow-400 font-mono">{feedback.rating}/5</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-400 font-mono text-sm mb-2">Interview Score</p>
                      <p className="text-3xl font-bold text-green-400 font-mono">{feedback.score}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-400 font-mono text-sm mb-2">They Rated You</p>
                      <div className="flex items-center justify-center space-x-1 mb-2">
                        {renderStars(feedback.myRating)}
                      </div>
                      <p className="text-2xl font-bold text-blue-400 font-mono">{feedback.myRating}/5</p>
                    </div>
                  </div>

                  {/* Strengths */}
                  <div>
                    <h4 className="text-white font-mono font-bold mb-3 flex items-center">
                      <ThumbsUp className="w-4 h-4 mr-2 text-green-400" />
                      Strengths You Identified
                    </h4>
                    <div className="space-y-2">
                      {feedback.strengths.map((strength, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <p className="text-gray-300 font-mono text-sm">{strength}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Areas for Improvement */}
                  <div>
                    <h4 className="text-white font-mono font-bold mb-3 flex items-center">
                      <ThumbsDown className="w-4 h-4 mr-2 text-orange-400" />
                      Improvements You Suggested
                    </h4>
                    <div className="space-y-2">
                      {feedback.improvements.map((improvement, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                          <p className="text-gray-300 font-mono text-sm">{improvement}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Overall Feedback */}
                  <div>
                    <h4 className="text-white font-mono font-bold mb-3">Your Overall Feedback</h4>
                    <div className="bg-black/20 rounded-lg p-4 border border-gray-600/30">
                      <p className="text-gray-300 font-mono text-sm leading-relaxed">{feedback.overallFeedback}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-3">
                    <Link href={`/profile/${feedback.candidate.name.toLowerCase().replace(" ", "-")}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-black/20 border-blue-500/30 text-blue-400 hover:bg-blue-500/10 font-mono"
                      >
                        <User className="w-4 h-4 mr-2" />
                        View Profile
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-black/20 border-green-500/30 text-green-400 hover:bg-green-500/10 font-mono"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
