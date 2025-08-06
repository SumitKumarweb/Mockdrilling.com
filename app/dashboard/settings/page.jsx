"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/hooks/useAuth"
import {
  Terminal,
  User,
  Camera,
  Upload,
  Save,
  ArrowLeft,
  Github,
  Linkedin,
  Globe,
  Bell,
  Shield,
  FileText,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import ProtectedRoute from "@/components/protected-route"

export default function SettingsPage() {
  const { user: authUser, userProfile, updateUserProfile } = useAuth()
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    company: "",
    position: "",
    experience: "0",
    bio: "",
    skills: [],
    github: "",
    linkedin: "",
    website: "",
    profilePhoto: "/placeholder.svg?height=120&width=120&text=AD",
    resume: null,
  })

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showEmail: false,
    showPhone: false,
    availableForInterview: true,
  })

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    interviewReminders: true,
    feedbackAlerts: true,
    marketingEmails: false,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [saveStatus, setSaveStatus] = useState({ type: "", message: "" })

  // Load user data from global context
  useEffect(() => {
    if (userProfile) {
      setUser({
        name: userProfile.name || "",
        email: userProfile.email || "",
        phone: userProfile.phone || "",
        location: userProfile.location || "",
        company: userProfile.company || "",
        position: userProfile.position || "",
        experience: userProfile.experience || "0",
        bio: userProfile.bio || "",
        skills: userProfile.skills || [],
        github: userProfile.github || "",
        linkedin: userProfile.linkedin || "",
        website: userProfile.website || "",
        profilePhoto: userProfile.profilePhoto || "/placeholder.svg?height=120&width=120&text=AD",
        resume: userProfile.resume || null,
      })

      if (userProfile.privacy) {
        setPrivacy(userProfile.privacy)
      }

      if (userProfile.notifications) {
        setNotifications(userProfile.notifications)
      }

      setIsLoadingData(false)
    }
  }, [userProfile])

  const handleSave = async () => {
    if (!authUser?.uid) {
      setSaveStatus({ type: "error", message: "User not authenticated" })
      return
    }

    setIsLoading(true)
    setSaveStatus({ type: "", message: "" })

    try {
      const userData = {
        ...user,
        privacy: privacy,
        notifications: notifications,
      }

      const success = await updateUserProfile(userData)
      
      if (success) {
        // Calculate achievements for profile update
        try {
          const achievementResponse = await fetch('/api/achievements', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: authUser.uid,
              action: 'profile_updated'
            })
          })
          const achievementResult = await achievementResponse.json()
          if (achievementResult.success && achievementResult.newAchievements.length > 0) {
            setSaveStatus({ 
              type: "success", 
              message: `Settings saved successfully! 🎉 ${achievementResult.newAchievements.length} new achievement${achievementResult.newAchievements.length > 1 ? 's' : ''} unlocked!` 
            })
          } else {
            setSaveStatus({ type: "success", message: "Settings saved successfully!" })
          }
        } catch (achievementError) {
          console.error('Error calculating achievements:', achievementError)
          setSaveStatus({ type: "success", message: "Settings saved successfully!" })
        }
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSaveStatus({ type: "", message: "" })
        }, 3000)
      } else {
        setSaveStatus({ type: "error", message: "Failed to save settings. Please try again." })
      }
    } catch (error) {
      console.error('Error saving user data:', error)
      setSaveStatus({ type: "error", message: "Failed to save settings. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePhotoUpload = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUser((prev) => ({ ...prev, profilePhoto: e.target?.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleResumeUpload = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      setUser((prev) => ({ ...prev, resume: file.name }))
    }
  }

  if (isLoadingData) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-white font-mono">Loading your settings...</p>
          </div>
        </div>
      </ProtectedRoute>
    )
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
                  Settings
                </Badge>
              </div>

              <div className="flex items-center space-x-3">
                {saveStatus.type && (
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm font-mono ${
                    saveStatus.type === "success" 
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-red-500/20 text-red-400 border border-red-500/30"
                  }`}>
                    {saveStatus.type === "success" ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <AlertCircle className="w-4 h-4" />
                    )}
                    <span>{saveStatus.message}</span>
                  </div>
                )}
                
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-black font-mono font-bold"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white font-mono mb-2">Account Settings</h1>
            <p className="text-gray-400 font-mono">Manage your profile and preferences</p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-black/40 border border-gray-600/30">
              <TabsTrigger
                value="profile"
                className="font-mono data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="privacy"
                className="font-mono data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
              >
                <Shield className="w-4 h-4 mr-2" />
                Privacy
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="font-mono data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
              >
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              {/* Profile Photo */}
              <Card className="bg-black/40 border-green-500/20 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white font-mono flex items-center">
                    <Camera className="w-5 h-5 mr-2 text-green-400" />
                    Profile Photo
                  </CardTitle>
                  <CardDescription className="text-gray-400 font-mono">
                    Upload a professional photo for your profile
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center space-x-6">
                  <div className="relative">
                    <img
                      src={user.profilePhoto || "/placeholder.svg"}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-2 border-green-500/30"
                    />
                    <label className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-green-600 transition-colors">
                      <Camera className="w-4 h-4 text-black" />
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                    </label>
                  </div>
                  <div>
                    <p className="text-white font-mono font-bold">{user.name || "Your Name"}</p>
                    <p className="text-gray-400 font-mono text-sm">{user.email || "your.email@example.com"}</p>
                    <p className="text-gray-500 font-mono text-xs mt-1">Recommended: Square image, at least 400x400px</p>
                  </div>
                </CardContent>
              </Card>

              {/* Personal Information */}
              <Card className="bg-black/40 border-gray-500/20 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white font-mono">Personal Information</CardTitle>
                  <CardDescription className="text-gray-400 font-mono">
                    Update your personal details (all fields are optional)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-gray-300 font-mono">
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        value={user.name}
                        onChange={(e) => setUser((prev) => ({ ...prev, name: e.target.value }))}
                        className="bg-black/20 border-gray-600 text-white font-mono"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-gray-300 font-mono">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={user.email}
                        onChange={(e) => setUser((prev) => ({ ...prev, email: e.target.value }))}
                        className="bg-black/20 border-gray-600 text-white font-mono"
                        placeholder="Enter your email"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-gray-300 font-mono">
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        value={user.phone}
                        onChange={(e) => setUser((prev) => ({ ...prev, phone: e.target.value }))}
                        className="bg-black/20 border-gray-600 text-white font-mono"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location" className="text-gray-300 font-mono">
                        Location
                      </Label>
                      <Input
                        id="location"
                        value={user.location}
                        onChange={(e) => setUser((prev) => ({ ...prev, location: e.target.value }))}
                        className="bg-black/20 border-gray-600 text-white font-mono"
                        placeholder="Enter your location"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Professional Information */}
              <Card className="bg-black/40 border-gray-500/20 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white font-mono">Professional Information</CardTitle>
                  <CardDescription className="text-gray-400 font-mono">
                    Help others understand your background
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="company" className="text-gray-300 font-mono">
                        Company
                      </Label>
                      <Input
                        id="company"
                        value={user.company}
                        onChange={(e) => setUser((prev) => ({ ...prev, company: e.target.value }))}
                        className="bg-black/20 border-gray-600 text-white font-mono"
                        placeholder="Enter your company"
                      />
                    </div>
                    <div>
                      <Label htmlFor="position" className="text-gray-300 font-mono">
                        Position
                      </Label>
                      <Input
                        id="position"
                        value={user.position}
                        onChange={(e) => setUser((prev) => ({ ...prev, position: e.target.value }))}
                        className="bg-black/20 border-gray-600 text-white font-mono"
                        placeholder="Enter your position"
                      />
                    </div>
                    <div>
                      <Label htmlFor="experience" className="text-gray-300 font-mono">
                        Experience (years)
                      </Label>
                      <Select
                        value={user.experience}
                        onValueChange={(value) => setUser((prev) => ({ ...prev, experience: value }))}
                      >
                        <SelectTrigger className="bg-black/20 border-gray-600 text-white font-mono">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-black border-gray-600">
                          <SelectItem value="0">Fresher</SelectItem>
                          <SelectItem value="1">1 year</SelectItem>
                          <SelectItem value="2">2 years</SelectItem>
                          <SelectItem value="3">3 years</SelectItem>
                          <SelectItem value="4">4 years</SelectItem>
                          <SelectItem value="5">5 years</SelectItem>
                          <SelectItem value="6">6+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio" className="text-gray-300 font-mono">
                      Bio/Description
                    </Label>
                    <Textarea
                      id="bio"
                      value={user.bio}
                      onChange={(e) => setUser((prev) => ({ ...prev, bio: e.target.value }))}
                      className="bg-black/20 border-gray-600 text-white font-mono min-h-[100px]"
                      placeholder="Tell others about yourself, your interests, and expertise..."
                    />
                  </div>

                  <div>
                    <Label className="text-gray-300 font-mono">Skills</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {user.skills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-green-500/20 text-green-400 border-green-500/30 font-mono"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-gray-500 text-xs font-mono mt-1">
                      Skills are automatically detected from your interview performance
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Resume Upload */}
              <Card className="bg-black/40 border-gray-500/20 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white font-mono flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-blue-400" />
                    Resume
                  </CardTitle>
                  <CardDescription className="text-gray-400 font-mono">
                    Upload your resume (PDF or DOC format, max 5MB)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-500/20 transition-colors font-mono">
                      <Upload className="w-4 h-4" />
                      <span>Upload Resume</span>
                      <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} className="hidden" />
                    </label>
                    {user.resume && (
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 font-mono text-sm">{user.resume}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Social Links */}
              <Card className="bg-black/40 border-gray-500/20 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white font-mono">Social Links</CardTitle>
                  <CardDescription className="text-gray-400 font-mono">
                    Connect your professional profiles
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="github" className="text-gray-300 font-mono flex items-center">
                      <Github className="w-4 h-4 mr-2" />
                      GitHub
                    </Label>
                    <Input
                      id="github"
                      value={user.github}
                      onChange={(e) => setUser((prev) => ({ ...prev, github: e.target.value }))}
                      className="bg-black/20 border-gray-600 text-white font-mono"
                      placeholder="https://github.com/username"
                    />
                  </div>
                  <div>
                    <Label htmlFor="linkedin" className="text-gray-300 font-mono flex items-center">
                      <Linkedin className="w-4 h-4 mr-2" />
                      LinkedIn
                    </Label>
                    <Input
                      id="linkedin"
                      value={user.linkedin}
                      onChange={(e) => setUser((prev) => ({ ...prev, linkedin: e.target.value }))}
                      className="bg-black/20 border-gray-600 text-white font-mono"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                  <div>
                    <Label htmlFor="website" className="text-gray-300 font-mono flex items-center">
                      <Globe className="w-4 h-4 mr-2" />
                      Website/Portfolio
                    </Label>
                    <Input
                      id="website"
                      value={user.website}
                      onChange={(e) => setUser((prev) => ({ ...prev, website: e.target.value }))}
                      className="bg-black/20 border-gray-600 text-white font-mono"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy Tab */}
            <TabsContent value="privacy" className="space-y-6">
              <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white font-mono flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-purple-400" />
                    Privacy Settings
                  </CardTitle>
                  <CardDescription className="text-gray-400 font-mono">
                    Control who can see your information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white font-mono">Public Profile</Label>
                      <p className="text-gray-400 text-sm font-mono">Allow others to view your profile</p>
                    </div>
                    <Switch
                      checked={privacy.profileVisible}
                      onCheckedChange={(checked) => setPrivacy((prev) => ({ ...prev, profileVisible: checked }))}
                    />
                  </div>

                  <Separator className="bg-gray-600" />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white font-mono">Show Email</Label>
                      <p className="text-gray-400 text-sm font-mono">Display email on public profile</p>
                    </div>
                    <Switch
                      checked={privacy.showEmail}
                      onCheckedChange={(checked) => setPrivacy((prev) => ({ ...prev, showEmail: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white font-mono">Show Phone</Label>
                      <p className="text-gray-400 text-sm font-mono">Display phone number on public profile</p>
                    </div>
                    <Switch
                      checked={privacy.showPhone}
                      onCheckedChange={(checked) => setPrivacy((prev) => ({ ...prev, showPhone: checked }))}
                    />
                  </div>

                  <Separator className="bg-gray-600" />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white font-mono">Available for Interviews</Label>
                      <p className="text-gray-400 text-sm font-mono">Show as available to conduct interviews</p>
                    </div>
                    <Switch
                      checked={privacy.availableForInterview}
                      onCheckedChange={(checked) => setPrivacy((prev) => ({ ...prev, availableForInterview: checked }))}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <Card className="bg-black/40 border-orange-500/20 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white font-mono flex items-center">
                    <Bell className="w-5 h-5 mr-2 text-orange-400" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription className="text-gray-400 font-mono">
                    Choose what notifications you want to receive
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white font-mono">Email Notifications</Label>
                      <p className="text-gray-400 text-sm font-mono">Receive important updates via email</p>
                    </div>
                    <Switch
                      checked={notifications.emailNotifications}
                      onCheckedChange={(checked) =>
                        setNotifications((prev) => ({ ...prev, emailNotifications: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white font-mono">Interview Reminders</Label>
                      <p className="text-gray-400 text-sm font-mono">Get reminded about upcoming interviews</p>
                    </div>
                    <Switch
                      checked={notifications.interviewReminders}
                      onCheckedChange={(checked) =>
                        setNotifications((prev) => ({ ...prev, interviewReminders: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white font-mono">Feedback Alerts</Label>
                      <p className="text-gray-400 text-sm font-mono">Notify when you receive new feedback</p>
                    </div>
                    <Switch
                      checked={notifications.feedbackAlerts}
                      onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, feedbackAlerts: checked }))}
                    />
                  </div>

                  <Separator className="bg-gray-600" />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white font-mono">Marketing Emails</Label>
                      <p className="text-gray-400 text-sm font-mono">Receive tips, updates, and promotional content</p>
                    </div>
                    <Switch
                      checked={notifications.marketingEmails}
                      onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, marketingEmails: checked }))}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  )
}
