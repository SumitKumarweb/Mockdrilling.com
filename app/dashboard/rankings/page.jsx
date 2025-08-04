"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Terminal,
  ArrowLeft,
  Trophy,
  Crown,
  Medal,
  TrendingUp,
  TrendingDown,
  Minus,
  Star,
  Target,
  Code,
  Database,
  Brain,
  Calendar,
} from "lucide-react"
import Link from "next/link"

export default function RankingsPage() {
  const [selectedMonth, setSelectedMonth] = useState("current")
  const [selectedDomain, setSelectedDomain] = useState("all")
  const [rankings, setRankings] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRankings = async () => {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock rankings data
      const mockRankings = [
        {
          rank: 1,
          name: "Priya Sharma",
          avatar: "/placeholder.svg?height=40&width=40&text=PS",
          company: "Microsoft",
          score: 98.5,
          interviewsGiven: 45,
          interviewsTaken: 12,
          drillPoints: 4200,
          change: 2,
          domain: "Frontend",
        },
        {
          rank: 2,
          name: "Rahul Kumar",
          avatar: "/placeholder.svg?height=40&width=40&text=RK",
          company: "Google",
          score: 97.2,
          interviewsGiven: 38,
          interviewsTaken: 15,
          drillPoints: 3850,
          change: -1,
          domain: "Backend",
        },
        {
          rank: 3,
          name: "Anita Desai",
          avatar: "/placeholder.svg?height=40&width=40&text=AD",
          company: "Amazon",
          score: 96.8,
          interviewsGiven: 42,
          interviewsTaken: 8,
          drillPoints: 3650,
          change: 1,
          domain: "DSA",
        },
        {
          rank: 4,
          name: "Vikram Singh",
          avatar: "/placeholder.svg?height=40&width=40&text=VS",
          company: "Netflix",
          score: 95.9,
          interviewsGiven: 35,
          interviewsTaken: 18,
          drillPoints: 3420,
          change: 0,
          domain: "Frontend",
        },
        {
          rank: 5,
          name: "Sneha Patel",
          avatar: "/placeholder.svg?height=40&width=40&text=SP",
          company: "Uber",
          score: 95.1,
          interviewsGiven: 40,
          interviewsTaken: 10,
          drillPoints: 3200,
          change: 3,
          domain: "Backend",
        },
      ]

      // Add more mock data to reach 50 users
      for (let i = 6; i <= 50; i++) {
        mockRankings.push({
          rank: i,
          name: `User ${i}`,
          avatar: `/placeholder.svg?height=40&width=40&text=U${i}`,
          company: ["TCS", "Infosys", "Wipro", "Accenture", "IBM"][Math.floor(Math.random() * 5)],
          score: Math.round((95 - i * 0.5) * 10) / 10,
          interviewsGiven: Math.floor(Math.random() * 30) + 10,
          interviewsTaken: Math.floor(Math.random() * 20) + 5,
          drillPoints: Math.floor(3200 - i * 50),
          change: Math.floor(Math.random() * 7) - 3,
          domain: ["Frontend", "Backend", "DSA"][Math.floor(Math.random() * 3)],
        })
      }

      setRankings(mockRankings)

      // Mock current user data
      setCurrentUser({
        rank: 23,
        name: "Alex Developer",
        avatar: "/placeholder.svg?height=40&width=40&text=AD",
        company: "Tech Corp",
        score: 87.5,
        interviewsGiven: 18,
        interviewsTaken: 12,
        drillPoints: 1250,
        change: 5,
        domain: "Frontend",
      })

      setLoading(false)
    }

    fetchRankings()
  }, [selectedMonth, selectedDomain])

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-400" />
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-300" />
    if (rank === 3) return <Medal className="w-5 h-5 text-orange-400" />
    return <span className="text-gray-400 font-mono font-bold">#{rank}</span>
  }

  const getChangeIcon = (change) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-400" />
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-400" />
    return <Minus className="w-4 h-4 text-gray-400" />
  }

  const getDomainIcon = (domain) => {
    switch (domain) {
      case "Frontend":
        return <Code className="w-4 h-4 text-blue-400" />
      case "Backend":
        return <Database className="w-4 h-4 text-green-400" />
      case "DSA":
        return <Brain className="w-4 h-4 text-purple-400" />
      default:
        return <Target className="w-4 h-4 text-gray-400" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 font-mono">Loading rankings...</p>
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
                Rankings
              </Badge>
            </div>

            <div className="flex items-center space-x-4">
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-40 bg-black/20 border-gray-600 text-white font-mono">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black border-gray-600">
                  <SelectItem value="current">This Month</SelectItem>
                  <SelectItem value="last">Last Month</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                <SelectTrigger className="w-32 bg-black/20 border-gray-600 text-white font-mono">
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
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white font-mono mb-2">Monthly Rankings</h1>
          <p className="text-gray-400 font-mono">Top performers based on interview scores and activity</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Rankings List */}
          <div className="lg:col-span-3">
            <Card className="bg-black/40 border-green-500/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white font-mono flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                  Leaderboard
                </CardTitle>
                <CardDescription className="text-gray-400 font-mono">Top 50 performers this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {rankings.slice(0, 50).map((user) => (
                    <div
                      key={user.rank}
                      className={`flex items-center justify-between p-4 rounded-lg border transition-all hover:bg-black/20 ${
                        user.rank <= 3
                          ? "bg-gradient-to-r from-yellow-500/5 to-orange-500/5 border-yellow-500/20"
                          : "bg-black/20 border-gray-600/30"
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-8">{getRankIcon(user.rank)}</div>

                        <Avatar className="w-10 h-10">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback className="bg-gray-600 text-white font-mono">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>

                        <div>
                          <Link href={`/profile/${user.rank}`}>
                            <p className="text-white font-mono font-bold hover:text-green-400 transition-colors cursor-pointer">
                              {user.name}
                            </p>
                          </Link>
                          <p className="text-gray-400 font-mono text-sm">{user.company}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-white font-mono font-bold">{user.score}%</p>
                          <p className="text-gray-400 font-mono text-xs">Score</p>
                        </div>

                        <div className="text-center">
                          <p className="text-green-400 font-mono font-bold">{user.interviewsGiven}</p>
                          <p className="text-gray-400 font-mono text-xs">Given</p>
                        </div>

                        <div className="text-center">
                          <p className="text-blue-400 font-mono font-bold">{user.interviewsTaken}</p>
                          <p className="text-gray-400 font-mono text-xs">Taken</p>
                        </div>

                        <div className="text-center">
                          <p className="text-yellow-400 font-mono font-bold">{user.drillPoints}</p>
                          <p className="text-gray-400 font-mono text-xs">Points</p>
                        </div>

                        <div className="flex items-center space-x-1">
                          {getChangeIcon(user.change)}
                          <span
                            className={`font-mono text-sm ${
                              user.change > 0 ? "text-green-400" : user.change < 0 ? "text-red-400" : "text-gray-400"
                            }`}
                          >
                            {user.change !== 0 && (user.change > 0 ? "+" : "")}
                            {user.change}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Your Rank */}
            {currentUser && (
              <Card className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border-green-500/30 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white font-mono flex items-center">
                    <Star className="w-5 h-5 mr-2 text-green-400" />
                    Your Rank
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <p className="text-4xl font-bold text-green-400 font-mono">#{currentUser.rank}</p>
                    <p className="text-gray-400 font-mono text-sm">Current Position</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-mono text-sm">Score:</span>
                      <span className="text-white font-mono text-sm">{currentUser.score}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-mono text-sm">Given:</span>
                      <span className="text-green-400 font-mono text-sm">{currentUser.interviewsGiven}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-mono text-sm">Taken:</span>
                      <span className="text-blue-400 font-mono text-sm">{currentUser.interviewsTaken}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-mono text-sm">Points:</span>
                      <span className="text-yellow-400 font-mono text-sm">{currentUser.drillPoints}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center mt-4 space-x-2">
                    {getChangeIcon(currentUser.change)}
                    <span
                      className={`font-mono text-sm ${
                        currentUser.change > 0
                          ? "text-green-400"
                          : currentUser.change < 0
                            ? "text-red-400"
                            : "text-gray-400"
                      }`}
                    >
                      {currentUser.change > 0 ? "+" : ""}
                      {currentUser.change} from last month
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Top Domains */}
            <Card className="bg-black/40 border-gray-500/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white font-mono">Top Domains</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Code className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-300 font-mono text-sm">Frontend</span>
                  </div>
                  <span className="text-blue-400 font-mono text-sm">1,245 interviews</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Database className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300 font-mono text-sm">Backend</span>
                  </div>
                  <span className="text-green-400 font-mono text-sm">987 interviews</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Brain className="w-4 h-4 text-purple-400" />
                    <span className="text-gray-300 font-mono text-sm">DSA</span>
                  </div>
                  <span className="text-purple-400 font-mono text-sm">756 interviews</span>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Stats */}
            <Card className="bg-black/40 border-gray-500/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white font-mono flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-orange-400" />
                  This Month
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 font-mono text-sm">Total Interviews:</span>
                  <span className="text-white font-mono text-sm">2,988</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400 font-mono text-sm">Active Users:</span>
                  <span className="text-green-400 font-mono text-sm">1,456</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400 font-mono text-sm">Avg Score:</span>
                  <span className="text-blue-400 font-mono text-sm">84.2%</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400 font-mono text-sm">Top Score:</span>
                  <span className="text-yellow-400 font-mono text-sm">98.5%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
