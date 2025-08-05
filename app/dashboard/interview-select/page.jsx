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
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import ProtectedRoute from "@/components/protected-route"
import { useAuth } from "@/hooks/useAuth"

export default function InterviewSelectPage() {
  const [selectedOption, setSelectedOption] = useState(null)
  const [selectedDomain, setSelectedDomain] = useState(null)
  const { userProfile } = useAuth()
  const router = useRouter()
  
  const userPoints = userProfile?.drillPoints || 1000

  const interviewOptions = [
    {
      id: "take",
      title: "Take Interview",
      description: "Practice your skills by taking a mock interview",
      cost: 120,
      icon: Minus,
      color: "blue",
      benefits: ["Get interviewed by peers", "Receive detailed feedback", "Improve your answers", "Build confidence"],
    },
    {
      id: "give",
      title: "Give Interview",
      description: "Earn points by interviewing other candidates",
      cost: -100,
      icon: Plus,
      color: "green",
      benefits: [
        "Earn drill points",
        "Help other developers",
        "Improve questioning skills",
        "Build interviewing experience",
      ],
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

  const canProceed = selectedOption && selectedDomain && (selectedOption === "give" || userPoints >= 120)

  const handleProceed = () => {
    if (canProceed) {
      if (selectedOption === "take") {
        router.push(`/dashboard/interview/take/${selectedDomain}`)
      } else {
        router.push(`/dashboard/interview/give/${selectedDomain}`)
      }
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

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white font-mono mb-2">
              <span className="text-green-400">$</span> Choose Your Interview Mode
            </h1>
            <p className="text-gray-400 font-mono">Select whether you want to take or give an interview</p>
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
                const canAfford = option.id === "give" || userPoints >= Math.abs(option.cost)

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
                      className={`cursor-pointer transition-all duration-300 ${
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

          {/* Summary & Proceed */}
          {selectedOption && selectedDomain && (
            <div className="space-y-6">
              <Separator className="bg-gray-600" />

              <Card className="bg-black/40 border-green-500/20 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white font-mono flex items-center">
                    <Terminal className="w-5 h-5 mr-2 text-green-400" />
                    Interview Summary
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
                      <p className="text-gray-400 font-mono text-sm">Cost:</p>
                      <p
                        className={`font-mono font-bold ${selectedOption === "take" ? "text-red-400" : "text-green-400"}`}
                      >
                        {selectedOption === "take" ? "-120" : "+100"} Drill Points
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-400 font-mono text-sm">Duration:</p>
                      <p className="text-white font-mono font-bold">45-60 minutes</p>
                    </div>
                  </div>

                  {selectedOption === "take" && userPoints < 120 && (
                    <Alert className="bg-red-500/10 border-red-500/30 text-red-400">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="font-mono">
                        Insufficient drill points. You need 120 DP to take an interview.
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button
                    onClick={handleProceed}
                    disabled={!canProceed}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-black font-mono font-bold text-lg py-6"
                  >
                    {selectedOption === "take" ? (
                      <>
                        <Target className="w-5 h-5 mr-2" />
                        Start Taking Interview
                      </>
                    ) : (
                      <>
                        <Users className="w-5 h-5 mr-2" />
                        Start Giving Interview
                      </>
                    )}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
