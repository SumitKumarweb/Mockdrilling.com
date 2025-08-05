"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Code,
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
} from "lucide-react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect")
  const { signIn, signInWithGoogle, signInWithGithub, user } = useAuth()
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

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!email || !password) {
      setError("Please fill in all fields")
      setIsLoading(false)
      return
    }

    try {
      const result = await signIn(email, password)
      
      if (result.success) {
        console.log('Login successful, redirecting...', { redirect, user: result.user.email })
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
        console.log('Login error:', result.error)
        setError(result.error)
        setIsLoading(false)
      }
    } catch (error) {
      console.log('Unexpected login error:', error)
      setError("An unexpected error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider) => {
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
        console.log('Social login successful, redirecting...', { redirect, user: result.user.email })
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
        setError(result.error)
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Social login error:', error)
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
            <CardTitle className="text-2xl text-white">Welcome Back, Coder!</CardTitle>
            <CardDescription className="text-gray-300">
              {redirect === "free-mock" && "Login to start your free mock interview"}
              {redirect === "paid-mock" && "Login to book your expert session"}
              {!redirect && "Access your coding interview dashboard"}
            </CardDescription>
            {redirect && (
              <Badge variant="secondary" className="mt-2 bg-green-500/20 text-green-400 border-green-500/30">
                <Code className="w-3 h-3 mr-1" />
                {redirect === "free-mock" ? "Free Mock Interview" : "Professional Mock"}
              </Badge>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert className="bg-red-500/10 border-red-500/30 text-red-400">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              <div className="flex items-center justify-between">
                <Link href="/auth/forgot-password" className="text-sm text-green-400 hover:text-green-300">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-black font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                    Logging in...
                  </div>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Login to Dashboard
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
                onClick={() => handleSocialLogin("google")}
                disabled={isLoading}
                className="bg-black/20 border-gray-600 text-white hover:bg-black/40 hover:border-green-500"
              >
                <Chrome className="w-4 h-4 mr-2" />
                Google
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSocialLogin("github")}
                disabled={isLoading}
                className="bg-black/20 border-gray-600 text-white hover:bg-black/40 hover:border-green-500"
              >
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </Button>
            </div>

            <div className="text-center">
              <span className="text-gray-400">Don't have an account? </span>
              <Link
                href={`/auth/signup${redirect ? `?redirect=${redirect}` : ""}`}
                className="text-green-400 hover:text-green-300 font-semibold"
              >
                Sign up here
              </Link>
            </div>

            <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
              <Shield className="w-3 h-3" />
              <span>Secure login with end-to-end encryption</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
