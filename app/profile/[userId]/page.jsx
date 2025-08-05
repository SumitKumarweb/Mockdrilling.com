"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  User,
  Trophy,
  Target,
  Calendar,
  Clock,
  Award,
  Star,
  TrendingUp,
  BarChart3,
  History,
  ArrowLeft,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  Zap,
  Coins,
  MessageSquare,
  Users,
  Activity,
  Crown,
  Medal,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

export default function UserProfilePage() {
  const params = useParams()
  const userId = params.userId
  const { user: authUser } = useAuth()
  
  const [userProfile, setUserProfile] = useState(null)
  const [recentActivities, setRecentActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [activitiesLoading, setActivitiesLoading] = useState(true)
  const [userRank, setUserRank] = useState(null)
  const [achievements, setAchievements] = useState([])

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) return
      
      try {
        setLoading(true)
        const response = await fetch(`/api/profile/${userId}`)
        const data = await response.json()
        
        if (data.success) {
          setUserProfile(data.user)
          // Calculate achievements based on user data
          calculateAchievements(data.user)
        } else {
          console.error('Failed to fetch user profile:', data.error)
        }
      } catch (error) {
        console.error('Error fetching user profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [userId])

  // Fetch user's recent activities
  useEffect(() => {
    const fetchUserActivities = async () => {
      if (!userId) return
      
      try {
        setActivitiesLoading(true)
        const response = await fetch(`/api/interview/activity?userId=${userId}&limit=10`)
        const data = await response.json()
        
        if (data.success) {
          setRecentActivities(data.activities)
        } else {
          console.error('Failed to fetch activities:', data.error)
        }
      } catch (error) {
        console.error('Error fetching activities:', error)
      } finally {
        setActivitiesLoading(false)
      }
    }

    fetchUserActivities()
  }, [userId])

  // Fetch user's rank
  useEffect(() => {
    const fetchUserRank = async () => {
      if (!userId) return
      
      try {
        const response = await fetch(`/api/rankings?userId=${userId}`)
        const data = await response.json()
        
        if (data.success && data.userRank) {
          setUserRank(data.userRank)
        }
      } catch (error) {
        console.error('Error fetching user rank:', error)
      }
    }

    fetchUserRank()
  }, [userId])

  const calculateAchievements = (user) => {
    const achievements = []
    
    // Drill Points achievements
    if (user.drillPoints >= 1000) achievements.push({ name: "Drill Master", icon: "🏆", description: "Reached 1000+ drill points" })
    if (user.drillPoints >= 500) achievements.push({ name: "Drill Expert", icon: "🥇", description: "Reached 500+ drill points" })
    if (user.drillPoints >= 100) achievements.push({ name: "Drill Novice", icon: "🥉", description: "Reached 100+ drill points" })
    
    // Interview achievements
    if (user.interviewsTaken >= 10) achievements.push({ name: "Interview Veteran", icon: "🎯", description: "Taken 10+ interviews" })
    if (user.interviewsTaken >= 5) achievements.push({ name: "Interview Enthusiast", icon: "📚", description: "Taken 5+ interviews" })
    if (user.interviewsGiven >= 10) achievements.push({ name: "Mentor", icon: "👨‍🏫", description: "Given 10+ interviews" })
    if (user.interviewsGiven >= 5) achievements.push({ name: "Helper", icon: "🤝", description: "Given 5+ interviews" })
    
    // Combined achievements
    if (user.interviewsTaken + user.interviewsGiven >= 20) achievements.push({ name: "Community Pillar", icon: "🏛️", description: "Total 20+ interviews" })
    if (user.interviewsTaken + user.interviewsGiven >= 10) achievements.push({ name: "Active Member", icon: "⭐", description: "Total 10+ interviews" })
    
    setAchievements(achievements)
  }

  const getLevel = (drillPoints) => {
    if (drillPoints >= 1000) return { level: "Master", color: "text-purple-400", bg: "bg-purple-500/20" }
    if (drillPoints >= 500) return { level: "Expert", color: "text-blue-400", bg: "bg-blue-500/20" }
    if (drillPoints >= 200) return { level: "Advanced", color: "text-green-400", bg: "bg-green-500/20" }
    if (drillPoints >= 100) return { level: "Intermediate", color: "text-yellow-400", bg: "bg-yellow-500/20" }
    return { level: "Beginner", color: "text-gray-400", bg: "bg-gray-500/20" }
  }

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-48 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <div className="h-96 bg-gray-800 rounded-lg"></div>
              </div>
              <div className="lg:col-span-2">
                <div className="h-64 bg-gray-800 rounded-lg mb-6"></div>
                <div className="h-64 bg-gray-800 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
        <div className="max-w-6xl mx-auto">
          <Link href="/dashboard">
            <Button variant="outline" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <Card className="bg-black/40 border-red-500/20 backdrop-blur-xl">
            <CardContent className="p-8 text-center">
              <User className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">User Not Found</h2>
              <p className="text-gray-400">The user profile you're looking for doesn't exist.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const levelInfo = getLevel(userProfile.drillPoints || 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard">
            <Button variant="outline" className="bg-black/20 border-gray-600 text-gray-300 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          {userRank && (
            <Badge className={`${levelInfo.bg} ${levelInfo.color} border-0`}>
              <Trophy className="w-4 h-4 mr-1" />
              Rank #{userRank.rank}
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="bg-black/40 border-gray-500/20 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src={userProfile.photoURL} />
                    <AvatarFallback className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500">
                      {getInitials(userProfile.displayName)}
                    </AvatarFallback>
                  </Avatar>
                  <h1 className="text-2xl font-bold text-white mb-2">{userProfile.displayName || "Anonymous User"}</h1>
                  <p className="text-gray-400 mb-4">{userProfile.email}</p>
                  <Badge className={`${levelInfo.bg} ${levelInfo.color} border-0`}>
                    <Star className="w-4 h-4 mr-1" />
                    {levelInfo.level}
                  </Badge>
                </div>

                {/* Stats */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                    <div className="flex items-center">
                      <Coins className="w-5 h-5 text-yellow-400 mr-2" />
                      <span className="text-gray-300">Drill Points</span>
                    </div>
                    <span className="text-yellow-400 font-bold">{userProfile.drillPoints || 0}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                    <div className="flex items-center">
                      <Target className="w-5 h-5 text-blue-400 mr-2" />
                      <span className="text-gray-300">Interviews Taken</span>
                    </div>
                    <span className="text-blue-400 font-bold">{userProfile.interviewsTaken || 0}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                    <div className="flex items-center">
                      <Users className="w-5 h-5 text-green-400 mr-2" />
                      <span className="text-gray-300">Interviews Given</span>
                    </div>
                    <span className="text-green-400 font-bold">{userProfile.interviewsGiven || 0}</span>
                  </div>
                  
                  {/* Feedback Stats */}
                  {userProfile.feedbackStats && (
                    <>
                      <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                        <div className="flex items-center">
                          <Star className="w-5 h-5 text-yellow-400 mr-2" />
                          <span className="text-gray-300">Avg Rating</span>
                        </div>
                        <span className="text-yellow-400 font-bold">
                          {userProfile.feedbackStats.averageRating?.toFixed(1) || 'N/A'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                        <div className="flex items-center">
                          <Target className="w-5 h-5 text-blue-400 mr-2" />
                          <span className="text-gray-300">Total Feedback</span>
                        </div>
                        <span className="text-blue-400 font-bold">{userProfile.feedbackStats.totalFeedback || 0}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Level Progress */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 text-sm">Level Progress</span>
                    <span className="text-gray-400 text-sm">{userProfile.drillPoints || 0} / 1000</span>
                  </div>
                  <Progress value={(userProfile.drillPoints || 0) / 10} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Achievements */}
            <Card className="bg-black/40 border-yellow-500/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white font-mono flex items-center">
                  <Award className="w-5 h-5 mr-2 text-yellow-400" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                {achievements.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center p-3 bg-black/20 rounded-lg border border-yellow-500/20">
                        <span className="text-2xl mr-3">{achievement.icon}</span>
                        <div>
                          <p className="text-white font-semibold">{achievement.name}</p>
                          <p className="text-gray-400 text-sm">{achievement.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Award className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">No achievements yet. Keep practicing to earn badges!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-black/40 border-blue-500/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white font-mono flex items-center">
                  <History className="w-5 h-5 mr-2 text-blue-400" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activitiesLoading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : recentActivities.length > 0 ? (
                  <div className="space-y-3">
                    {recentActivities.map((activity, index) => (
                      <div key={activity.id || index} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-3 ${
                            activity.type === 'take' ? 'bg-red-400' : 'bg-green-400'
                          }`}></div>
                          <div>
                            <p className="text-white font-mono text-sm">
                              {activity.type === 'take' ? 'Took' : 'Gave'} interview in {activity.domain}
                            </p>
                            <p className="text-gray-400 text-xs">{activity.formattedDate}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {activity.type === 'take' ? '-120' : '+100'} DP
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">No recent activity</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
