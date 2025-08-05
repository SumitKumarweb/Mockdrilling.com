import { NextResponse } from "next/server"
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export async function GET(request, { params }) {
  try {
    const { userId } = params

    console.log('Fetching profile for user:', userId)

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 })
    }

    // Get user document from Firestore
    const userDoc = await getDoc(doc(db, 'users', userId))

    if (!userDoc.exists()) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    const userData = userDoc.data()
    
    // Format the user data for the profile page
    const userProfile = {
      uid: userId,
      displayName: userData.displayName || "Anonymous User",
      email: userData.email || "",
      photoURL: userData.photoURL || "",
      drillPoints: userData.drillPoints || 0,
      interviewsTaken: userData.interviewsTaken || 0,
      interviewsGiven: userData.interviewsGiven || 0,
      level: userData.level || "Beginner",
      createdAt: userData.createdAt || userData.updatedAt || new Date().toISOString(),
      updatedAt: userData.updatedAt || new Date().toISOString(),
      // Additional profile fields if they exist
      bio: userData.bio || "",
      location: userData.location || "",
      company: userData.company || "",
      position: userData.position || "",
      experience: userData.experience || "",
      skills: userData.skills || [],
      github: userData.github || "",
      linkedin: userData.linkedin || "",
      website: userData.website || "",
      // Feedback statistics
      feedbackStats: userData.feedbackStats || null,
    }

    console.log('User profile retrieved successfully:', userProfile.displayName)

    return NextResponse.json({
      success: true,
      user: userProfile,
      message: "User profile retrieved successfully"
    })

  } catch (error) {
    console.error('Error retrieving user profile:', error)
    return NextResponse.json({ 
      success: false, 
      error: "Failed to retrieve user profile",
      details: error.message 
    }, { status: 500 })
  }
} 