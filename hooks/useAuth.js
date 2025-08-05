"use client"

import { useState, useEffect, createContext, useContext } from 'react'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  GithubAuthProvider
} from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load user profile data from Firestore
  const loadUserProfile = async (uid) => {
    try {
      console.log('Loading user profile for UID:', uid)
      const userDoc = await getDoc(doc(db, 'users', uid))
      
      if (userDoc.exists()) {
        const profileData = userDoc.data()
        console.log('User profile loaded successfully:', profileData)
        setUserProfile(profileData)
        return profileData
      } else {
        console.log('User profile does not exist, creating default profile')
        // Create default profile if doesn't exist
        const defaultProfile = {
          name: user?.displayName || '',
          email: user?.email || '',
          phone: '',
          location: '',
          company: '',
          position: '',
          experience: '0',
          bio: '',
          skills: [],
          github: '',
          linkedin: '',
          website: '',
          profilePhoto: '/placeholder.svg?height=120&width=120&text=AD',
          resume: null,
          drillPoints: 1000,
          interviewsTaken: 0,
          interviewsGiven: 0,
          role: 'student',
          privacy: {
            profileVisible: true,
            showEmail: false,
            showPhone: false,
            availableForInterview: true,
          },
          notifications: {
            emailNotifications: true,
            interviewReminders: true,
            feedbackAlerts: true,
            marketingEmails: false,
          },
          createdAt: new Date().toISOString(),
        }
        
        try {
          await setDoc(doc(db, 'users', uid), defaultProfile)
          console.log('Default user profile created successfully')
          setUserProfile(defaultProfile)
          return defaultProfile
        } catch (createError) {
          console.error('Error creating default user profile:', createError)
          // Return a local profile if Firestore creation fails
          setUserProfile(defaultProfile)
          return defaultProfile
        }
      }
    } catch (error) {
      console.error('Error loading user profile:', error)
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      })
      
      // Return a basic profile if Firestore is unavailable
      const fallbackProfile = {
        name: user?.displayName || '',
        email: user?.email || '',
        drillPoints: 1000,
        interviewsTaken: 0,
        interviewsGiven: 0,
      }
      setUserProfile(fallbackProfile)
      return fallbackProfile
    }
  }

  // Update user profile data
  const updateUserProfile = async (updatedData) => {
    if (!user?.uid) return false

    try {
      console.log('Updating user profile for UID:', user.uid, 'with data:', updatedData)
      const userData = {
        ...updatedData,
        updatedAt: new Date().toISOString(),
      }

      await updateDoc(doc(db, 'users', user.uid), userData)
      console.log('User profile updated successfully in Firestore')
      
      // Update local state
      setUserProfile(prev => ({
        ...prev,
        ...userData
      }))

      return true
    } catch (error) {
      console.error('Error updating user profile:', error)
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      })
      
      // Update local state even if Firestore fails
      setUserProfile(prev => ({
        ...prev,
        ...updatedData
      }))
      
      return false
    }
  }

  // Refresh user profile data
  const refreshUserProfile = async () => {
    if (user?.uid) {
      await loadUserProfile(user.uid)
    }
  }

  // Update drill points
  const updateDrillPoints = async (pointsChange, reason = 'interview') => {
    if (!user?.uid) return false

    try {
      console.log('Updating drill points for UID:', user.uid, 'change:', pointsChange, 'reason:', reason)
      
      const currentPoints = userProfile?.drillPoints || 0
      const newPoints = Math.max(0, currentPoints + pointsChange) // Prevent negative points
      
      const userData = {
        drillPoints: newPoints,
        updatedAt: new Date().toISOString(),
      }

      await updateDoc(doc(db, 'users', user.uid), userData)
      console.log('Drill points updated successfully in Firestore:', newPoints)
      
      // Update local state
      setUserProfile(prev => ({
        ...prev,
        drillPoints: newPoints
      }))

      return { success: true, newPoints, pointsChange }
    } catch (error) {
      console.error('Error updating drill points:', error)
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      })
      
      // Update local state even if Firestore fails
      const currentPoints = userProfile?.drillPoints || 0
      const newPoints = Math.max(0, currentPoints + pointsChange)
      setUserProfile(prev => ({
        ...prev,
        drillPoints: newPoints
      }))
      
      return { success: false, newPoints, pointsChange, error: error.message }
    }
  }

  // Update interview counts
  const updateInterviewCounts = async (type, count = 1) => {
    if (!user?.uid) return false

    try {
      console.log('Updating interview counts for UID:', user.uid, 'type:', type, 'count:', count)
      
      const currentTaken = userProfile?.interviewsTaken || 0
      const currentGiven = userProfile?.interviewsGiven || 0
      
      const userData = {
        interviewsTaken: type === 'taken' ? currentTaken + count : currentTaken,
        interviewsGiven: type === 'given' ? currentGiven + count : currentGiven,
        updatedAt: new Date().toISOString(),
      }

      await updateDoc(doc(db, 'users', user.uid), userData)
      console.log('Interview counts updated successfully in Firestore')
      
      // Update local state
      setUserProfile(prev => ({
        ...prev,
        interviewsTaken: userData.interviewsTaken,
        interviewsGiven: userData.interviewsGiven
      }))

      return { success: true }
    } catch (error) {
      console.error('Error updating interview counts:', error)
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      })
      
      // Update local state even if Firestore fails
      const currentTaken = userProfile?.interviewsTaken || 0
      const currentGiven = userProfile?.interviewsGiven || 0
      setUserProfile(prev => ({
        ...prev,
        interviewsTaken: type === 'taken' ? currentTaken + count : currentTaken,
        interviewsGiven: type === 'given' ? currentGiven + count : currentGiven
      }))
      
      return { success: false, error: error.message }
    }
  }

  const signUp = async (email, password, name) => {
    try {
      console.log('Starting signup process for email:', email)
      const result = await createUserWithEmailAndPassword(auth, email, password)
      console.log('User created successfully, UID:', result.user.uid)
      
      // Create user profile in Firestore
      const userProfile = {
        name: name || '',
        email: email,
        phone: '',
        location: '',
        company: '',
        position: '',
        experience: '0',
        bio: '',
        skills: [],
        github: '',
        linkedin: '',
        website: '',
        profilePhoto: '/placeholder.svg?height=120&width=120&text=AD',
        resume: null,
        drillPoints: 1000,
        interviewsTaken: 0,
        interviewsGiven: 0,
        role: 'student',
        privacy: {
          profileVisible: true,
          showEmail: false,
          showPhone: false,
          availableForInterview: true,
        },
        notifications: {
          emailNotifications: true,
          interviewReminders: true,
          feedbackAlerts: true,
          marketingEmails: false,
        },
        createdAt: new Date().toISOString(),
      }

      try {
        await setDoc(doc(db, 'users', result.user.uid), userProfile)
        console.log('User profile created successfully in Firestore')
        setUserProfile(userProfile)
      } catch (firestoreError) {
        console.error('Error creating user profile in Firestore:', firestoreError)
        console.error('Firestore error details:', {
          code: firestoreError.code,
          message: firestoreError.message
        })
        // Still set the profile locally even if Firestore fails
        setUserProfile(userProfile)
      }
      
      return { success: true, user: result.user }
    } catch (error) {
      console.error('Error in signUp:', error)
      console.error('Signup error details:', {
        code: error.code,
        message: error.message
      })
      return { success: false, error: error.message }
    }
  }

  const signIn = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      return { success: true, user: result.user }
    } catch (error) {
      console.error('Error in signIn:', error)
      return { success: false, error: error.message }
    }
  }

  const signInWithGoogle = async () => {
    try {
      console.log('Starting Google sign-in')
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      console.log('Google sign-in successful, UID:', result.user.uid)
      
      // Check if user profile exists, create if not
      try {
        const userDoc = await getDoc(doc(db, 'users', result.user.uid))
        if (!userDoc.exists()) {
          console.log('Creating user profile for Google sign-in')
          const userProfile = {
            name: result.user.displayName || '',
            email: result.user.email || '',
            phone: '',
            location: '',
            company: '',
            position: '',
            experience: '0',
            bio: '',
            skills: [],
            github: '',
            linkedin: '',
            website: '',
            profilePhoto: result.user.photoURL || '/placeholder.svg?height=120&width=120&text=AD',
            resume: null,
            drillPoints: 1000,
            interviewsTaken: 0,
            interviewsGiven: 0,
            role: 'student',
            privacy: {
              profileVisible: true,
              showEmail: false,
              showPhone: false,
              availableForInterview: true,
            },
            notifications: {
              emailNotifications: true,
              interviewReminders: true,
              feedbackAlerts: true,
              marketingEmails: false,
            },
            createdAt: new Date().toISOString(),
          }
          
          await setDoc(doc(db, 'users', result.user.uid), userProfile)
          console.log('User profile created for Google sign-in')
        }
      } catch (firestoreError) {
        console.error('Error handling user profile for Google sign-in:', firestoreError)
      }
      
      return { success: true, user: result.user }
    } catch (error) {
      console.error('Error in signInWithGoogle:', error)
      console.error('Google sign-in error details:', {
        code: error.code,
        message: error.message
      })
      return { success: false, error: error.message }
    }
  }

  const signInWithGithub = async () => {
    try {
      console.log('Starting GitHub sign-in')
      const provider = new GithubAuthProvider()
      const result = await signInWithPopup(auth, provider)
      console.log('GitHub sign-in successful, UID:', result.user.uid)
      
      // Check if user profile exists, create if not
      try {
        const userDoc = await getDoc(doc(db, 'users', result.user.uid))
        if (!userDoc.exists()) {
          console.log('Creating user profile for GitHub sign-in')
          const userProfile = {
            name: result.user.displayName || '',
            email: result.user.email || '',
            phone: '',
            location: '',
            company: '',
            position: '',
            experience: '0',
            bio: '',
            skills: [],
            github: '',
            linkedin: '',
            website: '',
            profilePhoto: result.user.photoURL || '/placeholder.svg?height=120&width=120&text=AD',
            resume: null,
            drillPoints: 1000,
            interviewsTaken: 0,
            interviewsGiven: 0,
            role: 'student',
            privacy: {
              profileVisible: true,
              showEmail: false,
              showPhone: false,
              availableForInterview: true,
            },
            notifications: {
              emailNotifications: true,
              interviewReminders: true,
              feedbackAlerts: true,
              marketingEmails: false,
            },
            createdAt: new Date().toISOString(),
          }
          
          await setDoc(doc(db, 'users', result.user.uid), userProfile)
          console.log('User profile created for GitHub sign-in')
        }
      } catch (firestoreError) {
        console.error('Error handling user profile for GitHub sign-in:', firestoreError)
      }
      
      return { success: true, user: result.user }
    } catch (error) {
      console.error('Error in signInWithGithub:', error)
      console.error('GitHub sign-in error details:', {
        code: error.code,
        message: error.message
      })
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      setUserProfile(null)
      return { success: true }
    } catch (error) {
      console.error('Error in logout:', error)
      return { success: false, error: error.message }
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      
      if (user) {
        // Load user profile when user is authenticated
        await loadUserProfile(user.uid)
      } else {
        setUserProfile(null)
      }
      
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithGithub,
    logout,
    updateUserProfile,
    refreshUserProfile,
    updateDrillPoints,
    updateInterviewCounts,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 