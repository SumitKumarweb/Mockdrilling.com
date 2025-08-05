"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Clock,
  Code,
  Database,
  Brain,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Send,
  CheckCircle,
  Zap,
  Play,
  MessageSquare,
  Users,
  PhoneOff,
  Maximize,
  Minimize,
  Copy,
  Download,
  Loader2,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

export default function TakeInterviewPage() {
  const params = useParams()
  const domain = params.domain
  const { user } = useAuth()
  const [timeLeft, setTimeLeft] = useState(45 * 60) // 45 minutes
  const [isRecording, setIsRecording] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(false)
  const [isMicOn, setIsMicOn] = useState(false)
  const [interviewStarted, setInterviewStarted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [permissionsGranted, setPermissionsGranted] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [interviewerConnected, setInterviewerConnected] = useState(false)

  // Video call states
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const [localStream, setLocalStream] = useState(null)
  const [remoteStream, setRemoteStream] = useState(null)

  // Chat states
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Code compiler states
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState("javascript")
  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)

  // Feedback states
  const [interviewerFeedback, setInterviewerFeedback] = useState(null)
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false)
  const [feedbackError, setFeedbackError] = useState(null)

  // Interview data
  const [interviewData, setInterviewData] = useState({
    sessionId: null,
    candidateId: null,
    interviewerId: null,
    domain: domain,
    startTime: null,
    questions: [],
    responses: [],
  })

  const domainInfo = {
    frontend: { name: "Frontend", icon: Code, color: "blue" },
    backend: { name: "Backend", icon: Database, color: "green" },
    dsa: { name: "DSA", icon: Brain, color: "purple" },
  }

  const currentDomain = domainInfo[domain] || domainInfo.frontend
  const Icon = currentDomain.icon

  // Language templates
  const codeTemplates = {
    javascript: `// JavaScript Code
function solution() {
  console.log("Hello World!");
  return "Your solution here";
}

solution();`,
    python: `# Python Code
def solution():
    print("Hello World!")
    return "Your solution here"

solution()`,
    java: `// Java Code
public class Solution {
    public static void main(String[] args) {
        System.out.println("Hello World!");
        solution();
    }
    
    public static void solution() {
        // Your solution here
    }
}`,
    html: `<!DOCTYPE html>
<html>
<head>
    <title>HTML Demo</title>
    <style>
        body { font-family: Arial, sans-serif; }
        .container { padding: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Hello World!</h1>
        <p>Your HTML content here</p>
    </div>
    
    <script>
        console.log("JavaScript working!");
    </script>
</body>
</html>`,
    react: `import React, { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>React Component</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}

export default App;`,
  }

  // Fetch interviewer feedback
  const fetchInterviewerFeedback = async () => {
    if (!interviewData.sessionId) return

    setIsLoadingFeedback(true)
    setFeedbackError(null)

    try {
      const response = await fetch(`/api/interview/interviewer-feedback?sessionId=${interviewData.sessionId}`)
      const data = await response.json()

      if (data.success && data.feedback) {
        setInterviewerFeedback(data.feedback)
      } else if (data.pending) {
        setInterviewerFeedback(null)
      } else {
        setFeedbackError("No feedback available yet")
      }
    } catch (error) {
      console.error("Failed to fetch interviewer feedback:", error)
      setFeedbackError("Failed to load feedback")
      setInterviewerFeedback(null)
    } finally {
      setIsLoadingFeedback(false)
    }
  }

  // Request permissions
  const requestPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })

      setLocalStream(stream)
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }

      setPermissionsGranted(true)
      setIsVideoOn(true)
      setIsMicOn(true)

      // Initialize interview session
      await initializeInterview()
    } catch (error) {
      console.error("Permission denied:", error)
      alert("Camera and microphone permissions are required for the interview")
    }
  }

  // Initialize interview with backend
  const initializeInterview = async () => {
    try {
      const response = await fetch("/api/interview/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain: domain,
          type: "take",
          candidateId: "user123", // Replace with actual user ID
        }),
      })

      const data = await response.json()
      setInterviewData((prev) => ({
        ...prev,
        sessionId: data.sessionId,
        candidateId: data.candidateId,
        interviewerId: data.interviewerId,
        startTime: new Date().toISOString(),
        questions: data.questions,
      }))

      setIsConnected(true)

      // Simulate interviewer connection
      setTimeout(() => {
        setInterviewerConnected(true)
        addSystemMessage("Interviewer has joined the session")

        // Start fetching feedback periodically
        const feedbackInterval = setInterval(() => {
          fetchInterviewerFeedback()
        }, 10000) // Check every 10 seconds

        // Clean up interval on component unmount
        return () => clearInterval(feedbackInterval)
      }, 3000)
    } catch (error) {
      console.error("Failed to initialize interview:", error)
    }
  }

  // Timer effect
  useEffect(() => {
    if (interviewStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [interviewStarted, timeLeft])

  // Code language change
  useEffect(() => {
    setCode(codeTemplates[language] || "")
  }, [language])

  // Fetch feedback when interviewer connects
  useEffect(() => {
    if (interviewerConnected && interviewData.sessionId) {
      fetchInterviewerFeedback()
    }
  }, [interviewerConnected, interviewData.sessionId])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleStartInterview = () => {
    setInterviewStarted(true)
  }

  // Toggle video/audio
  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setIsVideoOn(videoTrack.enabled)
      }
    }
  }

  const toggleMic = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setIsMicOn(audioTrack.enabled)
      }
    }
  }

  // Chat functions
  const addSystemMessage = (message) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: "system",
        message,
        timestamp: new Date().toLocaleTimeString(),
      },
    ])
  }

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        type: "candidate",
        message: newMessage,
        timestamp: new Date().toLocaleTimeString(),
        sender: "You",
      }

      setMessages((prev) => [...prev, message])
      setNewMessage("")

      // Send to backend
      sendMessageToBackend(message)
    }
  }

  const sendMessageToBackend = async (message) => {
    try {
      await fetch("/api/interview/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: interviewData.sessionId,
          message,
        }),
      })
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  // Code compiler
  const runCode = async () => {
    setIsRunning(true)
    setOutput("Running code...")

    try {
      const response = await fetch("/api/compiler/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language,
          sessionId: interviewData.sessionId,
        }),
      })

      const result = await response.json()
      setOutput(result.output || result.error || "No output")
    } catch (error) {
      setOutput(`Error: ${error.message}`)
    } finally {
      setIsRunning(false)
    }
  }

  // Submit interview
  const handleSubmitInterview = async () => {
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/interview/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: interviewData.sessionId,
          endTime: new Date().toISOString(),
          code,
          language,
          responses: interviewData.responses,
          userId: user?.uid,
          interviewType: 'take',
        }),
      })

      const result = await response.json()

      if (result.success) {
        console.log('Interview submitted successfully:', result)
        if (result.drillPointsUpdate?.success) {
          console.log(`Drill points updated: ${result.drillPointsUpdate.pointsChange} points`)
        }
      }

      // Redirect to results
      window.location.href = `/dashboard/interview/results?sessionId=${interviewData.sessionId}`
    } catch (error) {
      console.error("Failed to submit interview:", error)
      setIsSubmitting(false)
    }
  }

  if (!permissionsGranted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-black/40 border-green-500/20 backdrop-blur-xl">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className={`w-12 h-12 bg-${currentDomain.color}-500/20 rounded-lg flex items-center justify-center`}>
                <Icon className={`w-6 h-6 text-${currentDomain.color}-400`} />
              </div>
              <div>
                <CardTitle className="text-white font-mono text-2xl">{currentDomain.name} Interview</CardTitle>
                <CardDescription className="text-gray-400 font-mono">Video call interview session</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="bg-blue-500/10 border-blue-500/30 text-blue-400">
              <Video className="h-4 w-4" />
              <AlertDescription className="font-mono">
                This interview requires camera and microphone access for video calling with your interviewer.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <h3 className="text-white font-mono font-bold">Permissions Required:</h3>
              <div className="space-y-2 text-gray-300 font-mono text-sm">
                <div className="flex items-center space-x-2">
                  <Video className="w-4 h-4 text-blue-400" />
                  <span>Camera access for video communication</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mic className="w-4 h-4 text-green-400" />
                  <span>Microphone access for audio communication</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Code className="w-4 h-4 text-purple-400" />
                  <span>Code editor and compiler access</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-yellow-400" />
                  <span>Live chat functionality</span>
                </div>
              </div>
            </div>

            <Button
              onClick={requestPermissions}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-black font-mono font-bold text-lg py-6"
            >
              <Video className="w-5 h-5 mr-2" />
              Grant Permissions & Start Interview
            </Button>

            <div className="text-center">
              <Link href="/dashboard/interview-select" className="text-gray-400 hover:text-white font-mono text-sm">
                ← Back to Interview Selection
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!interviewStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-black/40 border-green-500/20 backdrop-blur-xl">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className={`w-12 h-12 bg-${currentDomain.color}-500/20 rounded-lg flex items-center justify-center`}>
                <Icon className={`w-6 h-6 text-${currentDomain.color}-400`} />
              </div>
              <div>
                <CardTitle className="text-white font-mono text-2xl">Ready to Start!</CardTitle>
                <CardDescription className="text-gray-400 font-mono">Your video and audio are ready</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Video Preview */}
            <div className="relative">
              <video ref={localVideoRef} autoPlay muted className="w-full h-48 bg-gray-800 rounded-lg object-cover" />
              <div className="absolute bottom-2 right-2 flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleVideo}
                  className={`${isVideoOn ? "text-green-400" : "text-red-400"} hover:text-white`}
                >
                  {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMic}
                  className={`${isMicOn ? "text-green-400" : "text-red-400"} hover:text-white`}
                >
                  {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <Alert className="bg-green-500/10 border-green-500/30 text-green-400">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription className="font-mono">
                {isConnected ? "Connected to interview session" : "Connecting to interview session..."}
              </AlertDescription>
            </Alert>

            <Button
              onClick={handleStartInterview}
              disabled={!isConnected}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-black font-mono font-bold text-lg py-6"
            >
              <Zap className="w-5 h-5 mr-2" />
              Start Interview (-120 DP)
            </Button>
          </CardContent>
        </Card>
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
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 bg-${currentDomain.color}-500/20 rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 text-${currentDomain.color}-400`} />
                </div>
                <span className="text-xl font-bold text-white font-mono">{currentDomain.name} Interview</span>
              </div>
              <Badge variant="secondary" className="bg-red-500/20 text-red-400 border-red-500/30 font-mono">
                LIVE
              </Badge>
              {interviewerConnected && (
                <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30 font-mono">
                  Interviewer Connected
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-black/60 rounded-lg px-3 py-2 border border-red-500/30">
                <Clock className="w-4 h-4 text-red-400" />
                <span className="text-red-400 font-mono font-bold">{formatTime(timeLeft)}</span>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleVideo}
                  className={`${isVideoOn ? "text-green-400" : "text-red-400"} hover:text-white`}
                >
                  {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMic}
                  className={`${isMicOn ? "text-green-400" : "text-red-400"} hover:text-white`}
                >
                  {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="text-gray-400 hover:text-white"
                >
                  {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (confirm("Are you sure you want to end the interview? This will submit your session.")) {
                      handleSubmitInterview()
                    }
                  }}
                  className="text-red-400 hover:text-red-300"
                >
                  <PhoneOff className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-120px)]">
          {/* Video Call Section */}
          <div className="lg:col-span-1 space-y-4">
            {/* Remote Video */}
            <Card className="bg-black/40 border-green-500/20 backdrop-blur-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-white font-mono text-sm flex items-center">
                  <Users className="w-4 h-4 mr-2 text-green-400" />
                  Interviewer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <video ref={remoteVideoRef} autoPlay className="w-full h-48 bg-gray-800 rounded-lg object-cover" />
                  {!interviewerConnected && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-lg">
                      <div className="text-center">
                        <Users className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                        <p className="text-gray-400 font-mono text-sm">Waiting for interviewer...</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Local Video */}
            <Card className="bg-black/40 border-blue-500/20 backdrop-blur-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-white font-mono text-sm flex items-center">
                  <Video className="w-4 h-4 mr-2 text-blue-400" />
                  You
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    className="w-full h-32 bg-gray-800 rounded-lg object-cover"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Interviewer Feedback */}
            <Card className="bg-black/40 border-orange-500/20 backdrop-blur-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-white font-mono text-sm flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2 text-orange-400" />
                  Interviewer Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingFeedback && (
                  <div className="flex items-center space-x-2 text-orange-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="font-mono text-sm">Loading feedback...</span>
                  </div>
                )}

                {feedbackError && (
                  <Alert className="bg-red-500/10 border-red-500/30 text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="font-mono text-sm">{feedbackError}</AlertDescription>
                  </Alert>
                )}

                {interviewerFeedback && (
                  <div className="space-y-3">
                    <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                      <h5 className="text-orange-400 font-mono font-bold text-sm mb-2">Feedback:</h5>
                      <p className="text-orange-300 font-mono text-sm">{interviewerFeedback.feedback}</p>
                    </div>
                    {interviewerFeedback.rating > 0 && (
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400 font-mono text-sm">Rating:</span>
                        <Badge
                          variant="secondary"
                          className="bg-orange-500/20 text-orange-400 border-orange-500/30 font-mono"
                        >
                          {interviewerFeedback.rating}/5
                        </Badge>
                      </div>
                    )}
                  </div>
                )}

                {!isLoadingFeedback && !interviewerFeedback && !feedbackError && (
                  <div className="text-center py-4">
                    <div className="text-gray-400 font-mono text-sm">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-orange-400" />
                      Pending feedback from interviewer...
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Chat Section */}
            <Card className="bg-black/40 border-yellow-500/20 backdrop-blur-xl flex-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-white font-mono text-sm flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2 text-yellow-400" />
                  Live Chat
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col h-64">
                <ScrollArea className="flex-1 mb-3">
                  <div className="space-y-2">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-2 rounded text-xs font-mono ${
                          msg.type === "system"
                            ? "bg-blue-500/20 text-blue-300"
                            : msg.type === "candidate"
                              ? "bg-green-500/20 text-green-300 ml-4"
                              : "bg-purple-500/20 text-purple-300 mr-4"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span>{msg.message}</span>
                          <span className="text-gray-500 ml-2">{msg.timestamp}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="flex space-x-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="bg-black/20 border-gray-600 text-white placeholder:text-gray-400 focus:border-yellow-500 font-mono text-sm"
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  />
                  <Button
                    onClick={sendMessage}
                    size="sm"
                    className="bg-yellow-500/20 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/30"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Code Editor Section */}
          <div className="lg:col-span-2">
            <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl h-full">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white font-mono flex items-center">
                    <Code className="w-5 h-5 mr-2 text-purple-400" />
                    Code Editor & Compiler
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="w-32 bg-black/20 border-gray-600 text-white font-mono">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-gray-600">
                        <SelectItem value="javascript">JavaScript</SelectItem>
                        <SelectItem value="python">Python</SelectItem>
                        <SelectItem value="java">Java</SelectItem>
                        <SelectItem value="html">HTML/CSS/JS</SelectItem>
                        <SelectItem value="react">React</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={runCode}
                      disabled={isRunning}
                      className="bg-green-500/20 border-green-500/30 text-green-400 hover:bg-green-500/30 font-mono"
                    >
                      {isRunning ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-400 mr-2"></div>
                      ) : (
                        <Play className="w-4 h-4 mr-2" />
                      )}
                      Run Code
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="h-[calc(100%-80px)]">
                <Tabs defaultValue="editor" className="h-full">
                  <TabsList className="grid w-full grid-cols-2 bg-black/20">
                    <TabsTrigger value="editor" className="font-mono">
                      Code Editor
                    </TabsTrigger>
                    <TabsTrigger value="output" className="font-mono">
                      Output
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="editor" className="h-[calc(100%-40px)] mt-2">
                    <Textarea
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="h-full bg-black/20 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-500 font-mono text-sm resize-none"
                      placeholder="Write your code here..."
                    />
                  </TabsContent>

                  <TabsContent value="output" className="h-[calc(100%-40px)] mt-2">
                    <div className="h-full bg-black/20 border border-gray-600 rounded-md p-4 overflow-auto">
                      <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">
                        {output || "Run your code to see output here..."}
                      </pre>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex justify-between items-center mt-4 p-4 bg-black/40 rounded-lg border border-gray-600/30">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => {
                if (
                  confirm(
                    "Are you sure you want to end the interview? This will submit your session and you cannot return.",
                  )
                ) {
                  handleSubmitInterview()
                }
              }}
              className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 font-mono"
            >
              <PhoneOff className="w-4 h-4 mr-2" />
              End Interview
            </Button>
            <Button
              variant="outline"
              className="bg-black/20 border-gray-600 text-white hover:border-green-500 font-mono"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Code
            </Button>
            <Button
              variant="outline"
              className="bg-black/20 border-gray-600 text-white hover:border-green-500 font-mono"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>

          <Button
            onClick={handleSubmitInterview}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-mono font-bold"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Submitting...
              </div>
            ) : (
              <>
                Submit Interview
                <CheckCircle className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
