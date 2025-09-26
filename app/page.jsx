"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Menu,
  X,
  Sun,
  Moon,
  Code,
  Database,
  Brain,
  Users,
  Clock,
  Star,
  CheckCircle,
  XCircle,
  ArrowRight,
  Play,
  Calendar,
  Target,
  Award,
  Zap,
  Shield,
  Mail,
  Github,
  Twitter,
  Linkedin,
} from "lucide-react"
import ThreeScene from "./components/three-scene"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (user) {
      console.log('User already logged in, redirecting to dashboard')
      router.push('/dashboard')
    } else {
      setIsCheckingAuth(false)
    }
  }, [user, router])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleFreeMockClick = () => {
    router.push("/auth/login?redirect=free-mock")
  }

  const handlePaidMockClick = () => {
    router.push("/auth/login?redirect=paid-mock")
  }

  if (!mounted || isCheckingAuth) {
    return null
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => router.push('/')}>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MockDrilling
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="/about" className="text-sm font-medium hover:text-primary transition-colors">
                About Us
              </a>
              <a href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
                Contact
              </a>
              <a href="/editor" className="text-sm font-medium hover:text-primary transition-colors">
                Online Editor
              </a>
              <a href="/blogs" className="text-sm font-medium hover:text-primary transition-colors">
                Blogs
              </a>
              <a href="/community" className="text-sm font-medium hover:text-primary transition-colors">
                Community
              </a>
              <Button variant="outline" size="sm" onClick={() => router.push('/auth/login')}>
                Login
              </Button>
              <Button size="sm" onClick={() => router.push('/auth/signup')}>Sign Up</Button>
              <Button variant="ghost" size="sm" onClick={toggleTheme} className="w-9 h-9 p-0">
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={toggleTheme} className="w-9 h-9 p-0">
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)} className="w-9 h-9 p-0">
                {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="flex flex-col space-y-4">
                <a href="/about" className="text-sm font-medium hover:text-primary transition-colors">
                  About Us
                </a>
                <a href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
                  Contact
                </a>
                <a href="/editor" className="text-sm font-medium hover:text-primary transition-colors">
                  Online Editor
                </a>
                <a href="/blogs" className="text-sm font-medium hover:text-primary transition-colors">
                  Blogs
                </a>
                <a href="/community" className="text-sm font-medium hover:text-primary transition-colors">
                  Community
                </a>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => router.push('/auth/login')}>
                    Login
                  </Button>
                  <Button size="sm" className="flex-1" onClick={() => router.push('/auth/signup')}>
                    Sign Up
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* 3D Background */}
        <div className="absolute inset-0 z-0">
          <ThreeScene />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 text-sm px-4 py-2">
              🚀 Sharpen your interview skills—free or expert-led
            </Badge>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent leading-tight">
              Master Interviews — Free or Expert-Led
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Practice unlimited technical interviews in frontend, backend, and DSA. Upgrade for company-specific,
              expert feedback tailored to real companies.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={handleFreeMockClick}
              >
                <Play className="w-5 h-5 mr-2" />
                Start Free Mock Interview
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 bg-transparent"
                onClick={handlePaidMockClick}
              >
                <Calendar className="w-5 h-5 mr-2" />
                Book Professional Mock (₹499)
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <Code className="w-4 h-4 text-blue-500" />
                <span>Frontend</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <Database className="w-4 h-4 text-green-500" />
                <span>Backend</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <Brain className="w-4 h-4 text-purple-500" />
                <span>DSA</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section id="comparison" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Which Mock Interview Fits You?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Compare unlimited practice vs. premium, company-aligned coaching. Start free or accelerate with expert
              insight.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Free Mock Card */}
            <Card className="relative overflow-hidden border-2 hover:border-blue-500 transition-colors">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Free Mock</CardTitle>
                <CardDescription className="text-lg">Perfect for daily practice</CardDescription>
                <div className="text-3xl font-bold text-blue-600">Free</div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Unlimited interviews</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>AI-driven scenarios</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Frontend, Backend, DSA</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Instant feedback</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Performance dashboard</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <XCircle className="w-5 h-5 text-muted-foreground" />
                    <span className="text-muted-foreground">Company-specific prep</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <XCircle className="w-5 h-5 text-muted-foreground" />
                    <span className="text-muted-foreground">Expert feedback</span>
                  </div>
                </div>
                <Button
                  className="w-full mt-6"
                  size="lg"
                  onClick={handleFreeMockClick}
                >
                  Start Free Interview
                </Button>
              </CardContent>
            </Card>

            {/* Paid Mock Card */}
            <Card className="relative overflow-hidden border-2 border-purple-500 shadow-lg">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
              <Badge className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500">Popular</Badge>
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Professional Mock</CardTitle>
                <CardDescription className="text-lg">Expert-led coaching</CardDescription>
                <div className="text-3xl font-bold text-purple-600">₹499</div>
                <div className="text-sm text-muted-foreground">per session</div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Industry expert interviewer</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Company-specific preparation</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Advanced level questions</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Detailed verbal feedback</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Written review report</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Curated resources</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Flexible scheduling</span>
                  </div>
                </div>
                <Button
                  className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  size="lg"
                  onClick={handlePaidMockClick}
                >
                  Book Expert Interview
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Free Mock Details */}
      <section id="free-mock" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="secondary" className="mb-4">
                Free Forever
              </Badge>
              <h3 className="text-3xl md:text-4xl font-bold mb-6">Unlimited Free Mock Interviews</h3>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Jump into as many mock interviews as you want—no signup friction. AI-driven scenarios cover Frontend,
                Backend, and Data Structures & Algorithms. Get instant scoring, topic breakdown, and suggested next
                steps.
              </p>
              <p className="text-lg font-medium text-blue-600 mb-8">
                Ideal for daily practice and building confidence.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <Zap className="w-4 h-4 text-blue-600" />
                  </div>
                  <span>Instant start (no waiting)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <Brain className="w-4 h-4 text-green-600" />
                  </div>
                  <span>AI-generated questions</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                    <Target className="w-4 h-4 text-purple-600" />
                  </div>
                  <span>Performance dashboard</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-orange-600" />
                  </div>
                  <span>Skill gap highlights</span>
                </div>
              </div>

              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                onClick={handleFreeMockClick}
              >
                <Play className="w-5 h-5 mr-2" />
                Start Free Interview
              </Button>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl p-8">
                <div className="bg-background rounded-xl p-6 shadow-lg">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                    <div className="h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Paid Mock Details */}
      <section id="paid-mock" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-8">
                <div className="bg-background rounded-xl p-6 shadow-lg">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold">Expert Interview</div>
                      <div className="text-sm text-muted-foreground">with Sarah Chen</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">60 minutes scheduled</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Target className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Google Frontend Focus</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm">4.9/5 Expert Rating</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <Badge variant="secondary" className="mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                Premium Experience
              </Badge>
              <h3 className="text-3xl md:text-4xl font-bold mb-6">Professional Mock with Industry Experts</h3>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                For ₹499 per session, get a structured mock interview conducted by an industry professional. Choose your
                focus (company-specific, role-specific) and receive in-depth feedback from basic to advanced levels
                along with curated resources to improve.
              </p>
              <p className="text-lg font-medium text-purple-600 mb-8">Perfect for final prep before real interviews.</p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-purple-600" />
                  </div>
                  <span>Schedule with expert</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center">
                    <Target className="w-4 h-4 text-pink-600" />
                  </div>
                  <span>Customized to target company</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <Brain className="w-4 h-4 text-blue-600" />
                  </div>
                  <span>Real-time probing questions</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <Award className="w-4 h-4 text-green-600" />
                  </div>
                  <span>Follow-up resource pack</span>
                </div>
              </div>

              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                onClick={handlePaidMockClick}
              >
                <Calendar className="w-5 h-5 mr-2" />
                Book Expert Interview
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by 10,000+ Developers</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See how MockDrilling helped developers land their dream jobs at top companies.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Priya Sharma",
                role: "Frontend Developer at Google",
                content:
                  "MockDrilling's expert sessions helped me understand exactly what Google looks for. The feedback was incredibly detailed and actionable.",
                rating: 5,
              },
              {
                name: "Rahul Verma",
                role: "Backend Engineer at Microsoft",
                content:
                  "The free mocks gave me confidence, and the expert session sealed the deal. Worth every rupee for the personalized feedback.",
                rating: 5,
              },
              {
                name: "Anita Patel",
                role: "Full Stack Developer at Amazon",
                content:
                  "I practiced daily with free mocks and booked an expert session before my Amazon interview. Got the offer!",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Email Capture */}
      <section className="py-20 bg-gradient-to-r from-black-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Get Interview Tips & Exclusive Discounts</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join 10,000+ developers getting weekly interview prep tips and early access to new features.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
            />
            <Button className="bg-white text-blue-600 hover:bg-white/90">
              <Mail className="w-4 h-4 mr-2" />
              Subscribe
            </Button>
          </div>

          <p className="text-sm text-blue-100 mt-4">No spam. Unsubscribe anytime.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Logo & Description */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  MockDrilling
                </span>
              </div>
              <p className="text-muted-foreground mb-4 max-w-md">
                Sharpen your interview skills with unlimited free practice or expert-led sessions. Your path to landing
                that dream job starts here.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="w-9 h-9 p-0">
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="w-9 h-9 p-0">
                  <Github className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="w-9 h-9 p-0">
                  <Linkedin className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <a
                  href="#free-mock"
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Free Mock
                </a>
                <a
                  href="#paid-mock"
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Paid Mock
                </a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  FAQs
                </a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </a>
              </div>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <div className="space-y-2">
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Refund Policy
                </a>
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} MockDrilling. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <Badge variant="secondary" className="text-xs">
                <Shield className="w-3 h-3 mr-1" />
                Secure Payments
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Made in India 🇮🇳
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
