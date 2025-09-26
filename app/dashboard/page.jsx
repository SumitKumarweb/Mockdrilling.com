"use client"

import { useState, useEffect } from "react"
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
  BarChart3,
  Bell,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"
import DrillPointsModal from "../components/drill-points-modal"
import ProtectedRoute from "@/components/protected-route"
import { useAuth } from "@/hooks/useAuth"
import NotificationsBell from "../components/notification-bell"

export default function Dashboard() {
  const { user: authUser, userProfile, logout } = useAuth()
  const [recentActivity, setRecentActivity] = useState([])
  const [loadingActivities, setLoadingActivities] = useState(true)
  const [rankings, setRankings] = useState([])
  const [loadingRankings, setLoadingRankings] = useState(true)
  const [userRank, setUserRank] = useState(null)
  const [showDrillPointsModal, setShowDrillPointsModal] = useState(false)
  const [achievements, setAchievements] = useState([])
  const [achievementsLoading, setAchievementsLoading] = useState(true)
  const [schedulingRequest, setSchedulingRequest] = useState(null)
  const [scheduleForm, setScheduleForm] = useState({
    interviewDate: '',
    interviewTime: '',
    meetingLink: '',
    adminNotes: ''
  })

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
    // Domain-specific stats
    frontendInterviews: userProfile?.domainStats?.frontend || 0,
    backendInterviews: userProfile?.domainStats?.backend || 0,
    dsaInterviews: userProfile?.domainStats?.dsa || 0,
  }



  // Fetch recent activities
  useEffect(() => {
    const fetchRecentActivities = async () => {
      if (authUser?.uid) {
        try {
          console.log('Fetching activities for user:', authUser.uid)
          setLoadingActivities(true)
          const response = await fetch(`/api/interview/activity?userId=${authUser.uid}&limit=10`)
          const data = await response.json()
          
          console.log('Activity API response:', data)
          
          if (data.success) {
            console.log('Setting activities:', data.activities)
            setRecentActivity(data.activities)
          } else {
            console.error('Failed to fetch activities:', data.error)
            // Fallback to empty array
            setRecentActivity([])
          }
        } catch (error) {
          console.error('Error fetching activities:', error)
          setRecentActivity([])
        } finally {
          setLoadingActivities(false)
        }
      } else {
        console.log('No auth user, skipping activity fetch')
      }
    }

    fetchRecentActivities()
  }, [authUser?.uid])

  // Fetch rankings
  useEffect(() => {
    const fetchRankings = async () => {
      if (authUser?.uid) {
        try {
          console.log('Fetching rankings for user:', authUser.uid)
          setLoadingRankings(true)
          const response = await fetch(`/api/rankings?userId=${authUser.uid}&limit=3`)
          const data = await response.json()
          
          console.log('Rankings API response:', data)
          
          if (data.success) {
            setRankings(data.rankings)
            setUserRank(data.userRank)
          } else {
            console.error('Failed to fetch rankings:', data.error)
            setRankings([])
          }
        } catch (error) {
          console.error('Error fetching rankings:', error)
          setRankings([])
        } finally {
          setLoadingRankings(false)
        }
      } else {
        console.log('No auth user, skipping rankings fetch')
      }
    }

    fetchRankings()
  }, [authUser?.uid])

  // Fetch achievements
  useEffect(() => {
    const fetchAchievements = async () => {
      if (authUser?.uid) {
        try {
          setAchievementsLoading(true)
          const response = await fetch(`/api/achievements?userId=${authUser.uid}`)
          const data = await response.json()
          if (data.success) {
            setAchievements(data.achievements || [])
          }
        } catch (error) {
          console.error('Error fetching achievements:', error)
        } finally {
          setAchievementsLoading(false)
        }
      }
    }
    fetchAchievements()
  }, [authUser?.uid, userProfile?.drillPoints, userProfile?.interviewsTaken, userProfile?.interviewsGiven, userProfile?.feedbackStats])

  // Refresh activities when user profile changes (after interview completion)
  useEffect(() => {
    if (userProfile && authUser?.uid) {
      const fetchRecentActivities = async () => {
        try {
          console.log('Refreshing activities after profile update')
          setLoadingActivities(true)
          const response = await fetch(`/api/interview/activity?userId=${authUser.uid}&limit=10`)
          const data = await response.json()
          
          if (data.success) {
            setRecentActivity(data.activities)
          }
        } catch (error) {
          console.error('Error refreshing activities:', error)
        } finally {
          setLoadingActivities(false)
        }
      }

      fetchRecentActivities()
    }
  }, [userProfile?.drillPoints, userProfile?.interviewsTaken, userProfile?.interviewsGiven])

  const handleScheduleInterview = (request) => {
    setSchedulingRequest(request)
    setScheduleForm({
      interviewDate: '',
      interviewTime: '',
      meetingLink: '',
      adminNotes: ''
    })
  }

  const handleScheduleSubmit = async () => {
    if (!schedulingRequest || !scheduleForm.interviewDate || !scheduleForm.interviewTime) {
      alert('Please fill in all required fields')
      return
    }

    try {
      const response = await fetch(`/api/interview-requests/${schedulingRequest.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'assigned',
          interviewDate: scheduleForm.interviewDate,
          interviewTime: scheduleForm.interviewTime,
          meetingLink: scheduleForm.meetingLink,
          adminNotes: scheduleForm.adminNotes
        })
      })

      const result = await response.json()
      if (result.success) {
        setSchedulingRequest(null)
        // loadRequests() // Refresh the requests list - This function is not defined in the original file
        alert('Interview scheduled successfully!')
      } else {
        alert(result.error || 'Failed to schedule interview')
      }
    } catch (error) {
      alert('Failed to schedule interview. Please try again.')
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
                <NotificationsBell />
                <div 
                  className="flex items-center space-x-2 bg-black/60 rounded-lg px-3 py-2 border border-green-500/30 cursor-pointer hover:bg-black/80 transition-colors"
                  onClick={() => setShowDrillPointsModal(true)}
                >
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
              {/* Quick Stats */}
              <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white font-mono flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-purple-400" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                      <div className="text-2xl font-bold text-purple-400">{stats.totalInterviews}</div>
                      <div className="text-xs text-gray-400 font-mono">Total Interviews</div>
                    </div>
                    <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                      <div className="text-2xl font-bold text-blue-400">{stats.frontendInterviews}</div>
                      <div className="text-xs text-gray-400 font-mono">Frontend</div>
                    </div>
                    <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                      <div className="text-2xl font-bold text-green-400">{stats.backendInterviews}</div>
                      <div className="text-xs text-gray-400 font-mono">Backend</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                      <div className="text-2xl font-bold text-yellow-400">{stats.dsaInterviews}</div>
                      <div className="text-xs text-gray-400 font-mono">DSA</div>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                                      <div className="text-center p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                    <div className="text-xl font-bold text-emerald-400">{stats.interviewsGiven}</div>
                    <div className="text-xs text-gray-400 font-mono">Given (-120 DP)</div>
                  </div>
                  <div className="text-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <div className="text-xl font-bold text-blue-400">{stats.interviewsTaken}</div>
                    <div className="text-xs text-gray-400 font-mono">Taken (+100 DP)</div>
                  </div>
                    <div className="text-center p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                      <div className="text-xl font-bold text-orange-400">{userProfile?.currentStreak || 0}</div>
                      <div className="text-xs text-gray-400 font-mono">Day Streak</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="grid md:grid-cols-2 gap-4">
                <Link href="/dashboard/interview-select">
                  <Card className="bg-black/40 border-green-500/20 backdrop-blur-xl hover:border-green-500/40 transition-all cursor-pointer group">
            <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                          <Users className="w-6 h-6 text-green-400" />
                        </div>
                <div>
                          <h3 className="text-white font-mono font-bold">Give Interview</h3>
                          <p className="text-gray-400 font-mono text-sm">Conduct interviews for others</p>
                </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-400 transition-colors ml-auto" />
              </div>
            </CardContent>
          </Card>
                </Link>

                <Link href="/dashboard/interview-select">
                  <Card className="bg-black/40 border-blue-500/20 backdrop-blur-xl hover:border-blue-500/40 transition-all cursor-pointer group">
            <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                          <Target className="w-6 h-6 text-blue-400" />
                        </div>
                <div>
                          <h3 className="text-white font-mono font-bold">Expert Interview</h3>
                          <p className="text-gray-400 font-mono text-sm">Practice with Expert interviewer</p>
                </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors ml-auto" />
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
                                    <CardTitle className="text-white font-mono flex items-center justify-between">
                    <div className="flex items-center">
                  <History className="w-5 h-5 mr-2 text-gray-400" />
                  Recent Activity
                    </div>
                    {authUser?.uid && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs bg-black/20 border-gray-600 text-gray-400 hover:text-white"
                        onClick={async () => {
                          try {
                            setLoadingActivities(true)
                            const response = await fetch(`/api/interview/activity?userId=${authUser.uid}&limit=10`)
                            const data = await response.json()
                            
                            if (data.success) {
                              setRecentActivity(data.activities)
                              console.log('Activities refreshed:', data.activities)
                            }
                          } catch (error) {
                            console.error('Error refreshing activities:', error)
                          } finally {
                            setLoadingActivities(false)
                          }
                        }}
                      >
                        Refresh
                      </Button>
                    )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                  {loadingActivities ? (
                <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-black/20 rounded-lg animate-pulse">
                      <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-gray-600/20"></div>
                            <div>
                              <div className="h-4 bg-gray-600/20 rounded w-32 mb-2"></div>
                              <div className="h-3 bg-gray-600/20 rounded w-20"></div>
                            </div>
                          </div>
                          <div className="h-4 bg-gray-600/20 rounded w-16"></div>
                        </div>
                      ))}
                    </div>
                  ) : recentActivity.length > 0 ? (
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              activity.interviewType === "take" ? "bg-blue-500/20" : "bg-green-500/20"
                            }`}>
                              {activity.interviewType === "take" ? (
                                <Target className="w-4 h-4 text-blue-400" />
                              ) : (
                                <Users className="w-4 h-4 text-green-400" />
                              )}
                        </div>
                        <div>
                          <p className="text-white font-mono text-sm">
                                {activity.interviewType === "take" ? "Took" : "Gave"} {activity.domain} interview
                              </p>
                              <p className="text-gray-400 font-mono text-xs">{activity.formattedDate}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {activity.score && (
                              <p className="text-gray-400 text-xs font-mono">Score: {activity.score}%</p>
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
                  ) : (
                    <div className="text-center py-8">
                      <History className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400 font-mono">No recent activities</p>
                      <p className="text-gray-500 font-mono text-sm">Start taking or giving interviews to see your activity here</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card className="bg-black/40 border-yellow-500/20 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white font-mono flex items-center justify-between">
                    <div className="flex items-center">
                      <Award className="w-5 h-5 mr-2 text-yellow-400" />
                      Recent Achievements
                    </div>
                    <Badge variant="outline" className="text-xs bg-yellow-500/10 border-yellow-500/30 text-yellow-400">
                      {achievements.length} unlocked
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {achievementsLoading ? (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20 animate-pulse">
                          <div className="w-8 h-8 bg-gray-600 rounded"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-600 rounded mb-2"></div>
                            <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : achievements.length > 0 ? (
                    <div className="space-y-3">
                      {achievements.slice(0, 3).map((achievement, index) => (
                        <div key={achievement.id} className={`flex items-center space-x-3 p-3 rounded-lg border transition-all hover:scale-105 ${
                          achievement.rarity === 'legendary' ? 'bg-purple-500/10 border-purple-500/30' :
                          achievement.rarity === 'epic' ? 'bg-blue-500/10 border-blue-500/30' :
                          achievement.rarity === 'rare' ? 'bg-green-500/10 border-green-500/30' :
                          achievement.rarity === 'uncommon' ? 'bg-yellow-500/10 border-yellow-500/30' :
                          'bg-gray-500/10 border-gray-500/30'
                        }`}>
                          <div className="text-2xl">{achievement.icon}</div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="text-white font-mono text-sm font-bold">{achievement.name}</h4>
                              <Badge variant="outline" className={`text-xs ${
                                achievement.rarity === 'legendary' ? 'border-purple-500 text-purple-400' :
                                achievement.rarity === 'epic' ? 'border-blue-500 text-blue-400' :
                                achievement.rarity === 'rare' ? 'border-green-500 text-green-400' :
                                achievement.rarity === 'uncommon' ? 'border-yellow-500 text-yellow-400' :
                                'border-gray-500 text-gray-400'
                              }`}>
                                {achievement.rarity}
                              </Badge>
                            </div>
                            <p className="text-gray-400 font-mono text-xs mt-1">{achievement.description}</p>
                          </div>
                        </div>
                      ))}
                      {achievements.length > 3 && (
                        <div className="text-center pt-2">
                          <p className="text-gray-500 font-mono text-sm">
                            +{achievements.length - 3} more achievements
                          </p>
                        </div>
                        )}
                      </div>
                  ) : (
                    <div className="text-center py-8">
                      <Award className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-500 font-mono">No achievements yet</p>
                      <p className="text-gray-600 font-mono text-sm">Complete interviews and earn drill points to unlock achievements!</p>
                    </div>
                  )}
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

              {/* Rankings Section */}
              <Card className="bg-black/40 border-yellow-500/20 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white font-mono flex items-center justify-between">
                                          <div className="flex items-center">
                        <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                        Leaderboard Rankings
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs bg-black/20 border-yellow-600 text-yellow-400 hover:text-white"
                          onClick={async () => {
                            try {
                              setLoadingRankings(true)
                              const response = await fetch(`/api/rankings?userId=${authUser.uid}&limit=3`)
                              const data = await response.json()
                              if (data.success) {
                                setRankings(data.rankings)
                                setUserRank(data.userRank)
                                console.log('Rankings refreshed:', data.rankings)
                              }
                            } catch (error) {
                              console.error('Error refreshing rankings:', error)
                            } finally {
                              setLoadingRankings(false)
                            }
                          }}
                        >
                          Refresh
                        </Button>
                        <Link href="/dashboard/rankings">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs bg-black/20 border-yellow-600 text-yellow-400 hover:text-white"
                          >
                            View All
                          </Button>
                        </Link>
                      </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingRankings ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-black/20 rounded-lg animate-pulse">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-gray-600/20"></div>
                            <div>
                              <div className="h-4 bg-gray-600/20 rounded w-24 mb-1"></div>
                              <div className="h-3 bg-gray-600/20 rounded w-16"></div>
                            </div>
                          </div>
                          <div className="h-4 bg-gray-600/20 rounded w-20"></div>
                        </div>
                      ))}
                    </div>
                  ) : rankings.length > 0 ? (
                    <div className="space-y-3">
                      {/* Top 3 Rankings with special styling */}
                      {rankings.slice(0, 3).map((ranking, index) => {
                        const rankColors = [
                          { bg: 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20', border: 'border-yellow-500/40', text: 'text-yellow-400', rankIcon: '🥇' },
                          { bg: 'bg-gradient-to-r from-gray-500/20 to-gray-600/20', border: 'border-gray-500/40', text: 'text-gray-400', rankIcon: '🥈' },
                          { bg: 'bg-gradient-to-r from-orange-500/20 to-orange-600/20', border: 'border-orange-500/40', text: 'text-orange-400', rankIcon: '🥉' }
                        ]
                        const color = rankColors[index] || rankColors[0]
                        
                        return (
                          <Link href={`/profile/${ranking.userId}`} key={ranking.userId}>
                            <div className={`flex items-center justify-between p-4 ${color.bg} rounded-lg border ${color.border} hover:bg-black/40 transition-all cursor-pointer group`}>
                              <div className="flex items-center space-x-3">
                                <div className={`w-10 h-10 ${color.bg} rounded-full flex items-center justify-center border ${color.border}`}>
                                  <span className="text-lg">{color.rankIcon}</span>
                                </div>
                                <div>
                                  <p className="text-white font-mono font-bold">{ranking.name}</p>
                                  <p className="text-gray-400 font-mono text-xs">{ranking.level}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className={`${color.text} font-mono font-bold text-lg`}>{ranking.drillPoints} DP</p>
                                <p className="text-gray-400 font-mono text-xs">{ranking.totalInterviews} interviews</p>
                                {ranking.averageRating > 0 && (
                                  <div className="flex items-center justify-end space-x-1 mt-1">
                                    <Star className="w-3 h-3 text-yellow-400" />
                                    <span className="text-yellow-400 font-mono text-xs">
                                      {ranking.averageRating}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </Link>
                        )
                      })}

                      {/* Your Position - only show if not in top 3 */}
                      {userRank && userRank.rank > 3 && (
                        <div className="mt-4 pt-4 border-t border-gray-700">
                          <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                                <span className="text-green-400 font-bold text-sm">#{userRank.rank}</span>
                              </div>
                              <div>
                                <p className="text-white font-mono text-sm">Your Position</p>
                                <p className="text-gray-400 font-mono text-xs">{userRank.level}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-green-400 font-mono text-sm font-bold">{userRank.drillPoints} DP</p>
                              <p className="text-gray-400 font-mono text-xs">{userRank.totalInterviews} interviews</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Trophy className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400 font-mono">No rankings available</p>
                      <p className="text-gray-500 font-mono text-sm">Complete interviews to see rankings</p>
                    </div>
                  )}
                </CardContent>
              </Card>

                            {/* Performance Insights */}
            <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white font-mono flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-purple-400" />
                    Performance Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                      <div className="text-2xl font-bold text-purple-400">{user.averageScore || 0}</div>
                      <div className="text-xs text-gray-400 font-mono">Avg Score</div>
                    </div>
                    <div className="text-center p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                      <div className="text-2xl font-bold text-purple-400">{user.bestDomain || 'N/A'}</div>
                      <div className="text-xs text-gray-400 font-mono">Best Domain</div>
                    </div>
                    <div className="text-center p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                      <div className="text-2xl font-bold text-purple-400">{user.currentStreak || 0}</div>
                      <div className="text-xs text-gray-400 font-mono">Day Streak</div>
                    </div>
                    <div className="text-center p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                      <div className="text-2xl font-bold text-purple-400">{user.level}</div>
                      <div className="text-xs text-gray-400 font-mono">Level</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-black/40 border-green-500/20 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white font-mono flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-green-400" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Link href="/dashboard/interview-select">
                      <Button variant="outline" className="w-full bg-black/20 border-green-600 text-green-400 hover:text-white">
                        <Users className="w-4 h-4 mr-2" />
                        Give Interview
                      </Button>
                    </Link>
                    <Link href="/dashboard/interview-select">
                      <Button variant="outline" className="w-full bg-black/20 border-blue-600 text-blue-400 hover:text-white">
                        <Target className="w-4 h-4 mr-2" />
                        Take Interview
                      </Button>
                    </Link>
                    <Link href="/dashboard/settings">
                      <Button variant="outline" className="w-full bg-black/20 border-yellow-600 text-yellow-400 hover:text-white">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Button>
                    </Link>
                    <Link href="/dashboard/rankings">
                      <Button variant="outline" className="w-full bg-black/20 border-purple-600 text-purple-400 hover:text-white">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Rankings
                      </Button>
                    </Link>
                    <Link href="/dashboard/feedback">
                      <Button variant="outline" className="w-full bg-black/20 border-indigo-600 text-indigo-400 hover:text-white">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Feedback
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="w-full bg-black/20 border-red-600 text-red-400 hover:text-white"
                      onClick={logout}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Insights */}
              <Card className="bg-black/40 border-indigo-500/20 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white font-mono flex items-center">
                    <Target className="w-5 h-5 mr-2 text-indigo-400" />
                    Performance Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 font-mono text-sm">Average Score</span>
                      <span className="text-white font-mono font-bold">{stats.avgScore}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 font-mono text-sm">Best Domain</span>
                      <span className="text-green-400 font-mono font-bold">Frontend</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 font-mono text-sm">Current Streak</span>
                      <span className="text-blue-400 font-mono font-bold">{user.streak} days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 font-mono text-sm">Level</span>
                      <span className="text-yellow-400 font-mono font-bold">{user.level}</span>
                  </div>
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
        {/* Schedule Interview Modal */}
        {schedulingRequest && (
          <Dialog open={!!schedulingRequest} onOpenChange={() => setSchedulingRequest(null)}>
            <DialogContent className="bg-black/90 border-gray-600 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-white font-mono">Schedule Interview</DialogTitle>
                <DialogDescription className="text-gray-400 font-mono">
                  Schedule interview for {schedulingRequest.userName} - {schedulingRequest.domain}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-300 font-mono text-sm mb-2 block">Interview Date *</label>
                    <Input
                      type="date"
                      value={scheduleForm.interviewDate}
                      onChange={(e) => setScheduleForm({...scheduleForm, interviewDate: e.target.value})}
                      className="bg-black/20 border-gray-600 text-white font-mono"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 font-mono text-sm mb-2 block">Interview Time *</label>
                    <Input
                      type="time"
                      value={scheduleForm.interviewTime}
                      onChange={(e) => setScheduleForm({...scheduleForm, interviewTime: e.target.value})}
                      className="bg-black/20 border-gray-600 text-white font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-gray-300 font-mono text-sm mb-2 block">Meeting Link</label>
                  <Input
                    type="url"
                    placeholder="https://meet.google.com/xxx-xxxx-xxx"
                    value={scheduleForm.meetingLink}
                    onChange={(e) => setScheduleForm({...scheduleForm, meetingLink: e.target.value})}
                    className="bg-black/20 border-gray-600 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-gray-300 font-mono text-sm mb-2 block">Admin Notes</label>
                  <Textarea
                    placeholder="Any additional notes for the candidate..."
                    value={scheduleForm.adminNotes}
                    onChange={(e) => setScheduleForm({...scheduleForm, adminNotes: e.target.value})}
                    className="bg-black/20 border-gray-600 text-white font-mono"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setSchedulingRequest(null)}
                    className="bg-gray-500/10 border-gray-500/30 text-gray-400 hover:bg-gray-500/20 font-mono"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleScheduleSubmit}
                    className="bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20 font-mono"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Interview
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
    </div>
    </ProtectedRoute>
  )
}
