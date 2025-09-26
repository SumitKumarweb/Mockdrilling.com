"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { collection, getCountFromServer, getDocs, orderBy, limit, query, doc, updateDoc, deleteDoc, where } from "firebase/firestore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Shield,
  Users,
  BarChart3,
  Settings,
  Database,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  RefreshCw,
  LogOut,
  Home,
  Edit,
  Trash2,
  Calendar, // Add this line
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { ADMIN_CONFIG } from "@/lib/admin"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function AdminPage() {
  const { signOut } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")

  // Inline admin login state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState("")
  const [adminAuthenticated, setAdminAuthenticated] = useState(false)

  useEffect(() => {
    try {
      const persisted = typeof window !== 'undefined' ? window.sessionStorage.getItem('nimdaAdmin') : null
      if (persisted === 'true') {
        setAdminAuthenticated(true)
      }
    } catch {}
  }, [])

  const [adminStats, setAdminStats] = useState({
    totalUsers: 0,
    totalInterviews: 0,
    totalDrillPoints: 0,
    activeUsers: 0,
    systemHealth: "Checking...",
    lastBackup: "Unknown"
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [loadingStats, setLoadingStats] = useState(true)
  const [statsError, setStatsError] = useState("")

  // User Management state
  const [users, setUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [usersError, setUsersError] = useState("")
  const [editingUser, setEditingUser] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")

  // Interview Requests state
  const [requests, setRequests] = useState([])
  const [loadingRequests, setLoadingRequests] = useState(false)
  const [requestsError, setRequestsError] = useState("")
  const [requestStatusFilter, setRequestStatusFilter] = useState("all")
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [adminNotes, setAdminNotes] = useState("")

  // Add these state variables after the existing request state
  const [schedulingRequest, setSchedulingRequest] = useState(null)
  const [scheduleForm, setScheduleForm] = useState({
    interviewDate: '',
    interviewTime: '',
    meetingLink: '',
    adminNotes: '',
    assignedTo: '' // Add this
  })

  const loadAdminStats = async () => {
    setStatsError("")
    setLoadingStats(true)
    try {
      // Total users
      const usersCol = collection(db, 'users')
      const usersCountSnap = await getCountFromServer(usersCol)
      const totalUsers = usersCountSnap.data().count || 0

      // Recent activity (last updated users)
      const recentQuery = query(usersCol, orderBy('updatedAt', 'desc'), limit(5))
      const recentSnap = await getDocs(recentQuery)
      const recent = recentSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))

      // Sum interviews and drill points
      let totalDrillPoints = 0
      let totalInterviews = 0
      let activeUsers = 0
      const usersSnap = await getDocs(query(usersCol, limit(500)))
      usersSnap.forEach(d => {
        const u = d.data()
        totalDrillPoints += Number(u.drillPoints || 0)
        totalInterviews += Number(u.interviewsTaken || 0) + Number(u.interviewsGiven || 0)
        if (u.updatedAt) activeUsers += 1
      })

      setAdminStats({
        totalUsers,
        totalInterviews,
        totalDrillPoints,
        activeUsers,
        systemHealth: 'Healthy',
        lastBackup: 'N/A'
      })
      setRecentActivity(recent)
    } catch (e) {
      setStatsError(e.message || 'Failed to load stats')
    } finally {
      setLoadingStats(false)
    }
  }

  const loadUsers = async () => {
    setUsersError("")
    setLoadingUsers(true)
    try {
      console.log('Loading users from Firebase...')
      const usersCol = collection(db, 'users')
      
      // Try without orderBy first in case createdAt field doesn't exist
      let usersSnap
      try {
        usersSnap = await getDocs(query(usersCol, orderBy('createdAt', 'desc')))
      } catch (orderError) {
        console.log('OrderBy failed, trying without order:', orderError.message)
        usersSnap = await getDocs(usersCol)
      }
      
      const usersList = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      console.log('Loaded users:', usersList.length, usersList)
      setUsers(usersList)
    } catch (e) {
      console.error('Error loading users:', e)
      setUsersError(e.message || 'Failed to load users')
    } finally {
      setLoadingUsers(false)
    }
  }

  const handleEditUser = (user) => {
    setEditingUser(user)
    setEditForm({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      location: user.location || '',
      company: user.company || '',
      position: user.position || '',
      experience: user.experience || '0',
      bio: user.bio || '',
      skills: user.skills || [],
      role: user.role || 'student',
      drillPoints: user.drillPoints || 0,
      interviewsTaken: user.interviewsTaken || 0,
      interviewsGiven: user.interviewsGiven || 0,
    })
  }

  const handleUpdateUser = async () => {
    if (!editingUser) return
    
    try {
      const userRef = doc(db, 'users', editingUser.id)
      await updateDoc(userRef, {
        ...editForm,
        updatedAt: new Date().toISOString()
      })
      
      // Refresh users list
      await loadUsers()
      setEditingUser(null)
      setEditForm({})
    } catch (e) {
      console.error('Failed to update user:', e)
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return
    
    try {
      await deleteDoc(doc(db, 'users', userId))
      await loadUsers()
      await loadAdminStats() // Refresh stats
    } catch (e) {
      console.error('Failed to delete user:', e)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  const loadRequests = async () => {
    setRequestsError("")
    setLoadingRequests(true)
    try {
      const response = await fetch(`/api/interview-requests?status=${requestStatusFilter}`)
      const result = await response.json()
      if (result.success) {
        setRequests(result.requests)
      } else {
        setRequestsError(result.error || 'Failed to load requests')
      }
    } catch (e) {
      setRequestsError(e.message || 'Failed to load requests')
    } finally {
      setLoadingRequests(false)
    }
  }

  const handleRequestAction = async (requestId, action, notes = "") => {
    try {
      const response = await fetch(`/api/interview-requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: action,
          adminNotes: notes
        })
      })
      
      const result = await response.json()
      if (result.success) {
        await loadRequests()
        setSelectedRequest(null)
        setAdminNotes("")
      } else {
        console.error('Failed to update request:', result.error)
      }
    } catch (e) {
      console.error('Error updating request:', e)
    }
  }

  const handleScheduleInterview = async (request) => {
    setSchedulingRequest(request)
    setScheduleForm({
      interviewDate: '',
      interviewTime: '',
      meetingLink: '',
      adminNotes: '',
      assignedTo: ''
    })

    // Send notification to user that admin is scheduling their interview
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: request.userId,
          type: 'admin_scheduling',
          title: 'Admin is Scheduling Your Interview',
          message: `Admin is now scheduling your ${request.interviewType} interview for ${request.domain}. You'll receive the details soon.`,
          data: {
            requestId: request.id,
            interviewType: request.interviewType,
            domain: request.domain,
            adminAction: 'scheduling_started'
          }
        })
      })

      if (response.ok) {
        console.log('Scheduling notification sent successfully')
      } else {
        console.error('Failed to send scheduling notification')
      }
    } catch (error) {
      console.error('Error sending scheduling notification:', error)
    }
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
          adminNotes: scheduleForm.adminNotes,
          assignedTo: scheduleForm.assignedTo
        })
      })

      const result = await response.json()
      if (result.success) {
        setSchedulingRequest(null)
        await loadRequests() // Refresh the requests list
        alert('Interview scheduled successfully!')
      } else {
        alert(result.error || 'Failed to schedule interview')
      }
    } catch (error) {
      alert('Failed to schedule interview. Please try again.')
    }
  }

  const filteredRequests = requests.filter(request => {
    // Don't show "take" interview requests
    if (request.interviewType === 'take') return false
    
    // Apply status filter
    if (requestStatusFilter === 'all') return true
    return request.status === requestStatusFilter
  })

  useEffect(() => {
    loadAdminStats()
    loadUsers()
    loadRequests()
  }, [])

  useEffect(() => {
    loadRequests()
  }, [requestStatusFilter])


  const handleLogout = async () => {
    try {
      await signOut()
      router.push('/auth/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // If not authenticated for admin, show login form (hard-coded check, no Firebase)
  if (!adminAuthenticated) {
    const handleLogin = async (e) => {
      e.preventDefault()
      setAuthError("")
      setAuthLoading(true)
      try {
        if (email === ADMIN_CONFIG.ADMIN_EMAIL && password === ADMIN_CONFIG.ADMIN_PASSWORD) {
          setAdminAuthenticated(true)
          try { if (typeof window !== 'undefined') window.sessionStorage.setItem('nimdaAdmin', 'true') } catch {}
        } else {
          setAuthError("Invalid admin credentials")
        }
      } catch (err) {
        setAuthError(err.message || "Login failed")
      } finally {
        setAuthLoading(false)
      }
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-black/40 border-red-500/20 backdrop-blur-xl">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-red-400 to-orange-500 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent font-mono">
                NIMDA Login
              </span>
            </div>
            <CardDescription className="text-gray-400 font-mono">Admin access only</CardDescription>
          </CardHeader>
          <CardContent>
            {authError && (
              <Alert className="bg-red-500/10 border-red-500/30 text-red-400 mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="font-mono text-sm">{authError}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-gray-300 font-mono text-sm mb-2 block">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@mockdrilling.com"
                  className="bg-black/20 border-gray-600 text-white font-mono"
                  required
                />
              </div>
              <div>
                <label className="text-gray-300 font-mono text-sm mb-2 block">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Admin password"
                  className="bg-black/20 border-gray-600 text-white font-mono"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={authLoading}
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-black font-mono font-bold"
              >
                {authLoading ? (
                  <div className="flex items-center">
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  <>Sign in as Admin</>
                )}
              </Button>
            </form>
            <div className="text-center mt-4">
              <Link href="/" className="text-gray-400 hover:text-white font-mono text-sm">
                ← Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900">
        {/* Header */}
        <header className="border-b border-red-500/20 bg-black/40 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                  <Home className="w-5 h-5" />
                </Link>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-red-400 to-orange-500 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-black" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent font-mono">
                    NIMDA
                  </span>
                </div>
                <Badge variant="destructive" className="bg-red-500/20 text-red-400 border-red-500/30 font-mono">
                  Admin Panel
                </Badge>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-black/60 rounded-lg px-3 py-2 border border-red-500/30">
                  <Shield className="w-4 h-4 text-red-400" />
                  <span className="text-red-400 font-mono font-bold">ADMIN</span>
                </div>
                <Button
                  onClick={() => {
                    try { if (typeof window !== 'undefined') window.sessionStorage.removeItem('nimdaAdmin') } catch {}
                    setAdminAuthenticated(false)
                    handleLogout()
                  }}
                  variant="outline"
                  className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white font-mono mb-2">
              <span className="text-red-400">#</span> Admin Dashboard
            </h1>
            <p className="text-gray-400 font-mono">
              Welcome back, Admin • System Administration Panel
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-black/40 border-blue-500/20 backdrop-blur-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-white font-mono text-sm flex items-center">
                  <Users className="w-4 h-4 mr-2 text-blue-400" />
                  Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-400 font-mono">{adminStats.totalUsers.toLocaleString()}</div>
                <p className="text-gray-400 text-xs font-mono">+12 this week</p>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-green-500/20 backdrop-blur-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-white font-mono text-sm flex items-center">
                  <Activity className="w-4 h-4 mr-2 text-green-400" />
                  Interviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400 font-mono">{adminStats.totalInterviews.toLocaleString()}</div>
                <p className="text-gray-400 text-xs font-mono">+45 today</p>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-yellow-500/20 backdrop-blur-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-white font-mono text-sm flex items-center">
                  <Zap className="w-4 h-4 mr-2 text-yellow-400" />
                  Drill Points
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-400 font-mono">{adminStats.totalDrillPoints.toLocaleString()}</div>
                <p className="text-gray-400 text-xs font-mono">Total distributed</p>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-white font-mono text-sm flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2 text-purple-400" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-mono font-bold">{adminStats.systemHealth}</span>
                </div>
                <p className="text-gray-400 text-xs font-mono">Last backup: {adminStats.lastBackup}</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-black/20">
              <TabsTrigger value="overview" className="font-mono">Overview</TabsTrigger>
              <TabsTrigger value="requests" className="font-mono">Interview Requests</TabsTrigger>
              <TabsTrigger value="users" className="font-mono">User Management</TabsTrigger>
              <TabsTrigger value="settings" className="font-mono">Settings</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-black/40 border-green-500/20 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-white font-mono flex items-center">
                      <Activity className="w-5 h-5 mr-2 text-green-400" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {statsError && (
                      <Alert className="bg-red-500/10 border-red-500/30 text-red-400">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription className="font-mono text-sm">{statsError}</AlertDescription>
                      </Alert>
                    )}
                    {loadingStats && (
                      <div className="flex items-center space-x-3 p-2 bg-gray-500/10 rounded-lg">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300 font-mono text-sm">Loading activity...</span>
                      </div>
                    )}
                    {!loadingStats && recentActivity.map((u) => (
                      <div key={u.id} className="flex items-center space-x-3 p-2 bg-green-500/10 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-green-300 font-mono text-sm">{u.email || u.name || u.id} updated • {u.updatedAt || 'n/a'}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-black/40 border-orange-500/20 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-white font-mono flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2 text-orange-400" />
                      System Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Alert className="bg-yellow-500/10 border-yellow-500/30">
                      <Clock className="h-4 w-4" />
                      <AlertDescription className="font-mono text-sm">
                        Database backup scheduled in 2 hours
                      </AlertDescription>
                    </Alert>
                    <Alert className="bg-green-500/10 border-green-500/30">
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription className="font-mono text-sm">
                        All systems operational
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Interview Requests Tab */}
            <TabsContent value="requests" className="space-y-6">
              <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white font-mono flex items-center">
                        <Activity className="w-5 h-5 mr-2 text-purple-400" />
                        Interview Requests ({filteredRequests.length} requests)
                      </CardTitle>
                      <CardDescription className="text-gray-400 font-mono">
                        Review and approve interview requests
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Select value={requestStatusFilter} onValueChange={setRequestStatusFilter}>
                        <SelectTrigger className="w-40 bg-black/20 border-gray-600 text-white font-mono">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-black border-gray-600">
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                          <SelectItem value="assigned">Assigned</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        onClick={loadRequests}
                        disabled={loadingRequests}
                        size="sm"
                        variant="outline"
                        className="bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20 font-mono"
                      >
                        <RefreshCw className={`w-4 h-4 mr-2 ${loadingRequests ? 'animate-spin' : ''}`} />
                        Refresh
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {requestsError && (
                    <Alert className="bg-red-500/10 border-red-500/30 text-red-400">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="font-mono text-sm">{requestsError}</AlertDescription>
                    </Alert>
                  )}

                  {loadingRequests ? (
                    <div className="text-center py-8">
                      <RefreshCw className="w-8 h-8 text-gray-400 mx-auto mb-2 animate-spin" />
                      <p className="text-gray-400 font-mono">Loading requests...</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {filteredRequests.map((request) => (
                        <Card key={request.id} className="bg-black/20 border-gray-600/30">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <h3 className="text-white font-mono font-bold">{request.userName}</h3>
                                  <Badge variant="secondary" className={`font-mono text-xs ${
                                    request.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                                    request.status === 'approved' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                                    request.status === 'rejected' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                                    'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                  }`}>
                                    {request.status}
                                  </Badge>
                                  <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border-purple-500/30 font-mono text-xs">
                                    {request.interviewType === 'take' ? 'Take' : 'Give'} Interview
                                  </Badge>
                                  <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 border-orange-500/30 font-mono text-xs">
                                    {request.domain}
                                  </Badge>
                                </div>
                                <p className="text-gray-400 font-mono text-sm mb-1">{request.userEmail}</p>
                                {request.message && (
                                  <p className="text-gray-300 font-mono text-sm mb-2 italic">"{request.message}"</p>
                                )}
                                <div className="flex items-center space-x-4 text-xs font-mono text-gray-500">
                                  <span>Requested: {new Date(request.createdAt).toLocaleDateString()}</span>
                                  {request.adminNotes && (
                                    <span className="text-blue-400">Admin Notes: {request.adminNotes}</span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                {request.status === 'pending' && (
                                  <>
                                    <Button
                                      size="sm"
                                      onClick={() => handleRequestAction(request.id, 'approved')}
                                      className="bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20 font-mono"
                                    >
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                      Approve
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => setSelectedRequest(request)}
                                      className="bg-yellow-500/10 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20 font-mono"
                                    >
                                      <Edit className="w-3 h-3 mr-1" />
                                      Reject
                                    </Button>
                                  </>
                                )}
                                {request.status === 'approved' && (
                                  <Button
                                    size="sm"
                                    onClick={() => handleScheduleInterview(request)}
                                    className="bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20 font-mono"
                                  >
                                    <Calendar className="w-3 h-3 mr-1" />
                                    Assign / Schedule
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      {filteredRequests.length === 0 && (
                        <div className="text-center py-8">
                          <Activity className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                          <p className="text-gray-500 font-mono">No requests found</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Reject Request Modal */}
              {selectedRequest && (
                <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
                  <DialogContent className="bg-black/90 border-gray-600">
                    <DialogHeader>
                      <DialogTitle className="text-white font-mono">Reject Interview Request</DialogTitle>
                      <DialogDescription className="text-gray-400 font-mono">
                        Provide a reason for rejecting this request
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-gray-300 font-mono text-sm mb-2 block">Rejection Reason</label>
                        <Textarea
                          value={adminNotes}
                          onChange={(e) => setAdminNotes(e.target.value)}
                          placeholder="Explain why this request is being rejected..."
                          className="bg-black/20 border-gray-600 text-white font-mono h-24"
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => setSelectedRequest(null)}
                          className="bg-gray-500/10 border-gray-500/30 text-gray-400 hover:bg-gray-500/20 font-mono"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => handleRequestAction(selectedRequest.id, 'rejected', adminNotes)}
                          className="bg-red-500 hover:bg-red-600 text-white font-mono"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Reject Request
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}

              {/* Schedule Interview Modal */}
              {schedulingRequest && (
                <Dialog open={!!schedulingRequest} onOpenChange={() => setSchedulingRequest(null)}>
                  <DialogContent className="bg-black/90 border-gray-600 max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-white font-mono">Schedule Interview</DialogTitle>
                      <DialogDescription className="text-gray-400 font-mono">
                        {schedulingRequest.userName} — {schedulingRequest.domain} ({schedulingRequest.interviewType})
                      </DialogDescription>
                      <div className="text-blue-400 font-mono text-sm mt-2">
                        �� {schedulingRequest.userEmail}
                      </div>
                    </DialogHeader>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-gray-300 font-mono text-sm mb-2 block">Interview Date *</label>
                          <Input
                            type="date"
                            value={scheduleForm.interviewDate}
                            onChange={(e) => setScheduleForm({ ...scheduleForm, interviewDate: e.target.value })}
                            className="bg-black/20 border-gray-600 text-white font-mono"
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                        <div>
                          <label className="text-gray-300 font-mono text-sm mb-2 block">Interview Time *</label>
                          <Input
                            type="time"
                            value={scheduleForm.interviewTime}
                            onChange={(e) => setScheduleForm({ ...scheduleForm, interviewTime: e.target.value })}
                            className="bg-black/20 border-gray-600 text-white font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-gray-300 font-mono text-sm mb-2 block">Google Meet Link</label>
                        <Input
                          type="url"
                          placeholder="https://meet.google.com/xxx-xxxx-xxx"
                          value={scheduleForm.meetingLink}
                          onChange={(e) => setScheduleForm({ ...scheduleForm, meetingLink: e.target.value })}
                          className="bg-black/20 border-gray-600 text-white font-mono"
                        />
                      </div>

                      {/* Only show assignment for "give" interviews */}
                      {schedulingRequest.interviewType === 'give' && (
                        <div>
                          <label className="text-gray-300 font-mono text-sm mb-2 block">Assign Interviewer</label>
                          <Select 
                            value={scheduleForm.assignedTo || undefined} 
                            onValueChange={(value) => setScheduleForm({ ...scheduleForm, assignedTo: value })}
                          >
                            <SelectTrigger className="bg-black/20 border-gray-600 text-white font-mono">
                              <SelectValue placeholder="Select interviewer..." />
                            </SelectTrigger>
                            <SelectContent className="bg-black border-gray-600">
                              {requests
                                .filter(req => req.interviewType === 'take' && req.status === 'approved')
                                .map(req => (
                                  <SelectItem key={req.id} value={req.userId}>
                                    {req.userName} ({req.userEmail}) - {req.domain}
                                  </SelectItem>
                                ))
                              }
                            </SelectContent>
                          </Select>
                          {/* Add a button to clear assignment */}
                          {scheduleForm.assignedTo && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setScheduleForm({ ...scheduleForm, assignedTo: '' })}
                              className="mt-2 bg-gray-500/10 border-gray-500/30 text-gray-400 hover:bg-gray-500/20 font-mono text-xs"
                            >
                              Clear Assignment
                            </Button>
                          )}
                        </div>
                      )}

                      <div>
                        <label className="text-gray-300 font-mono text-sm mb-2 block">Interview Details / Notes</label>
                        <Textarea
                          placeholder="Agenda, panel, preparation, etc."
                          value={scheduleForm.adminNotes}
                          onChange={(e) => setScheduleForm({ ...scheduleForm, adminNotes: e.target.value })}
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
                          Save Schedule
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </TabsContent>

            {/* User Management Tab */}
            <TabsContent value="users" className="space-y-6">
              <Card className="bg-black/40 border-blue-500/20 backdrop-blur-xl">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white font-mono flex items-center">
                          <Users className="w-5 h-5 mr-2 text-blue-400" />
                          User Management ({filteredUsers.length} users)
                        </CardTitle>
                        <CardDescription className="text-gray-400 font-mono">
                          Manage users, roles, and permissions
                        </CardDescription>
                      </div>
                      <Button
                        onClick={loadUsers}
                        disabled={loadingUsers}
                        size="sm"
                        variant="outline"
                        className="bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20 font-mono"
                      >
                        <RefreshCw className={`w-4 h-4 mr-2 ${loadingUsers ? 'animate-spin' : ''}`} />
                        Refresh
                      </Button>
                    </div>
                  </CardHeader>
                <CardContent className="space-y-4">
                  {/* Search and Filter */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Search users by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-black/20 border-gray-600 text-white font-mono"
                    />
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                      <SelectTrigger className="bg-black/20 border-gray-600 text-white font-mono">
                        <SelectValue placeholder="Filter by role" />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-gray-600">
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {usersError && (
                    <Alert className="bg-red-500/10 border-red-500/30 text-red-400">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="font-mono text-sm">{usersError}</AlertDescription>
                    </Alert>
                  )}

                  {/* Debug info */}
                  <div className="text-xs text-gray-500 font-mono mb-2">
                    Debug: {users.length} users loaded, {filteredUsers.length} filtered, Loading: {loadingUsers ? 'Yes' : 'No'}
                  </div>

                  {loadingUsers ? (
                    <div className="text-center py-8">
                      <RefreshCw className="w-8 h-8 text-gray-400 mx-auto mb-2 animate-spin" />
                      <p className="text-gray-400 font-mono">Loading users...</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {filteredUsers.map((user) => (
                        <Card key={user.id} className="bg-black/20 border-gray-600/30">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <h3 className="text-white font-mono font-bold">{user.name || 'No Name'}</h3>
                                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30 font-mono text-xs">
                                    {user.role || 'student'}
                                  </Badge>
                                  <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 font-mono text-xs">
                                    {user.drillPoints || 0} DP
                                  </Badge>
                                </div>
                                <p className="text-gray-400 font-mono text-sm mb-1">{user.email}</p>
                                <div className="flex items-center space-x-4 text-xs font-mono text-gray-500">
                                  <span>Interviews: {user.interviewsTaken || 0} taken, {user.interviewsGiven || 0} given</span>
                                  <span>Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}</span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleEditUser(user)}
                                      className="bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20 font-mono"
                                    >
                                      <Edit className="w-3 h-3 mr-1" />
                                      Edit
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="bg-black/90 border-gray-600 max-w-2xl max-h-[80vh] overflow-y-auto">
                                    <DialogHeader>
                                      <DialogTitle className="text-white font-mono">Edit User: {user.name}</DialogTitle>
                                      <DialogDescription className="text-gray-400 font-mono">
                                        Update user profile information
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <label className="text-gray-300 font-mono text-sm mb-1 block">Name</label>
                                          <Input
                                            value={editForm.name}
                                            onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                            className="bg-black/20 border-gray-600 text-white font-mono"
                                          />
                                        </div>
                                        <div>
                                          <label className="text-gray-300 font-mono text-sm mb-1 block">Email</label>
                                          <Input
                                            value={editForm.email}
                                            onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                            className="bg-black/20 border-gray-600 text-white font-mono"
                                          />
                                        </div>
                                        <div>
                                          <label className="text-gray-300 font-mono text-sm mb-1 block">Phone</label>
                                          <Input
                                            value={editForm.phone}
                                            onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                                            className="bg-black/20 border-gray-600 text-white font-mono"
                                          />
                                        </div>
                                        <div>
                                          <label className="text-gray-300 font-mono text-sm mb-1 block">Location</label>
                                          <Input
                                            value={editForm.location}
                                            onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                                            className="bg-black/20 border-gray-600 text-white font-mono"
                                          />
                                        </div>
                                        <div>
                                          <label className="text-gray-300 font-mono text-sm mb-1 block">Company</label>
                                          <Input
                                            value={editForm.company}
                                            onChange={(e) => setEditForm({...editForm, company: e.target.value})}
                                            className="bg-black/20 border-gray-600 text-white font-mono"
                                          />
                                        </div>
                                        <div>
                                          <label className="text-gray-300 font-mono text-sm mb-1 block">Position</label>
                                          <Input
                                            value={editForm.position}
                                            onChange={(e) => setEditForm({...editForm, position: e.target.value})}
                                            className="bg-black/20 border-gray-600 text-white font-mono"
                                          />
                                        </div>
                                        <div>
                                          <label className="text-gray-300 font-mono text-sm mb-1 block">Experience</label>
                                          <Select value={editForm.experience} onValueChange={(value) => setEditForm({...editForm, experience: value})}>
                                            <SelectTrigger className="bg-black/20 border-gray-600 text-white font-mono">
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-black border-gray-600">
                                              <SelectItem value="0">0-1 years</SelectItem>
                                              <SelectItem value="1">1-2 years</SelectItem>
                                              <SelectItem value="2">2-3 years</SelectItem>
                                              <SelectItem value="3">3-5 years</SelectItem>
                                              <SelectItem value="5">5+ years</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div>
                                          <label className="text-gray-300 font-mono text-sm mb-1 block">Role</label>
                                          <Select value={editForm.role} onValueChange={(value) => setEditForm({...editForm, role: value})}>
                                            <SelectTrigger className="bg-black/20 border-gray-600 text-white font-mono">
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-black border-gray-600">
                                              <SelectItem value="student">Student</SelectItem>
                                              <SelectItem value="professional">Professional</SelectItem>
                                              <SelectItem value="admin">Admin</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div>
                                          <label className="text-gray-300 font-mono text-sm mb-1 block">Drill Points</label>
                                          <Input
                                            type="number"
                                            value={editForm.drillPoints}
                                            onChange={(e) => setEditForm({...editForm, drillPoints: parseInt(e.target.value) || 0})}
                                            className="bg-black/20 border-gray-600 text-white font-mono"
                                          />
                                        </div>
                                        <div>
                                          <label className="text-gray-300 font-mono text-sm mb-1 block">Interviews Taken</label>
                                          <Input
                                            type="number"
                                            value={editForm.interviewsTaken}
                                            onChange={(e) => setEditForm({...editForm, interviewsTaken: parseInt(e.target.value) || 0})}
                                            className="bg-black/20 border-gray-600 text-white font-mono"
                                          />
                                        </div>
                                        <div>
                                          <label className="text-gray-300 font-mono text-sm mb-1 block">Interviews Given</label>
                                          <Input
                                            type="number"
                                            value={editForm.interviewsGiven}
                                            onChange={(e) => setEditForm({...editForm, interviewsGiven: parseInt(e.target.value) || 0})}
                                            className="bg-black/20 border-gray-600 text-white font-mono"
                                          />
                                        </div>
                                      </div>
                                      <div>
                                        <label className="text-gray-300 font-mono text-sm mb-1 block">Bio</label>
                                        <Textarea
                                          value={editForm.bio}
                                          onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                                          className="bg-black/20 border-gray-600 text-white font-mono h-20"
                                        />
                                      </div>
                                      <div className="flex justify-end space-x-2">
                                        <Button
                                          variant="outline"
                                          onClick={() => setEditingUser(null)}
                                          className="bg-gray-500/10 border-gray-500/30 text-gray-400 hover:bg-gray-500/20 font-mono"
                                        >
                                          Cancel
                                        </Button>
                                        <Button
                                          onClick={handleUpdateUser}
                                          className="bg-green-500 hover:bg-green-600 text-white font-mono"
                                        >
                                          <CheckCircle className="w-4 h-4 mr-2" />
                                          Update User
                                        </Button>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 font-mono"
                                >
                                  <Trash2 className="w-3 h-3 mr-1" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      {filteredUsers.length === 0 && (
                        <div className="text-center py-8">
                          <Users className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                          <p className="text-gray-500 font-mono">No users found</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card className="bg-black/40 border-orange-500/20 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white font-mono flex items-center">
                    <Settings className="w-5 h-5 mr-2 text-orange-400" />
                    System Settings
                  </CardTitle>
                  <CardDescription className="text-gray-400 font-mono">
                    Configure system parameters and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Settings className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-500 font-mono">System settings coming soon</p>
                    <p className="text-gray-600 font-mono text-sm">Configure drill points, interview settings, and more</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
  )
}
