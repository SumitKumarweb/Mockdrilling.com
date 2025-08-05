"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import {
  Star,
  MessageSquare,
  Target,
  Users,
  Brain,
  Send,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

export default function FeedbackForm({ 
  sessionId, 
  interviewerId, 
  intervieweeId, 
  domain, 
  onFeedbackSubmitted 
}) {
  const [rating, setRating] = useState(3)
  const [comments, setComments] = useState("")
  const [technicalScore, setTechnicalScore] = useState(3)
  const [communicationScore, setCommunicationScore] = useState(3)
  const [problemSolvingScore, setProblemSolvingScore] = useState(3)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const feedbackData = {
        sessionId,
        interviewerId,
        intervieweeId,
        domain,
        rating,
        comments,
        technicalScore,
        communicationScore,
        problemSolvingScore
      }

      const response = await fetch('/api/interview/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData)
      })

      const result = await response.json()

      if (result.success) {
        setSubmitted(true)
        if (onFeedbackSubmitted) {
          onFeedbackSubmitted(result.feedback)
        }
      } else {
        setError(result.error || 'Failed to submit feedback')
      }
    } catch (error) {
      console.error('Error submitting feedback:', error)
      setError('Failed to submit feedback. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getRatingColor = (value) => {
    if (value >= 4) return "text-green-400"
    if (value >= 3) return "text-yellow-400"
    return "text-red-400"
  }

  const getScoreLabel = (value) => {
    if (value >= 4.5) return "Excellent"
    if (value >= 3.5) return "Good"
    if (value >= 2.5) return "Average"
    if (value >= 1.5) return "Below Average"
    return "Poor"
  }

  if (submitted) {
    return (
      <Card className="bg-green-500/10 border-green-500/20 backdrop-blur-xl">
        <CardContent className="p-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">Feedback Submitted!</h3>
          <p className="text-gray-400">Thank you for providing feedback. It will help improve the interview experience.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-black/40 border-blue-500/20 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-white font-mono flex items-center">
          <MessageSquare className="w-5 h-5 mr-2 text-blue-400" />
          Interview Feedback
        </CardTitle>
        <CardDescription className="text-gray-400">
          Rate the candidate's performance in {domain} interview
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Overall Rating */}
          <div className="space-y-3">
            <Label className="text-white font-mono">Overall Rating</Label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`p-1 rounded transition-colors ${
                    star <= rating ? getRatingColor(rating) : 'text-gray-500'
                  }`}
                >
                  <Star className="w-6 h-6" fill={star <= rating ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">{rating}/5</span>
              <Badge variant="outline" className={getRatingColor(rating)}>
                {getScoreLabel(rating)}
              </Badge>
            </div>
          </div>

          {/* Detailed Scores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Technical Skills */}
            <div className="space-y-3">
              <Label className="text-white font-mono flex items-center">
                <Target className="w-4 h-4 mr-2 text-blue-400" />
                Technical Skills
              </Label>
              <Slider
                value={[technicalScore]}
                onValueChange={(value) => setTechnicalScore(value[0])}
                max={5}
                min={1}
                step={0.5}
                className="w-full"
              />
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">{technicalScore}/5</span>
                <Badge variant="outline" className={getRatingColor(technicalScore)}>
                  {getScoreLabel(technicalScore)}
                </Badge>
              </div>
            </div>

            {/* Communication */}
            <div className="space-y-3">
              <Label className="text-white font-mono flex items-center">
                <Users className="w-4 h-4 mr-2 text-green-400" />
                Communication
              </Label>
              <Slider
                value={[communicationScore]}
                onValueChange={(value) => setCommunicationScore(value[0])}
                max={5}
                min={1}
                step={0.5}
                className="w-full"
              />
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">{communicationScore}/5</span>
                <Badge variant="outline" className={getRatingColor(communicationScore)}>
                  {getScoreLabel(communicationScore)}
                </Badge>
              </div>
            </div>

            {/* Problem Solving */}
            <div className="space-y-3">
              <Label className="text-white font-mono flex items-center">
                <Brain className="w-4 h-4 mr-2 text-purple-400" />
                Problem Solving
              </Label>
              <Slider
                value={[problemSolvingScore]}
                onValueChange={(value) => setProblemSolvingScore(value[0])}
                max={5}
                min={1}
                step={0.5}
                className="w-full"
              />
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">{problemSolvingScore}/5</span>
                <Badge variant="outline" className={getRatingColor(problemSolvingScore)}>
                  {getScoreLabel(problemSolvingScore)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Comments */}
          <div className="space-y-3">
            <Label className="text-white font-mono">Additional Comments</Label>
            <Textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Share your thoughts about the candidate's performance, strengths, areas for improvement..."
              className="bg-black/20 border-gray-600 text-white placeholder-gray-400 min-h-[100px]"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-400 text-sm">{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-mono"
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Submitting...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Send className="w-4 h-4" />
                <span>Submit Feedback</span>
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 