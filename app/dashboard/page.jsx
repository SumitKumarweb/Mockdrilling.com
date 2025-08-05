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
  Users,
} from "lucide-react"
import Link from "next/link"
import DrillPointsModal from "../components/drill-points-modal"
import ProtectedRoute from "@/components/protected-route"
import { useAuth } from "@/hooks/useAuth"

export default function Dashboard() {
  const { user: authUser, userProfile, logout } = useAuth()
  
  // Use userProfile data if available, otherwise fallback to auth user data
  const user = {
    name: userProfile?.name || authUser?.displayName || "User",
    email: userProfile?.email || authUser?.email || "user@example.com",
    drillPoints: userProfile?.drillPoints || 1000,
    level: userProfile?.experience === "0" ? "Beginner" : 
           userProfile?.experience === "1" ? "Novice" :
           userProfile?.experience === "2" ? "Intermediate" :
           userProfile?.experience === "3" ? "Advanced" :
           userProfile?.experience === "4" ? "Expert" :
           userProfile?.experience === "5" ? "Master" : "Legend",
    streak: 7, // This could be stored in userProfile in the future
  }

  const stats = {
    totalInterviews: (userProfile?.interviewsTaken || 0) + (userProfile?.interviewsGiven || 0),
    interviewsGiven: userProfile?.interviewsGiven || 0,
    interviewsTaken: userProfile?.interviewsTaken || 0,
    successRate: 78, // This could be calculated from actual interview data
    avgScore: 85, // This could be calculated from actual interview data
  }

  const [recentActivity] = useState([
    { type: "taken", domain: "Frontend", score: 92, points: -120, date: "2 hours ago" },
    { type: "given", domain: "Backend", rating: 4.8, points: +100, date: "1 day ago" },
    { type: "taken", domain: "DSA", score: 76, points: -120, date: "2 days ago" },
    { type: "given", domain: "Frontend", rating: 4.9, points: +100, date: "3 days ago" },
  ])

  const [showDrillPointsModal, setShowDrillPointsModal] = useState(false)

  return (
    <ProtectedRoute>
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
                  onClick={async () => {
                    await logout()
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
              Welcome back, {user.name}! 👋
            </h1>
            <p className="text-gray-400 font-mono">
              Ready to level up your interview skills? Let's get started.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Actions */}
              <div className="grid md:grid-cols-2 gap-4">
                <Link href="/dashboard/interview-select">
                  <Card className="bg-black/40 border-green-500/20 backdrop-blur-xl hover:border-green-500/40 transition-all cursor-pointer group">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                          <Target className="w-6 h-6 text-green-400" />
                        </div>
                        <div>
                          <h3 className="text-white font-mono font-bold">Take Interview</h3>
                          <p className="text-gray-400 font-mono text-sm">Practice with AI interviewer</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-400 transition-colors ml-auto" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/dashboard/paid-mock">
                  <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl hover:border-purple-500/40 transition-all cursor-pointer group">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                          <Trophy className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                          <h3 className="text-white font-mono font-bold">Professional Mock</h3>
                          <p className="text-gray-400 font-mono text-sm">Expert feedback & coaching</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors ml-auto" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>

              {/* Stats Overview */}
              <Card className="bg-black/40 border-blue-500/20 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white font-mono flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
                    Your Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white font-mono">{stats.totalInterviews}</div>
                      <div className="text-gray-400 font-mono text-sm">Total Interviews</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400 font-mono">{stats.interviewsGiven}</div>
                      <div className="text-gray-400 font-mono text-sm">Given</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400 font-mono">{stats.interviewsTaken}</div>
                      <div className="text-gray-400 font-mono text-sm">Taken</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400 font-mono">{stats.successRate}%</div>
                      <div className="text-gray-400 font-mono text-sm">Success Rate</div>
                    </div>
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
                      <div key={index} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            activity.type === "taken" ? "bg-blue-500/20" : "bg-green-500/20"
                          }`}>
                            {activity.type === "taken" ? (
                              <Target className="w-4 h-4 text-blue-400" />
                            ) : (
                              <Users className="w-4 h-4 text-green-400" />
                            )}
                          </div>
                          <div>
                            <p className="text-white font-mono text-sm">
                              {activity.type === "taken" ? "Took" : "Gave"} {activity.domain} interview
                            </p>
                            <p className="text-gray-400 font-mono text-xs">{activity.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {activity.score && <p className="text-gray-400 text-xs font-mono">Score: {activity.score}%</p>}
                          {activity.rating && (
                            <p className="text-gray-400 text-xs font-mono">Rating: {activity.rating}★</p>
                          )}
                          <span className={`font-mono text-sm ${
                            activity.points > 0 ? "text-green-400" : "text-red-400"
                          }`}>
                            {activity.points > 0 ? "+" : ""}{activity.points} DP
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* User Profile */}
              <Card className="bg-black/40 border-green-500/20 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white font-mono">Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={userProfile?.profilePhoto || "/placeholder.svg"}
                      alt="Profile"
                      className="w-12 h-12 rounded-full object-cover border-2 border-green-500/30"
                    />
                    <div>
                      <h3 className="text-white font-mono font-bold">{user.name}</h3>
                      <p className="text-gray-400 font-mono text-sm">{user.email}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-mono text-sm">Level</span>
                      <span className="text-white font-mono text-sm">{user.level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-mono text-sm">Streak</span>
                      <span className="text-white font-mono text-sm">{user.streak} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-mono text-sm">Avg Score</span>
                      <span className="text-white font-mono text-sm">{stats.avgScore}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Drill Points */}
              <Card className="bg-black/40 border-yellow-500/20 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white font-mono flex items-center">
                    <Coins className="w-5 h-5 mr-2 text-yellow-400" />
                    Drill Points
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-mono font-bold text-lg">{user.drillPoints}</span>
                      <Button
                        size="sm"
                        className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30"
                        onClick={() => setShowDrillPointsModal(true)}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400 font-mono">Next Level</span>
                        <span className="text-gray-400 font-mono">2000 DP</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="bg-black/40 border-blue-500/20 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white font-mono">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Code className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-400 font-mono text-sm">Frontend</span>
                    </div>
                    <span className="text-white font-mono text-sm">8 interviews</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Database className="w-4 h-4 text-green-400" />
                      <span className="text-gray-400 font-mono text-sm">Backend</span>
                    </div>
                    <span className="text-white font-mono text-sm">6 interviews</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Brain className="w-4 h-4 text-purple-400" />
                      <span className="text-gray-400 font-mono text-sm">DSA</span>
                    </div>
                    <span className="text-white font-mono text-sm">9 interviews</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Drill Points Modal */}
        <DrillPointsModal
          isOpen={showDrillPointsModal}
          onClose={() => setShowDrillPointsModal(false)}
        />
      </div>
    </ProtectedRoute>
  )
}
