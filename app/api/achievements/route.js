import { NextResponse } from "next/server"
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

// Calculate achievements for a user
export async function POST(request) {
  try {
    const body = await request.json()
    const { userId, action, data } = body

    console.log('Calculating achievements for user:', userId, 'action:', action)

    if (!userId || !action) {
      return NextResponse.json({ 
        success: false, 
        error: "User ID and action are required" 
      }, { status: 400 })
    }

    // Get user data
    const userRef = doc(db, 'users', userId)
    const userDoc = await getDoc(userRef)
    
    if (!userDoc.exists()) {
      return NextResponse.json({ 
        success: false, 
        error: "User not found" 
      }, { status: 404 })
    }

    const userData = userDoc.data()
    const currentAchievements = userData.achievements || []
    const newAchievements = []

    // Calculate achievements based on action
    switch (action) {
      case 'interview_taken':
        newAchievements.push(...calculateInterviewAchievements(userData, 'taken'))
        break
      case 'interview_given':
        newAchievements.push(...calculateInterviewAchievements(userData, 'given'))
        break
      case 'drill_points_earned':
        newAchievements.push(...calculateDrillPointAchievements(userData))
        break
      case 'feedback_received':
        newAchievements.push(...calculateFeedbackAchievements(userData, data))
        break
      case 'streak_updated':
        newAchievements.push(...calculateStreakAchievements(userData))
        break
      case 'profile_updated':
        newAchievements.push(...calculateProfileAchievements(userData))
        break
      default:
        // Calculate all achievements
        newAchievements.push(
          ...calculateInterviewAchievements(userData, 'taken'),
          ...calculateInterviewAchievements(userData, 'given'),
          ...calculateDrillPointAchievements(userData),
          ...calculateFeedbackAchievements(userData),
          ...calculateStreakAchievements(userData),
          ...calculateProfileAchievements(userData),
          ...calculateSpecialAchievements(userData)
        )
    }

    // Filter out achievements user already has
    const uniqueNewAchievements = newAchievements.filter(
      achievement => !currentAchievements.some(existing => existing.id === achievement.id)
    )

    if (uniqueNewAchievements.length > 0) {
      // Update user with new achievements
      const updatedAchievements = [...currentAchievements, ...uniqueNewAchievements]
      await updateDoc(userRef, {
        achievements: updatedAchievements,
        updatedAt: new Date().toISOString()
      })

      console.log(`Awarded ${uniqueNewAchievements.length} new achievements to user ${userId}`)
    }

    return NextResponse.json({
      success: true,
      newAchievements: uniqueNewAchievements,
      totalAchievements: (currentAchievements.length + uniqueNewAchievements.length),
      message: uniqueNewAchievements.length > 0 ? "New achievements awarded!" : "No new achievements"
    })

  } catch (error) {
    console.error('Error calculating achievements:', error)
    return NextResponse.json({ 
      success: false, 
      error: "Failed to calculate achievements",
      details: error.message 
    }, { status: 500 })
  }
}

// Get achievements for a user
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    console.log('Fetching achievements for user:', userId)

    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        error: "User ID is required" 
      }, { status: 400 })
    }

    const userRef = doc(db, 'users', userId)
    const userDoc = await getDoc(userRef)
    
    if (!userDoc.exists()) {
      return NextResponse.json({ 
        success: false, 
        error: "User not found" 
      }, { status: 404 })
    }

    const userData = userDoc.data()
    const achievements = userData.achievements || []

    return NextResponse.json({
      success: true,
      achievements,
      totalAchievements: achievements.length,
      message: "Achievements retrieved successfully"
    })

  } catch (error) {
    console.error('Error retrieving achievements:', error)
    return NextResponse.json({ 
      success: false, 
      error: "Failed to retrieve achievements",
      details: error.message 
    }, { status: 500 })
  }
}

// Helper functions to calculate different types of achievements
function calculateInterviewAchievements(userData, type) {
  const achievements = []
  const interviewsTaken = userData.interviewsTaken || 0
  const interviewsGiven = userData.interviewsGiven || 0
  const totalInterviews = interviewsTaken + interviewsGiven

  if (type === 'taken') {
    if (interviewsTaken === 1) {
      achievements.push({
        id: 'first_interview',
        name: 'First Steps',
        description: 'Completed your first interview',
        icon: '🎯',
        category: 'interview',
        rarity: 'common',
        unlockedAt: new Date().toISOString()
      })
    }
    if (interviewsTaken >= 5) {
      achievements.push({
        id: 'interview_enthusiast',
        name: 'Interview Enthusiast',
        description: 'Completed 5 interviews',
        icon: '📚',
        category: 'interview',
        rarity: 'uncommon',
        unlockedAt: new Date().toISOString()
      })
    }
    if (interviewsTaken >= 10) {
      achievements.push({
        id: 'interview_veteran',
        name: 'Interview Veteran',
        description: 'Completed 10 interviews',
        icon: '🏆',
        category: 'interview',
        rarity: 'rare',
        unlockedAt: new Date().toISOString()
      })
    }
    if (interviewsTaken >= 25) {
      achievements.push({
        id: 'interview_master',
        name: 'Interview Master',
        description: 'Completed 25 interviews',
        icon: '👑',
        category: 'interview',
        rarity: 'epic',
        unlockedAt: new Date().toISOString()
      })
    }
  }

  if (type === 'given') {
    if (interviewsGiven === 1) {
      achievements.push({
        id: 'first_mentor',
        name: 'First Mentor',
        description: 'Conducted your first interview',
        icon: '🤝',
        category: 'mentoring',
        rarity: 'common',
        unlockedAt: new Date().toISOString()
      })
    }
    if (interviewsGiven >= 5) {
      achievements.push({
        id: 'helpful_mentor',
        name: 'Helpful Mentor',
        description: 'Conducted 5 interviews',
        icon: '👨‍🏫',
        category: 'mentoring',
        rarity: 'uncommon',
        unlockedAt: new Date().toISOString()
      })
    }
    if (interviewsGiven >= 10) {
      achievements.push({
        id: 'expert_mentor',
        name: 'Expert Mentor',
        description: 'Conducted 10 interviews',
        icon: '🎓',
        category: 'mentoring',
        rarity: 'rare',
        unlockedAt: new Date().toISOString()
      })
    }
  }

  // Combined achievements
  if (totalInterviews >= 10) {
    achievements.push({
      id: 'active_member',
      name: 'Active Member',
      description: 'Total of 10 interviews',
      icon: '⭐',
      category: 'community',
      rarity: 'uncommon',
      unlockedAt: new Date().toISOString()
    })
  }
  if (totalInterviews >= 20) {
    achievements.push({
      id: 'community_pillar',
      name: 'Community Pillar',
      description: 'Total of 20 interviews',
      icon: '🏛️',
      category: 'community',
      rarity: 'rare',
      unlockedAt: new Date().toISOString()
    })
  }
  if (totalInterviews >= 50) {
    achievements.push({
      id: 'legendary_member',
      name: 'Legendary Member',
      description: 'Total of 50 interviews',
      icon: '🌟',
      category: 'community',
      rarity: 'legendary',
      unlockedAt: new Date().toISOString()
    })
  }

  return achievements
}

function calculateDrillPointAchievements(userData) {
  const achievements = []
  const drillPoints = userData.drillPoints || 0

  if (drillPoints >= 100) {
    achievements.push({
      id: 'drill_novice',
      name: 'Drill Novice',
      description: 'Earned 100 drill points',
      icon: '🥉',
      category: 'drill_points',
      rarity: 'common',
      unlockedAt: new Date().toISOString()
    })
  }
  if (drillPoints >= 500) {
    achievements.push({
      id: 'drill_expert',
      name: 'Drill Expert',
      description: 'Earned 500 drill points',
      icon: '🥇',
      category: 'drill_points',
      rarity: 'uncommon',
      unlockedAt: new Date().toISOString()
    })
  }
  if (drillPoints >= 1000) {
    achievements.push({
      id: 'drill_master',
      name: 'Drill Master',
      description: 'Earned 1000 drill points',
      icon: '🏆',
      category: 'drill_points',
      rarity: 'rare',
      unlockedAt: new Date().toISOString()
    })
  }
  if (drillPoints >= 2500) {
    achievements.push({
      id: 'drill_legend',
      name: 'Drill Legend',
      description: 'Earned 2500 drill points',
      icon: '👑',
      category: 'drill_points',
      rarity: 'epic',
      unlockedAt: new Date().toISOString()
    })
  }
  if (drillPoints >= 5000) {
    achievements.push({
      id: 'drill_god',
      name: 'Drill God',
      description: 'Earned 5000 drill points',
      icon: '⚡',
      category: 'drill_points',
      rarity: 'legendary',
      unlockedAt: new Date().toISOString()
    })
  }

  return achievements
}

function calculateFeedbackAchievements(userData, feedbackData = null) {
  const achievements = []
  const feedbackStats = userData.feedbackStats || {}
  const averageRating = feedbackStats.averageRating || 0
  const totalFeedback = feedbackStats.totalFeedback || 0

  if (totalFeedback >= 1) {
    achievements.push({
      id: 'first_review',
      name: 'First Review',
      description: 'Received your first feedback',
      icon: '📝',
      category: 'feedback',
      rarity: 'common',
      unlockedAt: new Date().toISOString()
    })
  }
  if (totalFeedback >= 5) {
    achievements.push({
      id: 'well_reviewed',
      name: 'Well Reviewed',
      description: 'Received 5 feedback reviews',
      icon: '📊',
      category: 'feedback',
      rarity: 'uncommon',
      unlockedAt: new Date().toISOString()
    })
  }
  if (averageRating >= 4.5 && totalFeedback >= 3) {
    achievements.push({
      id: 'high_performer',
      name: 'High Performer',
      description: 'Maintained 4.5+ rating with 3+ reviews',
      icon: '⭐',
      category: 'performance',
      rarity: 'rare',
      unlockedAt: new Date().toISOString()
    })
  }
  if (averageRating >= 4.8 && totalFeedback >= 5) {
    achievements.push({
      id: 'excellent_performer',
      name: 'Excellent Performer',
      description: 'Maintained 4.8+ rating with 5+ reviews',
      icon: '🏅',
      category: 'performance',
      rarity: 'epic',
      unlockedAt: new Date().toISOString()
    })
  }
  if (averageRating >= 5.0 && totalFeedback >= 10) {
    achievements.push({
      id: 'perfect_performer',
      name: 'Perfect Performer',
      description: 'Maintained perfect rating with 10+ reviews',
      icon: '💎',
      category: 'performance',
      rarity: 'legendary',
      unlockedAt: new Date().toISOString()
    })
  }

  return achievements
}

function calculateStreakAchievements(userData) {
  const achievements = []
  const currentStreak = userData.currentStreak || 0

  if (currentStreak >= 3) {
    achievements.push({
      id: 'consistent_learner',
      name: 'Consistent Learner',
      description: '3-day activity streak',
      icon: '🔥',
      category: 'streak',
      rarity: 'common',
      unlockedAt: new Date().toISOString()
    })
  }
  if (currentStreak >= 7) {
    achievements.push({
      id: 'dedicated_learner',
      name: 'Dedicated Learner',
      description: '7-day activity streak',
      icon: '🔥🔥',
      category: 'streak',
      rarity: 'uncommon',
      unlockedAt: new Date().toISOString()
    })
  }
  if (currentStreak >= 30) {
    achievements.push({
      id: 'unstoppable_learner',
      name: 'Unstoppable Learner',
      description: '30-day activity streak',
      icon: '🔥🔥🔥',
      category: 'streak',
      rarity: 'epic',
      unlockedAt: new Date().toISOString()
    })
  }

  return achievements
}

function calculateProfileAchievements(userData) {
  const achievements = []
  const hasBio = userData.bio && userData.bio.length > 0
  const hasLocation = userData.location && userData.location.length > 0
  const hasCompany = userData.company && userData.company.length > 0
  const hasSkills = userData.skills && userData.skills.length > 0

  if (hasBio && hasLocation && hasCompany) {
    achievements.push({
      id: 'complete_profile',
      name: 'Complete Profile',
      description: 'Filled out bio, location, and company',
      icon: '📋',
      category: 'profile',
      rarity: 'common',
      unlockedAt: new Date().toISOString()
    })
  }
  if (hasSkills && userData.skills.length >= 5) {
    achievements.push({
      id: 'skillful_developer',
      name: 'Skillful Developer',
      description: 'Added 5+ skills to profile',
      icon: '🛠️',
      category: 'profile',
      rarity: 'uncommon',
      unlockedAt: new Date().toISOString()
    })
  }

  return achievements
}

function calculateSpecialAchievements(userData) {
  const achievements = []
  const interviewsTaken = userData.interviewsTaken || 0
  const interviewsGiven = userData.interviewsGiven || 0
  const drillPoints = userData.drillPoints || 0
  const feedbackStats = userData.feedbackStats || {}
  const averageRating = feedbackStats.averageRating || 0

  // Balanced achiever - both taking and giving interviews
  if (interviewsTaken >= 5 && interviewsGiven >= 5) {
    achievements.push({
      id: 'balanced_achiever',
      name: 'Balanced Achiever',
      description: 'Both taken and given 5+ interviews',
      icon: '⚖️',
      category: 'special',
      rarity: 'rare',
      unlockedAt: new Date().toISOString()
    })
  }

  // High performer with drill points
  if (drillPoints >= 1000 && averageRating >= 4.5) {
    achievements.push({
      id: 'elite_performer',
      name: 'Elite Performer',
      description: '1000+ drill points with 4.5+ rating',
      icon: '💎',
      category: 'special',
      rarity: 'epic',
      unlockedAt: new Date().toISOString()
    })
  }

  // Community leader
  if (interviewsGiven >= 10 && averageRating >= 4.8) {
    achievements.push({
      id: 'community_leader',
      name: 'Community Leader',
      description: '10+ interviews given with 4.8+ rating',
      icon: '👑',
      category: 'special',
      rarity: 'legendary',
      unlockedAt: new Date().toISOString()
    })
  }

  return achievements
} 