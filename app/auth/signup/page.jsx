"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Github,
  Chrome,
  ArrowLeft,
  Terminal,
  Zap,
  Shield,
  AlertCircle,
  User,
  Gift,
} from "lucide-react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect")
  const { signUp, signInWithGoogle, signInWithGithub, user } = useAuth()
  const router = useRouter()

  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (user) {
      console.log('User already logged in, redirecting to dashboard')
      router.push('/dashboard')
    } else {
      setIsCheckingAuth(false)
    }
  }, [user, router])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match")
      setIsLoading(false)
      return
    }

    if (!formData.agreeToTerms) {
      setError("Please agree to the terms and conditions")
      setIsLoading(false)
      return
    }

    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all fields")
      setIsLoading(false)
      return
    }

    try {
      const result = await signUp(formData.email, formData.password, formData.name)
      
      if (result.success) {
        console.log('Signup successful, redirecting...', { redirect, user: result.user.email })
        setIsLoading(false)
        
        // Redirect based on the redirect parameter
        try {
          if (redirect === "free-mock") {
            console.log('Redirecting to free mock interview')
            await router.push("/dashboard/interview-select")
          } else if (redirect === "paid-mock") {
            console.log('Redirecting to paid mock interview')
            await router.push("/dashboard/paid-mock")
          } else {
            console.log('Redirecting to dashboard')
            await router.push("/dashboard")
          }
        } catch (routerError) {
          console.error('Router error:', routerError)
          // Fallback to dashboard if router fails
          await router.push("/dashboard")
        }
      } else {
        console.log('Signup error:', result.error)
        setError(result.error)
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Unexpected signup error:', error)
      setError("An unexpected error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  const handleSocialSignup = async (provider) => {
    setIsLoading(true)
    setError("")

    try {
      let result
      if (provider === "google") {
        result = await signInWithGoogle()
      } else if (provider === "github") {
        result = await signInWithGithub()
      }

      if (result && result.success) {
        console.log('Social signup successful, redirecting...', { redirect, user: result.user.email })
        setIsLoading(false)
        
        // Redirect based on the redirect parameter
        try {
          if (redirect === "free-mock") {
            console.log('Redirecting to free mock interview')
            await router.push("/dashboard/interview-select")
          } else if (redirect === "paid-mock") {
            console.log('Redirecting to paid mock interview')
            await router.push("/dashboard/paid-mock")
          } else {
            console.log('Redirecting to dashboard')
            await router.push("/dashboard")
          }
        } catch (routerError) {
          console.error('Router error:', routerError)
          // Fallback to dashboard if router fails
          await router.push("/dashboard")
        }
      } else if (result) {
        console.log('Social signup error:', result.error)
        setError(result.error)
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Social signup error:', error)
      setError("An unexpected error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  // Show loading spinner while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 font-mono">Checking authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5QzkyQUMiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>

      <div className="relative w-full max-w-md">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center text-white/70 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <Card className="bg-black/40 backdrop-blur-xl border-green-500/20 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                <Terminal className="w-6 h-6 text-black" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                MockDrilling
              </span>
            </div>
            <CardTitle className="text-2xl text-white">Join the Coding Community!</CardTitle>
            <CardDescription className="text-gray-300">
              Create your account and start your interview journey
            </CardDescription>

            <Badge variant="secondary" className="mt-2 bg-green-500/20 text-green-400 border-green-500/30">
              <Gift className="w-3 h-3 mr-1" />
              Get 1000 Free Drill Points on Signup!
            </Badge>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert className="bg-red-500/10 border-red-500/30 text-red-400">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="pl-10 bg-black/20 border-gray-600 text-white placeholder:text-gray-400 focus:border-green-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="developer@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="pl-10 bg-black/20 border-gray-600 text-white placeholder:text-gray-400 focus:border-green-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="pl-10 pr-10 bg-black/20 border-gray-600 text-white placeholder:text-gray-400 focus:border-green-500"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-300">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="pl-10 pr-10 bg-black/20 border-gray-600 text-white placeholder:text-gray-400 focus:border-green-500"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked)}
                  className="border-gray-600 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                />
                <Label htmlFor="terms" className="text-sm text-gray-300">
                  I agree to the{" "}
                  <Link href="/terms" className="text-green-400 hover:text-green-300">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-green-400 hover:text-green-300">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-black font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Create Account
                  </>
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full bg-gray-600" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black/40 px-2 text-gray-400">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() => handleSocialSignup("google")}
                disabled={isLoading}
                className="bg-black/20 border-gray-600 text-white hover:bg-black/40 hover:border-green-500"
              >
                <Chrome className="w-4 h-4 mr-2" />
                Google
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSocialSignup("github")}
                disabled={isLoading}
                className="bg-black/20 border-gray-600 text-white hover:bg-black/40 hover:border-green-500"
              >
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </Button>
            </div>

            <div className="text-center">
              <span className="text-gray-400">Already have an account? </span>
              <Link
                href={`/auth/login${redirect ? `?redirect=${redirect}` : ""}`}
                className="text-green-400 hover:text-green-300 font-semibold"
              >
                Login here
              </Link>
            </div>

            <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
              <Shield className="w-3 h-3" />
              <span>Secure signup with end-to-end encryption</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
