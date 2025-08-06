"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Terminal,
  ArrowLeft,
  CalendarIcon,
  Clock,
  User,
  Star,
  Crown,
  CheckCircle,
  CreditCard,
  Building,
  Target,
  Code,
  Database,
  Brain,
  Video,
  MessageSquare,
  Award,
  Zap,
} from "lucide-react"
import Link from "next/link"
import ProtectedRoute from "@/components/protected-route"

export default function PaidMockPage() {
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState("")
  const [selectedExpert, setSelectedExpert] = useState("")
  const [selectedDomain, setSelectedDomain] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("")
  const [selectedCompany, setSelectedCompany] = useState("")
  const [userDetails, setUserDetails] = useState({
    name: "Alex Developer",
    email: "alex@example.com",
    phone: "+91 9876543210",
    experience: "3-5 years",
    currentRole: "Senior Developer",
    targetRole: "Staff Engineer",
    specificRequirements: "",
  })
  const [isBooking, setIsBooking] = useState(false)
  const [bookingStep, setBookingStep] = useState(1)

  const experts = [
    {
      id: "expert_1",
      name: "Priya Sharma",
      avatar: "/placeholder.svg?height=80&width=80&text=PS",
      company: "Google",
      position: "Staff Software Engineer",
      experience: "12 years",
      rating: 4.9,
      reviewCount: 156,
      specialties: ["System Design", "Frontend", "Leadership"],
      price: 499,
      languages: ["English", "Hindi"],
      timezone: "IST",
      bio: "Former Google Staff Engineer with 12+ years of experience. Specialized in large-scale system design and frontend architecture. Helped 200+ candidates land jobs at FAANG companies.",
    },
    {
      id: "expert_2",
      name: "Rahul Kumar",
      avatar: "/placeholder.svg?height=80&width=80&text=RK",
      company: "Microsoft",
      position: "Principal Engineer",
      experience: "15 years",
      rating: 4.8,
      reviewCount: 203,
      specialties: ["Backend", "Cloud Architecture", "DSA"],
      price: 599,
      languages: ["English", "Hindi", "Telugu"],
      timezone: "IST",
      bio: "Microsoft Principal Engineer with expertise in cloud-native architectures. Led teams of 50+ engineers. Expert in backend systems and algorithmic problem solving.",
    },
    {
      id: "expert_3",
      name: "Sarah Chen",
      avatar: "/placeholder.svg?height=80&width=80&text=SC",
      company: "Amazon",
      position: "Senior Principal Engineer",
      experience: "18 years",
      rating: 4.9,
      reviewCount: 298,
      specialties: ["System Design", "Leadership", "Product Strategy"],
      price: 799,
      languages: ["English", "Mandarin"],
      timezone: "PST",
      bio: "Amazon Senior Principal Engineer and former startup CTO. Expert in scaling systems from 0 to millions of users. Specialized in leadership and system design interviews.",
    },
  ]

  const domains = [
    { id: "frontend", name: "Frontend", icon: Code, color: "blue" },
    { id: "backend", name: "Backend", icon: Database, color: "green" },
    { id: "system-design", name: "System Design", icon: Building, color: "purple" },
    { id: "dsa", name: "DSA", icon: Brain, color: "orange" },
  ]

  const levels = [
    { id: "junior", name: "Junior (0-2 years)", price: 299 },
    { id: "mid", name: "Mid-level (3-5 years)", price: 499 },
    { id: "senior", name: "Senior (6-8 years)", price: 699 },
    { id: "staff", name: "Staff+ (8+ years)", price: 899 },
  ]

  const companies = [
    "Google", "Microsoft", "Amazon", "Meta", "Apple", "Netflix", "Uber", "Airbnb", "Stripe", "Other"
  ]

  const timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"
  ]

  const selectedExpertData = experts.find(expert => expert.id === selectedExpert)

  const handleBooking = async () => {
    setIsBooking(true)
    // Simulate booking process
    await new Promise(resolve => setTimeout(resolve, 2000))
    setBookingStep(5)
      setIsBooking(false)
  }

  const canProceedToNext = () => {
    switch (bookingStep) {
      case 1:
        return selectedDomain && selectedLevel && selectedCompany
      case 2:
        return selectedExpert
      case 3:
        return selectedDate && selectedTime
      case 4:
        return userDetails.name && userDetails.email && userDetails.phone
      default:
        return true
    }
  }

  const getTotalPrice = () => {
    const basePrice = levels.find(level => level.id === selectedLevel)?.price || 499
    return basePrice
  }

  const handleNext = () => {
    if (canProceedToNext()) {
      setBookingStep(prev => Math.min(prev + 1, 5))
    }
  }

  const handleBack = () => {
    setBookingStep(prev => Math.max(prev - 1, 1))
  }

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      {/* Header */}
      <header className="border-b border-green-500/20 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                  <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <Terminal className="w-5 h-5 text-black" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent font-mono">
                  MockDrilling
                </span>
              </div>
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border-purple-500/30 font-mono">
                Professional Mock
              </Badge>
            </div>

              <div className="flex items-center space-x-2 bg-black/60 rounded-lg px-3 py-2 border border-green-500/30">
                <Crown className="w-4 h-4 text-yellow-400" />
                <span className="text-green-400 font-mono font-bold">₹{getTotalPrice()}</span>
                <span className="text-gray-400 text-sm font-mono">Professional</span>
              </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
              {/* Step Indicator */}
              <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white font-mono flex items-center">
                    <Target className="w-5 h-5 mr-2 text-purple-400" />
                    Booking Progress
                  </CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="space-y-4">
                  {[
                    { step: 1, title: "Interview Focus", completed: bookingStep > 1 },
                    { step: 2, title: "Choose Expert", completed: bookingStep > 2 },
                    { step: 3, title: "Schedule", completed: bookingStep > 3 },
                    { step: 4, title: "Your Details", completed: bookingStep > 4 },
                    { step: 5, title: "Confirmation", completed: bookingStep > 5 },
                  ].map((item) => (
                    <div key={item.step} className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          item.completed
                            ? "bg-green-500 text-black"
                            : bookingStep === item.step
                              ? "bg-purple-500 text-white"
                              : "bg-gray-600 text-gray-400"
                        }`}
                      >
                        {item.completed ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <span className="font-mono text-sm">{item.step}</span>
                        )}
                      </div>
                      <span
                        className={`font-mono text-sm ${
                          item.completed || bookingStep === item.step ? "text-white" : "text-gray-400"
                        }`}
                      >
                        {item.title}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

              {/* Step 1: Interview Focus */}
              {bookingStep === 1 && (
                <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-white font-mono">Step 1: Interview Focus</CardTitle>
                    <CardDescription className="text-gray-400 font-mono">
                      Tell us about your interview requirements
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-white font-mono">Domain</Label>
                        <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                          <SelectTrigger className="bg-black/20 border-gray-600 text-white">
                            <SelectValue placeholder="Select domain" />
                          </SelectTrigger>
                          <SelectContent className="bg-black border-gray-600">
                            {domains.map((domain) => (
                              <SelectItem key={domain.id} value={domain.id} className="text-white">
                                {domain.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white font-mono">Experience Level</Label>
                        <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                          <SelectTrigger className="bg-black/20 border-gray-600 text-white">
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent className="bg-black border-gray-600">
                            {levels.map((level) => (
                              <SelectItem key={level.id} value={level.id} className="text-white">
                                {level.name} - ₹{level.price}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white font-mono">Target Company</Label>
                      <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                        <SelectTrigger className="bg-black/20 border-gray-600 text-white">
                          <SelectValue placeholder="Select company" />
                        </SelectTrigger>
                        <SelectContent className="bg-black border-gray-600">
                          {companies.map((company) => (
                            <SelectItem key={company} value={company} className="text-white">
                              {company}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        onClick={handleNext}
                        disabled={!canProceedToNext()}
                        className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-mono"
                      >
                        Next Step
                        <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Choose Expert */}
              {bookingStep === 2 && (
                <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-white font-mono">Step 2: Choose Your Expert</CardTitle>
                    <CardDescription className="text-gray-400 font-mono">
                      Select an industry expert for your mock interview
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {experts.map((expert) => (
                      <Card
                        key={expert.id}
                        className={`cursor-pointer transition-all duration-300 ${
                          selectedExpert === expert.id
                            ? "bg-purple-500/20 border-purple-500/50 shadow-lg"
                            : "bg-black/20 border-gray-600/30 hover:border-gray-500/50"
                        }`}
                        onClick={() => setSelectedExpert(expert.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-4">
                            <img
                              src={expert.avatar}
                              alt={expert.name}
                              className="w-16 h-16 rounded-full object-cover border-2 border-green-500/30"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="text-white font-mono font-bold">{expert.name}</h3>
                                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 font-mono">
                                  ₹{expert.price}
                                </Badge>
                              </div>
                              <p className="text-gray-400 font-mono text-sm mb-2">
                                {expert.position} at {expert.company}
                              </p>
                              <div className="flex items-center space-x-4 mb-2">
                                <div className="flex items-center">
                                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                                  <span className="text-yellow-400 font-mono text-sm">{expert.rating}</span>
                                  <span className="text-gray-400 font-mono text-sm ml-1">({expert.reviewCount})</span>
                                </div>
                                <span className="text-gray-400 font-mono text-sm">{expert.experience} exp</span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {expert.specialties.map((specialty) => (
                                  <Badge key={specialty} variant="outline" className="text-xs font-mono">
                                    {specialty}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    <div className="flex justify-between">
                      <Button
                        onClick={handleBack}
                        variant="outline"
                        className="bg-black/20 border-gray-600 text-white hover:border-gray-500 font-mono"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                      </Button>
                      <Button
                        onClick={handleNext}
                        disabled={!canProceedToNext()}
                        className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-mono"
                      >
                        Next Step
                        <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Schedule */}
              {bookingStep === 3 && (
                <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-white font-mono">Step 3: Schedule Your Interview</CardTitle>
                    <CardDescription className="text-gray-400 font-mono">
                      Choose a date and time that works for you
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <Label className="text-white font-mono">Select Date</Label>
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          className="bg-black/20 border border-gray-600 rounded-lg"
                        />
                      </div>

                      <div className="space-y-4">
                        <Label className="text-white font-mono">Select Time</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {timeSlots.map((time) => (
                            <Button
                              key={time}
                              variant={selectedTime === time ? "default" : "outline"}
                              className={`font-mono ${
                                selectedTime === time
                                  ? "bg-purple-500 text-white"
                                  : "bg-black/20 border-gray-600 text-white hover:border-gray-500"
                              }`}
                              onClick={() => setSelectedTime(time)}
                            >
                              <Clock className="w-4 h-4 mr-2" />
                              {time}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button
                        onClick={handleBack}
                        variant="outline"
                        className="bg-black/20 border-gray-600 text-white hover:border-gray-500 font-mono"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                      </Button>
                      <Button
                        onClick={handleNext}
                        disabled={!canProceedToNext()}
                        className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-mono"
                      >
                        Next Step
                        <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 4: Your Details */}
              {bookingStep === 4 && (
                <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-white font-mono">Step 4: Your Details</CardTitle>
                    <CardDescription className="text-gray-400 font-mono">
                      Help us personalize your interview experience
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-white font-mono">Full Name</Label>
                        <Input
                          value={userDetails.name}
                          onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
                          className="bg-black/20 border-gray-600 text-white"
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white font-mono">Email</Label>
                        <Input
                          value={userDetails.email}
                          onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                          className="bg-black/20 border-gray-600 text-white"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-white font-mono">Phone Number</Label>
                        <Input
                          value={userDetails.phone}
                          onChange={(e) => setUserDetails({ ...userDetails, phone: e.target.value })}
                          className="bg-black/20 border-gray-600 text-white"
                          placeholder="Enter your phone number"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white font-mono">Experience Level</Label>
                        <Select
                          value={userDetails.experience}
                          onValueChange={(value) => setUserDetails({ ...userDetails, experience: value })}
                        >
                          <SelectTrigger className="bg-black/20 border-gray-600 text-white">
                            <SelectValue placeholder="Select experience level" />
                          </SelectTrigger>
                          <SelectContent className="bg-black border-gray-600">
                            <SelectItem value="0-2 years" className="text-white">0-2 years</SelectItem>
                            <SelectItem value="3-5 years" className="text-white">3-5 years</SelectItem>
                            <SelectItem value="6-8 years" className="text-white">6-8 years</SelectItem>
                            <SelectItem value="8+ years" className="text-white">8+ years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white font-mono">Specific Requirements</Label>
                      <Textarea
                        value={userDetails.specificRequirements}
                        onChange={(e) => setUserDetails({ ...userDetails, specificRequirements: e.target.value })}
                        className="bg-black/20 border-gray-600 text-white"
                        placeholder="Any specific topics or areas you'd like to focus on..."
                        rows={4}
                      />
                    </div>

                    <div className="flex justify-between">
                      <Button
                        onClick={handleBack}
                        variant="outline"
                        className="bg-black/20 border-gray-600 text-white hover:border-gray-500 font-mono"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                      </Button>
                      <Button
                        onClick={handleNext}
                        disabled={!canProceedToNext()}
                        className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-mono"
                      >
                        Next Step
                        <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 5: Confirmation */}
              {bookingStep === 5 && (
                <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-white font-mono">Step 5: Confirm Your Booking</CardTitle>
                    <CardDescription className="text-gray-400 font-mono">
                      Review your booking details and confirm
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-white font-mono font-bold">Interview Details</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-400 font-mono">Domain:</span>
                            <span className="text-white font-mono">{domains.find(d => d.id === selectedDomain)?.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400 font-mono">Level:</span>
                            <span className="text-white font-mono">{levels.find(l => l.id === selectedLevel)?.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400 font-mono">Company:</span>
                            <span className="text-white font-mono">{selectedCompany}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-white font-mono font-bold">Schedule</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-400 font-mono">Date:</span>
                            <span className="text-white font-mono">{selectedDate?.toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400 font-mono">Time:</span>
                            <span className="text-white font-mono">{selectedTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-gray-600" />

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-white font-mono font-bold">Total Amount</p>
                        <p className="text-gray-400 font-mono text-sm">Including all fees</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-400 font-mono">₹{getTotalPrice()}</p>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button
                        onClick={handleBack}
                        variant="outline"
                        className="bg-black/20 border-gray-600 text-white hover:border-gray-500 font-mono"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                      </Button>
                      <Button
                        onClick={handleBooking}
                        disabled={isBooking}
                        className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-mono"
                      >
                        {isBooking ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-4 h-4 mr-2" />
                            Confirm Booking
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
            {/* Selected Expert Preview */}
            {selectedExpertData && (
              <Card className="bg-black/40 border-green-500/20 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white font-mono">Selected Expert</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3 mb-3">
                    <img
                        src={selectedExpertData.avatar}
                      alt={selectedExpertData.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-green-500/30"
                    />
                    <div>
                      <h4 className="text-white font-mono font-bold">{selectedExpertData.name}</h4>
                      <p className="text-gray-400 font-mono text-sm">{selectedExpertData.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-yellow-400 font-mono text-sm">{selectedExpertData.rating}</span>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 font-mono">
                      ₹{selectedExpertData.price}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Why Professional Mock? */}
            <Card className="bg-black/40 border-blue-500/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white font-mono flex items-center">
                  <Crown className="w-5 h-5 mr-2 text-yellow-400" />
                  Why Professional Mock?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Zap className="w-4 h-4 text-blue-400 mt-0.5" />
                  <span className="text-gray-300 font-mono text-sm">Industry expert feedback</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Video className="w-4 h-4 text-green-400 mt-0.5" />
                  <span className="text-gray-300 font-mono text-sm">Real interview experience</span>
                </div>
                <div className="flex items-start space-x-2">
                  <MessageSquare className="w-4 h-4 text-purple-400 mt-0.5" />
                  <span className="text-gray-300 font-mono text-sm">Detailed performance report</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Award className="w-4 h-4 text-orange-400 mt-0.5" />
                  <span className="text-gray-300 font-mono text-sm">Bonus drill points</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  )
}
