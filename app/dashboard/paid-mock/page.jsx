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
    { id: "frontend", name: "Frontend Engineering", icon: Code, color: "blue" },
    { id: "backend", name: "Backend Engineering", icon: Database, color: "green" },
    { id: "fullstack", name: "Full Stack Engineering", icon: Terminal, color: "purple" },
    { id: "system-design", name: "System Design", icon: Building, color: "orange" },
    { id: "dsa", name: "Data Structures & Algorithms", icon: Brain, color: "red" },
    { id: "leadership", name: "Engineering Leadership", icon: Crown, color: "yellow" },
  ]

  const levels = [
    { id: "junior", name: "Junior (0-2 years)", description: "Entry level positions" },
    { id: "mid", name: "Mid-level (2-5 years)", description: "Experienced developer roles" },
    { id: "senior", name: "Senior (5-8 years)", description: "Senior engineer positions" },
    { id: "staff", name: "Staff+ (8+ years)", description: "Staff/Principal engineer roles" },
    { id: "leadership", name: "Engineering Manager", description: "Leadership and management roles" },
  ]

  const companies = [
    "Google",
    "Microsoft",
    "Amazon",
    "Meta",
    "Apple",
    "Netflix",
    "Uber",
    "Airbnb",
    "Stripe",
    "Spotify",
    "Adobe",
    "Salesforce",
    "Twitter",
    "LinkedIn",
    "Dropbox",
  ]

  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
    "07:00 PM",
    "08:00 PM",
  ]

  const selectedExpertData = experts.find((e) => e.id === selectedExpert)

  const handleBooking = async () => {
    setIsBooking(true)

    try {
      const bookingData = {
        expertId: selectedExpert,
        date: selectedDate,
        time: selectedTime,
        domain: selectedDomain,
        level: selectedLevel,
        targetCompany: selectedCompany,
        userDetails,
        price: selectedExpertData?.price || 499,
      }

      const response = await fetch("/api/professional-mock/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      })

      const result = await response.json()

      if (result.success) {
        alert(`Booking confirmed! Meeting ID: ${result.meetingId}\nConfirmation email sent to ${userDetails.email}`)
        // Redirect to confirmation page
        window.location.href = `/dashboard/paid-mock/confirmation?bookingId=${result.bookingId}`
      } else {
        alert("Booking failed: " + result.error)
      }
    } catch (error) {
      alert("Booking failed: " + error.message)
    } finally {
      setIsBooking(false)
    }
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
        return false
    }
  }

  const getTotalPrice = () => {
    return selectedExpertData?.price || 499
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
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border-purple-500/30 font-mono">
                Professional Mock
              </Badge>
            </div>

            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-black/20 border-purple-500/30 text-purple-400 font-mono">
                Step {bookingStep} of 5
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white font-mono mb-2">Professional Mock Interview</h1>
          <p className="text-gray-400 font-mono">Get expert feedback from industry professionals</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Interview Type Selection */}
            {bookingStep === 1 && (
              <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white font-mono flex items-center">
                    <Target className="w-5 h-5 mr-2 text-purple-400" />
                    Step 1: Interview Focus
                  </CardTitle>
                  <CardDescription className="text-gray-400 font-mono">
                    Choose your interview domain and target level
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Domain Selection */}
                  <div>
                    <Label className="text-white font-mono mb-3 block">Interview Domain</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {domains.map((domain) => {
                        const Icon = domain.icon
                        return (
                          <Card
                            key={domain.id}
                            className={`cursor-pointer transition-all ${
                              selectedDomain === domain.id
                                ? `bg-${domain.color}-500/20 border-${domain.color}-500/50`
                                : "bg-black/20 border-gray-600/30 hover:border-gray-500/50"
                            }`}
                            onClick={() => setSelectedDomain(domain.id)}
                          >
                            <CardContent className="p-4 flex items-center space-x-3">
                              <Icon className={`w-6 h-6 text-${domain.color}-400`} />
                              <span className="text-white font-mono">{domain.name}</span>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </div>

                  {/* Level Selection */}
                  <div>
                    <Label className="text-white font-mono mb-3 block">Experience Level</Label>
                    <div className="space-y-3">
                      {levels.map((level) => (
                        <Card
                          key={level.id}
                          className={`cursor-pointer transition-all ${
                            selectedLevel === level.id
                              ? "bg-green-500/20 border-green-500/50"
                              : "bg-black/20 border-gray-600/30 hover:border-gray-500/50"
                          }`}
                          onClick={() => setSelectedLevel(level.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="text-white font-mono font-bold">{level.name}</h4>
                                <p className="text-gray-400 font-mono text-sm">{level.description}</p>
                              </div>
                              {selectedLevel === level.id && <CheckCircle className="w-5 h-5 text-green-400" />}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Target Company */}
                  <div>
                    <Label htmlFor="company" className="text-white font-mono">
                      Target Company (Optional)
                    </Label>
                    <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                      <SelectTrigger className="bg-black/20 border-gray-600 text-white font-mono mt-2">
                        <SelectValue placeholder="Select target company" />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-gray-600">
                        {companies.map((company) => (
                          <SelectItem key={company} value={company}>
                            {company}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Expert Selection */}
            {bookingStep === 2 && (
              <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white font-mono flex items-center">
                    <User className="w-5 h-5 mr-2 text-purple-400" />
                    Step 2: Choose Your Expert
                  </CardTitle>
                  <CardDescription className="text-gray-400 font-mono">
                    Select an industry expert for your mock interview
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {experts.map((expert) => (
                    <Card
                      key={expert.id}
                      className={`cursor-pointer transition-all ${
                        selectedExpert === expert.id
                          ? "bg-green-500/20 border-green-500/50"
                          : "bg-black/20 border-gray-600/30 hover:border-gray-500/50"
                      }`}
                      onClick={() => setSelectedExpert(expert.id)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <img
                            src={expert.avatar || "/placeholder.svg"}
                            alt={expert.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-green-500/30"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-white font-mono font-bold text-lg">{expert.name}</h3>
                              <div className="flex items-center space-x-2">
                                <div className="flex items-center">
                                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                                  <span className="text-yellow-400 font-mono text-sm">{expert.rating}</span>
                                  <span className="text-gray-400 font-mono text-sm ml-1">({expert.reviewCount})</span>
                                </div>
                                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 font-mono">
                                  ₹{expert.price}
                                </Badge>
                              </div>
                            </div>

                            <div className="space-y-2 mb-3">
                              <p className="text-gray-300 font-mono text-sm">
                                <Building className="w-4 h-4 inline mr-1" />
                                {expert.position} at {expert.company}
                              </p>
                              <p className="text-gray-300 font-mono text-sm">
                                <Award className="w-4 h-4 inline mr-1" />
                                {expert.experience} experience
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-3">
                              {expert.specialties.map((specialty, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="bg-blue-500/20 text-blue-400 border-blue-500/30 font-mono text-xs"
                                >
                                  {specialty}
                                </Badge>
                              ))}
                            </div>

                            <p className="text-gray-400 font-mono text-sm">{expert.bio}</p>

                            <div className="flex items-center space-x-4 mt-3 text-xs">
                              <span className="text-gray-400 font-mono">Languages: {expert.languages.join(", ")}</span>
                              <span className="text-gray-400 font-mono">Timezone: {expert.timezone}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Step 3: Date & Time Selection */}
            {bookingStep === 3 && (
              <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white font-mono flex items-center">
                    <CalendarIcon className="w-5 h-5 mr-2 text-purple-400" />
                    Step 3: Schedule Your Interview
                  </CardTitle>
                  <CardDescription className="text-gray-400 font-mono">
                    Choose your preferred date and time
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Calendar */}
                    <div>
                      <Label className="text-white font-mono mb-3 block">Select Date</Label>
                      <div className="bg-black/20 rounded-lg p-4 border border-gray-600/30">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          disabled={(date) => date < new Date() || date.getDay() === 0}
                          className="text-white"
                        />
                      </div>
                    </div>

                    {/* Time Slots */}
                    <div>
                      <Label className="text-white font-mono mb-3 block">Select Time (IST)</Label>
                      <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto">
                        {timeSlots.map((time) => (
                          <Button
                            key={time}
                            variant={selectedTime === time ? "default" : "outline"}
                            className={`font-mono ${
                              selectedTime === time
                                ? "bg-green-500 text-black"
                                : "bg-black/20 border-gray-600 text-white hover:border-green-500"
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

                  {selectedDate && selectedTime && (
                    <Alert className="bg-green-500/10 border-green-500/30 text-green-400">
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription className="font-mono">
                        Interview scheduled for {selectedDate.toDateString()} at {selectedTime}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 4: User Details */}
            {bookingStep === 4 && (
              <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white font-mono flex items-center">
                    <User className="w-5 h-5 mr-2 text-purple-400" />
                    Step 4: Your Details
                  </CardTitle>
                  <CardDescription className="text-gray-400 font-mono">
                    Provide your information for the interview
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-white font-mono">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        value={userDetails.name}
                        onChange={(e) => setUserDetails((prev) => ({ ...prev, name: e.target.value }))}
                        className="bg-black/20 border-gray-600 text-white font-mono"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-white font-mono">
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={userDetails.email}
                        onChange={(e) => setUserDetails((prev) => ({ ...prev, email: e.target.value }))}
                        className="bg-black/20 border-gray-600 text-white font-mono"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-white font-mono">
                        Phone *
                      </Label>
                      <Input
                        id="phone"
                        value={userDetails.phone}
                        onChange={(e) => setUserDetails((prev) => ({ ...prev, phone: e.target.value }))}
                        className="bg-black/20 border-gray-600 text-white font-mono"
                      />
                    </div>
                    <div>
                      <Label htmlFor="experience" className="text-white font-mono">
                        Experience
                      </Label>
                      <Input
                        id="experience"
                        value={userDetails.experience}
                        onChange={(e) => setUserDetails((prev) => ({ ...prev, experience: e.target.value }))}
                        className="bg-black/20 border-gray-600 text-white font-mono"
                      />
                    </div>
                    <div>
                      <Label htmlFor="currentRole" className="text-white font-mono">
                        Current Role
                      </Label>
                      <Input
                        id="currentRole"
                        value={userDetails.currentRole}
                        onChange={(e) => setUserDetails((prev) => ({ ...prev, currentRole: e.target.value }))}
                        className="bg-black/20 border-gray-600 text-white font-mono"
                      />
                    </div>
                    <div>
                      <Label htmlFor="targetRole" className="text-white font-mono">
                        Target Role
                      </Label>
                      <Input
                        id="targetRole"
                        value={userDetails.targetRole}
                        onChange={(e) => setUserDetails((prev) => ({ ...prev, targetRole: e.target.value }))}
                        className="bg-black/20 border-gray-600 text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="requirements" className="text-white font-mono">
                      Specific Requirements (Optional)
                    </Label>
                    <Textarea
                      id="requirements"
                      value={userDetails.specificRequirements}
                      onChange={(e) => setUserDetails((prev) => ({ ...prev, specificRequirements: e.target.value }))}
                      className="bg-black/20 border-gray-600 text-white font-mono"
                      placeholder="Any specific areas you'd like to focus on, companies you're targeting, or other requirements..."
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 5: Confirmation */}
            {bookingStep === 5 && (
              <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white font-mono flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                    Step 5: Confirm Booking
                  </CardTitle>
                  <CardDescription className="text-gray-400 font-mono">
                    Review your booking details before confirming
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Booking Summary */}
                  <div className="bg-black/20 rounded-lg p-6 border border-gray-600/30">
                    <h3 className="text-white font-mono font-bold mb-4">Booking Summary</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <p className="text-gray-400 font-mono text-sm">Expert</p>
                        <p className="text-white font-mono">{selectedExpertData?.name}</p>
                        <p className="text-gray-400 font-mono text-xs">{selectedExpertData?.company}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 font-mono text-sm">Domain</p>
                        <p className="text-white font-mono">{domains.find((d) => d.id === selectedDomain)?.name}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 font-mono text-sm">Date & Time</p>
                        <p className="text-white font-mono">
                          {selectedDate?.toDateString()} at {selectedTime}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 font-mono text-sm">Duration</p>
                        <p className="text-white font-mono">60 minutes</p>
                      </div>
                    </div>

                    <Separator className="bg-gray-600 mb-4" />

                    <div className="flex justify-between items-center">
                      <span className="text-white font-mono font-bold text-lg">Total Amount</span>
                      <span className="text-green-400 font-mono font-bold text-2xl">₹{getTotalPrice()}</span>
                    </div>
                  </div>

                  {/* What's Included */}
                  <div className="bg-green-500/10 rounded-lg p-6 border border-green-500/30">
                    <h4 className="text-green-400 font-mono font-bold mb-3">What's Included</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-gray-300 font-mono text-sm">60-minute one-on-one interview</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-gray-300 font-mono text-sm">Detailed written feedback report</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-gray-300 font-mono text-sm">Performance scoring and recommendations</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-gray-300 font-mono text-sm">Bonus drill points based on performance</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-gray-300 font-mono text-sm">Follow-up email with resources</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleBooking}
                    disabled={isBooking}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-black font-mono font-bold text-lg py-6"
                  >
                    {isBooking ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                        Processing Booking...
                      </div>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 mr-2" />
                        Confirm & Pay ₹{getTotalPrice()}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setBookingStep(Math.max(1, bookingStep - 1))}
                disabled={bookingStep === 1}
                className="bg-black/20 border-gray-600 text-white hover:border-green-500 font-mono"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {bookingStep < 5 && (
                <Button
                  onClick={() => setBookingStep(bookingStep + 1)}
                  disabled={!canProceedToNext()}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-mono font-bold"
                >
                  Next Step
                  <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                </Button>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress */}
            <Card className="bg-black/40 border-gray-500/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white font-mono">Booking Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
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

            {/* Selected Expert Preview */}
            {selectedExpertData && (
              <Card className="bg-black/40 border-green-500/20 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white font-mono">Selected Expert</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3 mb-3">
                    <img
                      src={selectedExpertData.avatar || "/placeholder.svg"}
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
  )
}
