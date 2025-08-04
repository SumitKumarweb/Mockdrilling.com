"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Terminal,
  Coins,
  Code,
  Database,
  Brain,
  Trophy,
  Target,
  ArrowRight,
  Plus,
  Minus,
  History,
  Settings,
  LogOut,
  Zap,
  Star,
  TrendingUp,
  Calendar,
  Award,
  MessageSquare,
} from "lucide-react"
import Link from "next/link"
import DrillPointsModal from "../components/drill-points-modal"

export default function Dashboard() {
  const [user] = useState({
    name: "Alex Developer",
    email: "alex@example.com",
    drillPoints: 1250,
    level: "Intermediate",
    streak: 7,
  })

  const [stats] = useState({
    totalInterviews: 23,
    interviewsGiven: 8,
    interviewsTaken: 15,
    successRate: 78,
    avgScore: 85,
  })

  const [recentActivity] = useState([
    { type: "taken", domain: "Frontend", score: 92, points: -120, date: "2 hours ago" },
    { type: "given", domain: "Backend", rating: 4.8, points: +100, date: "1 day ago" },
    { type: "taken", domain: "DSA", score: 76, points: -120, date: "2 days ago" },
    { type: "given", domain: "Frontend", rating: 4.9, points: +100, date: "3 days ago" },
  ])

  const [showDrillPointsModal, setShowDrillPointsModal] = useState(false)

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
                Dashboard
              </Badge>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-black/60 rounded-lg px-3 py-2 border border-green-500/30">
                <Coins className="w-4 h-4 text-yellow-400" />
                <span className="text-green-400 font-mono font-bold">{user.drillPoints}</span>
                <span className="text-gray-400 text-sm font-mono">DP</span>
              </div>
              <Link href="/dashboard/settings">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <Settings className="w-4 h-4" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
                onClick={() => {
                  // In real implementation, clear auth tokens and redirect
                  window.location.href = "/auth/login"
                }}
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white font-mono mb-2">
            Welcome back, <span className="text-green-400">{user.name}</span>
          </h1>
          <p className="text-gray-400 font-mono">Ready to level up your coding interview skills?</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-black/40 border-green-500/20 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-mono">Drill Points</p>
                  <p className="text-2xl font-bold text-green-400 font-mono">{user.drillPoints}</p>
                </div>
                <Coins className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-blue-500/20 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-mono">Success Rate</p>
                  <p className="text-2xl font-bold text-blue-400 font-mono">{stats.successRate}%</p>
                </div>
                <Trophy className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-mono">Total Interviews</p>
                  <p className="text-2xl font-bold text-purple-400 font-mono">{stats.totalInterviews}</p>
                </div>
                <Target className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-orange-500/20 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-mono">Current Streak</p>
                  <p className="text-2xl font-bold text-orange-400 font-mono">{user.streak} days</p>
                </div>
                <Zap className="w-8 h-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card className="bg-black/40 border-green-500/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white font-mono flex items-center">
                  <Terminal className="w-5 h-5 mr-2 text-green-400" />
                  Quick Actions
                </CardTitle>
                <CardDescription className="text-gray-400 font-mono">Start your next interview session</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href="/dashboard/interview-select">
                  <Button className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-black font-mono font-bold">
                    <Code className="w-4 h-4 mr-2" />
                    Start Free Mock Interview
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>

                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    className="bg-black/20 border-gray-600 text-white hover:border-green-500 font-mono"
                  >
                    <Code className="w-4 h-4 mr-1" />
                    Frontend
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-black/20 border-gray-600 text-white hover:border-green-500 font-mono"
                  >
                    <Database className="w-4 h-4 mr-1" />
                    Backend
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-black/20 border-gray-600 text-white hover:border-green-500 font-mono"
                  >
                    <Brain className="w-4 h-4 mr-1" />
                    DSA
                  </Button>
                </div>

                <Separator className="bg-gray-600" />

                <Link href="/dashboard/paid-mock">
                  <Button
                    variant="outline"
                    className="w-full bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20 font-mono"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Professional Mock (₹499)
                  </Button>
                </Link>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <Link href="/dashboard/rankings">
                    <Button
                      variant="outline"
                      className="w-full bg-black/20 border-gray-600 text-white hover:border-green-500 font-mono"
                    >
                      <Trophy className="w-4 h-4 mr-1" />
                      Rankings
                    </Button>
                  </Link>
                  <Link href="/dashboard/feedback">
                    <Button
                      variant="outline"
                      className="w-full bg-black/20 border-gray-600 text-white hover:border-green-500 font-mono"
                    >
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Feedback
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-black/40 border-gray-500/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white font-mono flex items-center">
                  <History className="w-5 h-5 mr-2 text-gray-400" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-gray-600/30"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            activity.type === "taken" ? "bg-blue-500/20" : "bg-green-500/20"
                          }`}
                        >
                          {activity.type === "taken" ? (
                            <Minus className="w-4 h-4 text-blue-400" />
                          ) : (
                            <Plus className="w-4 h-4 text-green-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-white font-mono text-sm">
                            {activity.type === "taken" ? "Took" : "Gave"} {activity.domain} Interview
                          </p>
                          <p className="text-gray-400 text-xs font-mono">{activity.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-mono text-sm ${activity.points > 0 ? "text-green-400" : "text-blue-400"}`}>
                          {activity.points > 0 ? "+" : ""}
                          {activity.points} DP
                        </p>
                        {activity.score && <p className="text-gray-400 text-xs font-mono">Score: {activity.score}%</p>}
                        {activity.rating && (
                          <p className="text-gray-400 text-xs font-mono">Rating: {activity.rating}★</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Wallet */}
            <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white font-mono flex items-center">
                  <Coins className="w-5 h-5 mr-2 text-yellow-400" />
                  Drill Points Wallet
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-yellow-400 font-mono">{user.drillPoints}</p>
                  <p className="text-gray-400 text-sm font-mono">Available Points</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-mono">
                    <span className="text-gray-400">Take Interview:</span>
                    <span className="text-blue-400">-120 DP</span>
                  </div>
                  <div className="flex justify-between text-sm font-mono">
                    <span className="text-gray-400">Give Interview:</span>
                    <span className="text-green-400">+100 DP</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full bg-black/20 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 font-mono"
                  onClick={() => setShowDrillPointsModal(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Buy More Points
                </Button>
              </CardContent>
            </Card>

            {/* Progress */}
            <Card className="bg-black/40 border-gray-500/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white font-mono flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                  Your Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm font-mono mb-2">
                    <span className="text-gray-400">Level Progress</span>
                    <span className="text-green-400">{user.level}</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-mono">
                    <span className="text-gray-400">Interviews Given:</span>
                    <span className="text-green-400">{stats.interviewsGiven}</span>
                  </div>
                  <div className="flex justify-between text-sm font-mono">
                    <span className="text-gray-400">Interviews Taken:</span>
                    <span className="text-blue-400">{stats.interviewsTaken}</span>
                  </div>
                  <div className="flex justify-between text-sm font-mono">
                    <span className="text-gray-400">Avg Score:</span>
                    <span className="text-purple-400">{stats.avgScore}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white font-mono flex items-center">
                  <Award className="w-5 h-5 mr-2 text-purple-400" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                      <Star className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-mono">First Interview</p>
                      <p className="text-gray-400 text-xs font-mono">Completed your first mock</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <Zap className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-mono">Week Streak</p>
                      <p className="text-gray-400 text-xs font-mono">7 days in a row</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <DrillPointsModal isOpen={showDrillPointsModal} onClose={() => setShowDrillPointsModal(false)} />
    </div>
  )
}
