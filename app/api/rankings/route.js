import { NextResponse } from "next/server"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const month = searchParams.get("month") || "current"
    const domain = searchParams.get("domain") || "all"
    const limit = Number.parseInt(searchParams.get("limit")) || 50

    // In a real implementation, you would:
    // 1. Query database for rankings based on filters
    // 2. Calculate scores based on interview performance
    // 3. Handle pagination
    // 4. Return sorted results

    // Mock rankings data generation
    const generateMockRankings = (count) => {
      const companies = [
        "Google",
        "Microsoft",
        "Amazon",
        "Netflix",
        "Meta",
        "Apple",
        "Uber",
        "Airbnb",
        "Spotify",
        "TCS",
        "Infosys",
        "Wipro",
      ]
      const domains = ["Frontend", "Backend", "DSA", "System Design"]
      const names = [
        "Priya Sharma",
        "Rahul Kumar",
        "Anita Desai",
        "Vikram Singh",
        "Sneha Patel",
        "Arjun Reddy",
        "Kavya Nair",
        "Rohit Gupta",
        "Meera Joshi",
        "Aditya Verma",
        "Pooja Agarwal",
        "Sanjay Yadav",
        "Riya Kapoor",
        "Karan Malhotra",
        "Divya Sinha",
      ]

      return Array.from({ length: count }, (_, i) => {
        const baseScore = 98 - i * 0.3
        const name = i < names.length ? names[i] : `User ${i + 1}`

        return {
          rank: i + 1,
          userId: `user_${i + 1}`,
          name,
          avatar: `/placeholder.svg?height=40&width=40&text=${name
            .split(" ")
            .map((n) => n[0])
            .join("")}`,
          company: companies[Math.floor(Math.random() * companies.length)],
          score: Math.round(baseScore * 10) / 10,
          interviewsGiven: Math.floor(Math.random() * 40) + 10,
          interviewsTaken: Math.floor(Math.random() * 20) + 5,
          drillPoints: Math.floor(4200 - i * 80),
          change: Math.floor(Math.random() * 7) - 3, // -3 to +3
          domain: domains[Math.floor(Math.random() * domains.length)],
          monthlyInterviews: Math.floor(Math.random() * 15) + 5,
          successRate: Math.round((95 - i * 0.2) * 10) / 10,
        }
      })
    }

    const rankings = generateMockRankings(limit)

    // Filter by domain if specified
    const filteredRankings =
      domain === "all" ? rankings : rankings.filter((user) => user.domain.toLowerCase() === domain.toLowerCase())

    // Mock current user data
    const currentUser = {
      rank: 23,
      userId: "current_user",
      name: "Alex Developer",
      avatar: "/placeholder.svg?height=40&width=40&text=AD",
      company: "Tech Corp",
      score: 87.5,
      interviewsGiven: 18,
      interviewsTaken: 12,
      drillPoints: 1250,
      change: 5,
      domain: "Frontend",
      monthlyInterviews: 8,
      successRate: 89.2,
    }

    // Mock statistics
    const stats = {
      totalUsers: 1456,
      totalInterviews: 2988,
      avgScore: 84.2,
      topScore: 98.5,
      domainStats: {
        frontend: { interviews: 1245, avgScore: 85.1 },
        backend: { interviews: 987, avgScore: 83.8 },
        dsa: { interviews: 756, avgScore: 82.9 },
      },
    }

    return NextResponse.json({
      success: true,
      data: {
        rankings: filteredRankings,
        currentUser,
        stats,
        filters: {
          month,
          domain,
          limit,
        },
      },
    })
  } catch (error) {
    console.error("Error fetching rankings:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch rankings" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { userId, interviewData } = body

    // In a real implementation, you would:
    // 1. Validate the interview data
    // 2. Update user's performance metrics
    // 3. Recalculate rankings
    // 4. Update leaderboard positions

    // Mock interview data validation
    if (!userId || !interviewData) {
      return NextResponse.json({ success: false, error: "Missing required data" }, { status: 400 })
    }

    const { domain, score, type, duration } = interviewData

    if (!domain || score === undefined || !type) {
      return NextResponse.json({ success: false, error: "Invalid interview data" }, { status: 400 })
    }

    if (score < 0 || score > 100) {
      return NextResponse.json({ success: false, error: "Score must be between 0 and 100" }, { status: 400 })
    }

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Mock updated ranking calculation
    const updatedRanking = {
      userId,
      previousRank: 25,
      newRank: 23,
      scoreChange: +2.5,
      pointsEarned: type === "given" ? 100 : -120,
    }

    return NextResponse.json({
      success: true,
      message: "Rankings updated successfully",
      data: updatedRanking,
    })
  } catch (error) {
    console.error("Error updating rankings:", error)
    return NextResponse.json({ success: false, error: "Failed to update rankings" }, { status: 500 })
  }
}
