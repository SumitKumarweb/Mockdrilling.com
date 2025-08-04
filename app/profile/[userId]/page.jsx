"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Terminal,
  ArrowLeft,
  MapPin,
  Building,
  Calendar,
  Star,
  Trophy,
  Target,
  MessageSquare,
  UserPlus,
  Github,
  Linkedin,
  Globe,
  Mail,
  Phone,
  Award,
  TrendingUp,
  Code,
  Database,
  Brain,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function PublicProfilePage() {
  const params = useParams()
  const userId = params.userId

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to fetch user profile
    const fetchProfile = async () => {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock profile data
      setProfile({
        id: userId,
        name: "Sarah Chen",
        email: "sarah.chen@example.com",
        phone: "+91 9876543210",
        location: "Mumbai, India",
        company: "Google",
        position: "Senior Software Engineer",
        experience: "6",
        bio: "Passionate full-stack developer with 6+ years of experience building scalable web applications. Love mentoring junior developers and contributing to open source projects. Expertise in React, Node.js, Python, and cloud technologies.",
        profilePhoto: "/placeholder.svg?height=150&width=150&text=SC",
        skills: ["React", "Node.js", "Python", "AWS", "Docker", "Kubernetes", "GraphQL"],
        github: "https://github.com/sarahchen",
        linkedin: "https://linkedin.com/in/sarahchen",
        website: "https://sarahchen.dev",
        joinedDate: "March 2023",
        stats: {
          totalInterviews: 45,
          interviewsGiven: 28,
          interviewsTaken: 17,
          successRate: 89,
          avgScore: 92,
          currentRank: 12,
          drillPoints: 2850,
        },
        recentActivity: [
          { type: "given", domain: "Frontend", rating: 4.9, date: "2 days ago" },
          { type: "taken", domain: "System Design", score: 95, date: "1 week ago" },
          { type: "given", domain: "Backend", rating: 4.8, date: "2 weeks ago" },
        ],
        achievements: [
          { name: "Top Interviewer", description: "Rated 4.8+ stars consistently", icon: Star, color: "yellow" },
          { name: "High Performer", description: "90%+ success rate", icon: Trophy, color: "gold" },
          { name: "Mentor", description: "Helped 50+ candidates", icon: Award, color: "blue" },
          { name: "Consistent", description: "30-day streak", icon: TrendingUp, color: "green" },
        ],
        privacy: {
          showEmail: true,
          showPhone: false,
        },
      })
      setLoading(false)
    }

    fetchProfile()
  }, [userId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 font-mono">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white font-mono mb-2">Profile Not Found</h1>
          <p className="text-gray-400 font-mono mb-4">The user profile you're looking for doesn't exist.</p>
          <Link href="/dashboard">
            <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-black font-mono font-bold">
              Back to Dashboard
            </Button>
          </Link>
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
                Public Profile
              </Badge>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                className="bg-black/20 border-blue-500/30 text-blue-400 hover:bg-blue-500/10 font-mono"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Message
              </Button>
              <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-black font-mono font-bold">
                <UserPlus className="w-4 h-4 mr-2" />
                Connect
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <Card className="bg-black/40 border-green-500/20 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-start space-x-6">
                  <img
                    src={profile.profilePhoto || "/placeholder.svg"}
                    alt={profile.name}
                    className="w-24 h-24 rounded-full object-cover border-2 border-green-500/30"
                  />
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-white font-mono mb-2">{profile.name}</h1>
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center text-gray-400 font-mono text-sm">
                        <Building className="w-4 h-4 mr-1" />
                        {profile.position} at {profile.company}
                      </div>
                      <div className="flex items-center text-gray-400 font-mono text-sm">
                        <MapPin className="w-4 h-4 mr-1" />
                        {profile.location}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 mb-4">
                      <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30 font-mono">
                        {profile.experience} years experience
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="bg-purple-500/20 text-purple-400 border-purple-500/30 font-mono"
                      >
                        Rank #{profile.stats.currentRank}
                      </Badge>
                      <div className="flex items-center text-gray-400 font-mono text-sm">
                        <Calendar className="w-4 h-4 mr-1" />
                        Joined {profile.joinedDate}
                      </div>
                    </div>
                    <p className="text-gray-300 font-mono text-sm leading-relaxed">{profile.bio}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="bg-black/40 border-gray-500/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white font-mono flex items-center">
                  <Code className="w-5 h-5 mr-2 text-green-400" />
                  Skills & Expertise
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-green-500/20 text-green-400 border-green-500/30 font-mono"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-black/40 border-gray-500/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white font-mono flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-gray-400" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profile.recentActivity.map((activity, index) => (
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
                            <Target className="w-4 h-4 text-blue-400" />
                          ) : (
                            <Star className="w-4 h-4 text-green-400" />
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
                        {activity.score && <p className="text-blue-400 font-mono text-sm">Score: {activity.score}%</p>}
                        {activity.rating && (
                          <p className="text-green-400 font-mono text-sm">Rating: {activity.rating}★</p>
                        )}
                      </div>
                    </div>
                  ))}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.achievements.map((achievement, index) => {
                    const IconComponent = achievement.icon
                    return (
                      <div
                        key={index}
                        className={`p-4 bg-${achievement.color}-500/10 border border-${achievement.color}-500/30 rounded-lg`}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-10 h-10 bg-${achievement.color}-500/20 rounded-full flex items-center justify-center`}
                          >
                            <IconComponent className={`w-5 h-5 text-${achievement.color}-400`} />
                          </div>
                          <div>
                            <p className="text-white font-mono font-bold text-sm">{achievement.name}</p>
                            <p className="text-gray-400 font-mono text-xs">{achievement.description}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <Card className="bg-black/40 border-green-500/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white font-mono flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-green-400" />
                  Performance Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-400 font-mono">{profile.stats.successRate}%</p>
                  <p className="text-gray-400 text-sm font-mono">Success Rate</p>
                </div>

                <Separator className="bg-gray-600" />

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-mono text-sm">Total Interviews:</span>
                    <span className="text-white font-mono text-sm">{profile.stats.totalInterviews}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-mono text-sm">Interviews Given:</span>
                    <span className="text-green-400 font-mono text-sm">{profile.stats.interviewsGiven}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-mono text-sm">Interviews Taken:</span>
                    <span className="text-blue-400 font-mono text-sm">{profile.stats.interviewsTaken}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-mono text-sm">Avg Score:</span>
                    <span className="text-purple-400 font-mono text-sm">{profile.stats.avgScore}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-mono text-sm">Current Rank:</span>
                    <span className="text-yellow-400 font-mono text-sm">#{profile.stats.currentRank}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="bg-black/40 border-blue-500/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white font-mono">Contact & Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.privacy.showEmail && (
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <a href={`mailto:${profile.email}`} className="text-blue-400 font-mono text-sm hover:underline">
                      {profile.email}
                    </a>
                  </div>
                )}

                {profile.privacy.showPhone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300 font-mono text-sm">{profile.phone}</span>
                  </div>
                )}

                <Separator className="bg-gray-600" />

                <div className="space-y-3">
                  {profile.github && (
                    <a
                      href={profile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      <span className="font-mono text-sm">GitHub</span>
                    </a>
                  )}

                  {profile.linkedin && (
                    <a
                      href={profile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors"
                    >
                      <Linkedin className="w-4 h-4" />
                      <span className="font-mono text-sm">LinkedIn</span>
                    </a>
                  )}

                  {profile.website && (
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                      <span className="font-mono text-sm">Website</span>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Domain Expertise */}
            <Card className="bg-black/40 border-gray-500/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white font-mono">Domain Expertise</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400 font-mono text-sm flex items-center">
                      <Code className="w-4 h-4 mr-1" />
                      Frontend
                    </span>
                    <span className="text-green-400 font-mono text-sm">95%</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400 font-mono text-sm flex items-center">
                      <Database className="w-4 h-4 mr-1" />
                      Backend
                    </span>
                    <span className="text-blue-400 font-mono text-sm">88%</span>
                  </div>
                  <Progress value={88} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400 font-mono text-sm flex items-center">
                      <Brain className="w-4 h-4 mr-1" />
                      DSA
                    </span>
                    <span className="text-purple-400 font-mono text-sm">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
