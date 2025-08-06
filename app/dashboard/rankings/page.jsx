"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Trophy,
  Medal,
  Award,
  Star,
  Search,
  Filter,
  ArrowUp,
  ArrowDown,
  Users,
  Target,
  TrendingUp,
  Calendar,
  Clock,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import ProtectedRoute from "@/components/protected-route"
import { useAuth } from "@/hooks/useAuth"

export default function RankingsPage() {
  const { user: authUser, userProfile } = useAuth()
  const [rankings, setRankings] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("drillPoints") // drillPoints, interviews, level
  const [sortOrder, setSortOrder] = useState("desc") // asc, desc
  const [userRank, setUserRank] = useState(null)
  const [stats, setStats] = useState({
    totalUsers: 0,
    averageDrillPoints: 0,
    topDrillPoints: 0,
  })

  // Fetch rankings data
  useEffect(() => {
    const fetchRankings = async () => {
      if (authUser?.uid) {
        try {
      setLoading(true)
          const response = await fetch(`/api/rankings?userId=${authUser.uid}&limit=100`)
          const data = await response.json()
          
          if (data.success) {
            setRankings(data.rankings)
            setUserRank(data.userRank)
            
            // Calculate stats
            const totalUsers = data.rankings.length
            const totalDrillPoints = data.rankings.reduce((sum, user) => sum + user.drillPoints, 0)
            const averageDrillPoints = totalUsers > 0 ? Math.round(totalDrillPoints / totalUsers) : 0
            const topDrillPoints = data.rankings.length > 0 ? data.rankings[0].drillPoints : 0
            
            setStats({
              totalUsers,
              averageDrillPoints,
              topDrillPoints,
            })
          }
        } catch (error) {
          console.error('Error fetching rankings:', error)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchRankings()
  }, [authUser?.uid])

  // Filter and sort rankings
  const filteredAndSortedRankings = rankings
    .filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aValue, bValue
      
      switch (sortBy) {
        case "drillPoints":
          aValue = a.drillPoints
          bValue = b.drillPoints
          break
        case "interviews":
          aValue = a.totalInterviews
          bValue = b.totalInterviews
          break
        case "level":
          const levelOrder = { "Legend": 6, "Master": 5, "Expert": 4, "Advanced": 3, "Intermediate": 2, "Novice": 1, "Beginner": 0 }
          aValue = levelOrder[a.level] || 0
          bValue = levelOrder[b.level] || 0
          break
        default:
          aValue = a.drillPoints
          bValue = b.drillPoints
      }
      
      if (sortOrder === "asc") {
        return aValue - bValue
      } else {
        return bValue - aValue
      }
    })

  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-400" />
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />
    if (rank === 3) return <Award className="w-6 h-6 text-orange-400" />
    return <Star className="w-5 h-5 text-gray-500" />
  }

  const getRankColor = (rank) => {
    if (rank === 1) return "bg-yellow-500/10 border-yellow-500/20"
    if (rank === 2) return "bg-gray-500/10 border-gray-500/20"
    if (rank === 3) return "bg-orange-500/10 border-orange-500/20"
    return "bg-black/20 border-gray-600/20"
  }

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      {/* Header */}
      <header className="border-b border-green-500/20 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-black" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent font-mono">
                    Leaderboard
                  </span>
                </div>
                <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 font-mono">
                Rankings
              </Badge>
            </div>

            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-black/60 rounded-lg px-3 py-2 border border-green-500/30">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <span className="text-green-400 font-mono font-bold">{userRank?.rank || 'N/A'}</span>
                  <span className="text-gray-400 text-sm font-mono">Rank</span>
                </div>
              </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-black/40 border-yellow-500/20 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                        <div>
                    <p className="text-gray-400 font-mono text-sm">Total Users</p>
                    <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
                        </div>
                  <Users className="w-8 h-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-yellow-500/20 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 font-mono text-sm">Average Drill Points</p>
                    <p className="text-2xl font-bold text-white">{stats.averageDrillPoints}</p>
                  </div>
                  <Target className="w-8 h-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-yellow-500/20 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 font-mono text-sm">Top Drill Points</p>
                    <p className="text-2xl font-bold text-white">{stats.topDrillPoints}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <Card className="bg-black/40 border-gray-600/20 backdrop-blur-xl mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search users by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-black/20 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-black/20 border border-gray-600 text-white rounded-md px-3 py-2 text-sm"
                  >
                    <option value="drillPoints">Sort by Drill Points</option>
                    <option value="interviews">Sort by Interviews</option>
                    <option value="level">Sort by Level</option>
                  </select>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                    className="bg-black/20 border-gray-600 text-gray-400 hover:text-white"
                  >
                    {sortOrder === "desc" ? <ArrowDown className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rankings List */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Card key={i} className="bg-black/40 border-gray-600/20 backdrop-blur-xl animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-600/20 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-600/20 rounded w-32 mb-2"></div>
                        <div className="h-3 bg-gray-600/20 rounded w-24"></div>
                      </div>
                      <div className="h-4 bg-gray-600/20 rounded w-20"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAndSortedRankings.map((user, index) => (
                <Link href={`/profile/${user.userId}`} key={user.userId}>
                  <Card 
                    className={`${getRankColor(user.rank)} backdrop-blur-xl hover:bg-black/60 transition-colors cursor-pointer ${
                      user.userId === authUser?.uid ? 'ring-2 ring-green-500/50' : ''
                    }`}
                  >
                  <CardContent className="p-6">
                <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-black/20 border border-gray-600/20">
                          {getRankIcon(user.rank)}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-bold text-white font-mono">
                              {user.name}
                              {user.userId === authUser?.uid && (
                                <Badge variant="secondary" className="ml-2 bg-green-500/20 text-green-400 border-green-500/30">
                                  You
                                </Badge>
                              )}
                            </h3>
                          </div>
                          <p className="text-gray-400 font-mono text-sm">{user.email}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <Badge variant="outline" className="bg-black/20 border-gray-600 text-gray-400">
                              {user.level}
                            </Badge>
                            <span className="text-gray-400 font-mono text-sm">
                              {user.totalInterviews} interviews
                            </span>
                            {user.averageRating > 0 && (
                              <div className="flex items-center space-x-1">
                                <Star className="w-3 h-3 text-yellow-400" />
                                <span className="text-yellow-400 font-mono text-xs">
                                  {user.averageRating}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                </div>

                      <div className="text-right">
                        <div className="text-2xl font-bold text-yellow-400 font-mono">
                          {user.drillPoints} DP
                        </div>
                        <div className="text-gray-400 font-mono text-sm">
                          Rank #{user.rank}
                        </div>
                      </div>
                </div>
              </CardContent>
            </Card>
                </Link>
              ))}
              
              {filteredAndSortedRankings.length === 0 && (
                <Card className="bg-black/40 border-gray-600/20 backdrop-blur-xl">
                  <CardContent className="p-8 text-center">
                    <Trophy className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2">No users found</h3>
                    <p className="text-gray-400 font-mono">
                      {searchTerm ? 'Try adjusting your search terms' : 'No users available yet'}
                    </p>
                  </CardContent>
                </Card>
              )}
          </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
