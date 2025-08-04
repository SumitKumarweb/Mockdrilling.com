"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Coins, CreditCard, Smartphone, Wallet, Gift, Star, Zap, Crown, Check, X } from "lucide-react"

export default function DrillPointsModal({ isOpen, onClose }) {
  const [selectedPlan, setSelectedPlan] = useState("professional")
  const [paymentMethod, setPaymentMethod] = useState("upi")

  const plans = [
    {
      id: "starter",
      name: "Starter Pack",
      points: 1000,
      price: 299,
      originalPrice: 399,
      discount: 25,
      popular: false,
      features: ["1000 Drill Points", "Take 8 Interviews", "Basic Support", "Valid for 3 months"],
      icon: Zap,
      color: "blue",
    },
    {
      id: "professional",
      name: "Professional",
      points: 2500,
      price: 699,
      originalPrice: 899,
      discount: 22,
      popular: true,
      features: [
        "2500 Drill Points",
        "Take 20 Interviews",
        "Priority Support",
        "Valid for 6 months",
        "Bonus 200 points",
      ],
      icon: Crown,
      color: "green",
    },
    {
      id: "expert",
      name: "Expert Pack",
      points: 5000,
      price: 1299,
      originalPrice: 1699,
      discount: 24,
      popular: false,
      features: ["5000 Drill Points", "Take 40+ Interviews", "Premium Support", "Valid for 1 year", "Bonus 500 points"],
      icon: Star,
      color: "purple",
    },
  ]

  const paymentMethods = [
    { id: "upi", name: "UPI", icon: Smartphone, description: "Pay with any UPI app" },
    { id: "card", name: "Credit/Debit Card", icon: CreditCard, description: "Visa, Mastercard, RuPay" },
    { id: "wallet", name: "Digital Wallet", icon: Wallet, description: "Paytm, PhonePe, GPay" },
  ]

  const handlePurchase = () => {
    // In real implementation, integrate with payment gateway
    alert(`Processing payment for ${plans.find((p) => p.id === selectedPlan)?.name} via ${paymentMethod}`)
    onClose()
  }

  if (!isOpen) return null

  const selectedPlanData = plans.find((p) => p.id === selectedPlan)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 via-gray-900 to-black border-green-500/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white font-mono flex items-center">
            <Coins className="w-6 h-6 mr-2 text-yellow-400" />
            Buy Drill Points
          </DialogTitle>
          <DialogDescription className="text-gray-400 font-mono">
            Choose a plan that fits your interview preparation needs
          </DialogDescription>
        </DialogHeader>

        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          {/* Plans */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-bold text-white font-mono mb-4">Select a Plan</h3>
            <div className="grid gap-4">
              {plans.map((plan) => {
                const IconComponent = plan.icon
                return (
                  <Card
                    key={plan.id}
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedPlan === plan.id
                        ? `bg-${plan.color}-500/10 border-${plan.color}-500/50`
                        : "bg-black/40 border-gray-600/30 hover:border-gray-500/50"
                    } ${plan.popular ? "ring-2 ring-green-500/30" : ""}`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-10 h-10 bg-${plan.color}-500/20 rounded-lg flex items-center justify-center`}
                          >
                            <IconComponent className={`w-5 h-5 text-${plan.color}-400`} />
                          </div>
                          <div>
                            <h4 className="text-white font-mono font-bold">{plan.name}</h4>
                            <p className="text-gray-400 text-sm font-mono">{plan.points} Drill Points</p>
                          </div>
                        </div>
                        {plan.popular && (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 font-mono">
                            Most Popular
                          </Badge>
                        )}
                        {selectedPlan === plan.id && (
                          <div className={`w-6 h-6 bg-${plan.color}-500 rounded-full flex items-center justify-center`}>
                            <Check className="w-4 h-4 text-black" />
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 mb-4">
                        <span className="text-2xl font-bold text-white font-mono">₹{plan.price}</span>
                        <span className="text-gray-400 line-through font-mono">₹{plan.originalPrice}</span>
                        <Badge variant="secondary" className="bg-red-500/20 text-red-400 border-red-500/30 font-mono">
                          {plan.discount}% OFF
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        {plan.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Check className="w-4 h-4 text-green-400" />
                            <span className="text-gray-300 text-sm font-mono">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Payment & Summary */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card className="bg-black/40 border-gray-600/30">
              <CardHeader>
                <CardTitle className="text-white font-mono">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400 font-mono">{selectedPlanData?.name}</span>
                  <span className="text-white font-mono">₹{selectedPlanData?.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-mono">Drill Points</span>
                  <span className="text-yellow-400 font-mono">{selectedPlanData?.points}</span>
                </div>
                <div className="flex justify-between text-green-400">
                  <span className="font-mono">Discount</span>
                  <span className="font-mono">-₹{selectedPlanData?.originalPrice - selectedPlanData?.price}</span>
                </div>
                <Separator className="bg-gray-600" />
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-white font-mono">Total</span>
                  <span className="text-green-400 font-mono">₹{selectedPlanData?.price}</span>
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card className="bg-black/40 border-gray-600/30">
              <CardHeader>
                <CardTitle className="text-white font-mono">Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {paymentMethods.map((method) => {
                  const IconComponent = method.icon
                  return (
                    <div
                      key={method.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        paymentMethod === method.id
                          ? "border-green-500/50 bg-green-500/10"
                          : "border-gray-600/30 hover:border-gray-500/50"
                      }`}
                      onClick={() => setPaymentMethod(method.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <IconComponent className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-white font-mono text-sm">{method.name}</p>
                            <p className="text-gray-400 text-xs font-mono">{method.description}</p>
                          </div>
                        </div>
                        {paymentMethod === method.id && (
                          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-black" />
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Special Offer */}
            <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Gift className="w-5 h-5 text-yellow-400" />
                  <span className="text-yellow-400 font-mono font-bold">Special Offer!</span>
                </div>
                <p className="text-gray-300 text-sm font-mono">
                  First-time buyers get an extra 10% bonus points on any purchase!
                </p>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handlePurchase}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-black font-mono font-bold"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Complete Purchase
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                className="w-full bg-black/20 border-gray-600 text-white hover:border-red-500 font-mono"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
