"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Terminal,
  Coins,
  Code,
  Database,
  Brain,
  Users,
  ArrowLeft,
  ArrowRight,
  Target,
  Plus,
  Minus,
  AlertCircle,
  CheckCircle,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import ProtectedRoute from "@/components/protected-route"
import { useAuth } from "@/hooks/useAuth"

export default function InterviewSelectPage() {
  const [selectedOption, setSelectedOption] = useState(null)
  const [selectedDomain, setSelectedDomain] = useState(null)
  const [requestMessage, setRequestMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const { userProfile, user } = useAuth()
  const [afterSubmit, setAfterSubmit] = useState(false)
  const router = useRouter()
  
  const userPoints = userProfile?.drillPoints || 1000

  const interviewOptions = [
    {
      id: "give",
      title: "Give Interview",
      description: "Conduct interviews for other candidates",
      cost: 120,
      icon: Minus,
      color: "green",
      benefits: [
        "Help other developers",
        "Improve questioning skills",
        "Build interviewing experience",
        "Contribute to community",
      ],
    },
    {
      id: "take",
      title: "Take Interview",
      description: "Practice your skills by taking a mock interview",
      cost: -100,
      icon: Plus,
      color: "blue",
      benefits: ["Earn drill points", "Get interviewed by peers", "Receive detailed feedback", "Improve your answers", "Build confidence"],
    },
  ]

  const domains = [
    {
      id: "frontend",
      name: "Frontend",
      icon: Code,
      color: "blue",
      description: "React, Vue, Angular, JavaScript, CSS, HTML",
      difficulty: "Beginner to Advanced",
    },
    {
      id: "backend",
      name: "Backend",
      icon: Database,
      color: "green",
      description: "Node.js, Python, Java, APIs, Databases",
      difficulty: "Beginner to Advanced",
    },
    {
      id: "dsa",
      name: "DSA",
      icon: Brain,
      color: "purple",
      description: "Data Structures, Algorithms, Problem Solving",
      difficulty: "Beginner to Advanced",
    },
  ]

  const selected = interviewOptions.find((o) => o.id === selectedOption)
  const canProceed = selectedOption && selectedDomain

  const handleSubmitRequest = async () => {
    if (!canProceed || !user) return
    
    setIsSubmitting(true)
    setSubmitError("")
    
    try {
      const response = await fetch('/api/interview-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          userName: userProfile?.name || user.displayName || 'Unknown User',
          userEmail: user.email || 'No Email',
          interviewType: selectedOption,
          domain: selectedDomain,
          message: requestMessage,
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        setSubmitSuccess(true)
        // Reset form
        setSelectedOption(null)
        setSelectedDomain(null)
        setRequestMessage("")
        setAfterSubmit(true)
      } else {
        setSubmitError(result.error || 'Failed to submit request')
      }
    } catch (error) {
      setSubmitError('Failed to submit request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
        {/* Header */}
        <header className="border-b border-green-500/20 bg-black/40 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                  <ArrowLeft className="w-5 h-5" />
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
                  Interview Setup
                </Badge>
              </div>

              <div className="flex items-center space-x-2 bg-black/60 rounded-lg px-3 py-2 border border-green-500/30">
                <Coins className="w-4 h-4 text-yellow-400" />
                <span className="text-green-400 font-mono font-bold">{userPoints}</span>
                <span className="text-gray-400 text-sm font-mono">DP</span>
              </div>
            </div>
          </div>
        </header>

        <div>
          {afterSubmit && (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Alert className="bg-green-500/10 border-green-500/30 text-green-400">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription className="font-mono">Request submitted successfully! Admin will review and approve your request.</AlertDescription>
              </Alert>
            </div>
          )}
        </div>

        {
          !afterSubmit && (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white font-mono mb-2">
              <span className="text-green-400">$</span> Request Interview Session
            </h1>
            <p className="text-gray-400 font-mono">Submit a request for interview approval</p>
          </div>

          {/* Step 1: Interview Type */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white font-mono mb-4 flex items-center">
              <span className="text-green-400 mr-2">1.</span>
              Select Interview Type
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {interviewOptions.map((option) => {
                const Icon = option.icon
                const isSelected = selectedOption === option.id
                const canAfford = option.cost <= 0 || userPoints >= option.cost

                return (
                  <Card
                    key={option.id}
                    className={`cursor-pointer transition-all duration-300 ${
                      isSelected
                        ? "bg-blue-500/20 border-blue-500/50 shadow-lg"
                        : "bg-black/40 border-gray-600/30 hover:border-gray-500/50"
                    } ${!canAfford ? "opacity-50" : ""}`}
                    onClick={() => canAfford && setSelectedOption(option.id)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <Icon className="w-6 h-6 text-blue-400" />
                          </div>
                          <div>
                            <CardTitle className="text-white font-mono">{option.title}</CardTitle>
                            <CardDescription className="text-gray-400 font-mono text-sm">
                              {option.description}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`text-lg font-bold font-mono ${
                              option.cost > 0 ? "text-red-400" : "text-green-400"
                            }`}
                          >
                            {option.cost > 0 ? "-" : "+"}
                            {Math.abs(option.cost)} DP
                          </div>
                          {!canAfford && (
                            <Badge variant="destructive" className="text-xs font-mono">
                              Insufficient Points
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {option.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle className="w-3 h-3 text-green-400" />
                            <span className="text-gray-300 text-sm font-mono">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Step 2: Domain Selection */}
          {selectedOption && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white font-mono mb-4 flex items-center">
                <span className="text-green-400 mr-2">2.</span>
                Select Domain
              </h2>

              <div className="grid md:grid-cols-3 gap-4">
                {domains.map((domain) => {
                  const Icon = domain.icon
                  const isSelected = selectedDomain === domain.id

                  return (
                    <Card
                      key={domain.id}
                      className={`cursor-pointer transitionn-all duration-300 ${
                        isSelected
                          ? "bg-blue-500/20 border-blue-500/50 shadow-lg"
                          : "bg-black/40 border-gray-600/30 hover:border-gray-500/50"
                      }`}
                      onClick={() => setSelectedDomain(domain.id)}
                    >
                      <CardContent className="p-6 text-center">
                        <div className="w-16 h-16 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                          <Icon className="w-8 h-8 text-blue-400" />
                        </div>
                        <h3 className="text-white font-mono font-bold mb-2">{domain.name}</h3>
                        <p className="text-gray-400 text-sm font-mono mb-2">{domain.description}</p>
                        <Badge variant="secondary" className="bg-gray-700/50 text-gray-300 font-mono text-xs">
                          {domain.difficulty}
                        </Badge>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          {/* Request Form */}
          {selectedOption && selectedDomain && (
            <div className="space-y-6">
              <Separator className="bg-gray-600" />

              <Card className="bg-black/40 border-green-500/20 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white font-mono flex items-center">
                    <Terminal className="w-5 h-5 mr-2 text-green-400" />
                    Interview Request Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-gray-400 font-mono text-sm">Mode:</p>
                      <p className="text-white font-mono font-bold">
                        {selectedOption === "take" ? "Take Interview" : "Give Interview"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-400 font-mono text-sm">Domain:</p>
                      <p className="text-white font-mono font-bold">
                        {domains.find((d) => d.id === selectedDomain)?.name}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-400 font-mono text-sm">Points Impact:</p>
                      <p
                        className={`font-mono font-bold ${selectedOption === "give" ? "text-red-400" : "text-green-400"}`}
                      >
                        {selectedOption === "give" ? "-120" : "+100"} Drill Points
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-400 font-mono text-sm">Duration:</p>
                      <p className="text-white font-mono font-bold">45-60 minutes</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-gray-300 font-mono text-sm">Additional Message (Optional)</label>
                    <textarea
                      value={requestMessage}
                      onChange={(e) => setRequestMessage(e.target.value)}
                      placeholder="Any specific requirements or notes for the admin..."
                      className="w-full bg-black/20 border border-gray-600 text-white rounded-md px-3 py-2 font-mono text-sm resize-none h-20"
                    />
                  </div>

                  {submitError && (
                    <Alert className="bg-red-500/10 border-red-500/30 text-red-400">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="font-mono">{submitError}</AlertDescription>
                    </Alert>
                  )}

                  {submitSuccess && (
                    <Alert className="bg-green-500/10 border-green-500/30 text-green-400">
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription className="font-mono">
                        Request submitted successfully! Admin will review and approve your request.
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button
                    onClick={handleSubmitRequest}
                    disabled={!canProceed || isSubmitting}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-black font-mono font-bold text-lg py-6"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                        Submitting Request...
                      </>
                    ) : (
                      <>
                        <Target className="w-5 h-5 mr-2" />
                        Submit Interview Request
                      </>
                    )}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
          )
        }
      </div>
    </ProtectedRoute>
  )
}
