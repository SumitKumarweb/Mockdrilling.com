"use client"

import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"

export default function DebugAuth() {
  const { user, userProfile, loading, logout } = useAuth()

  const checkNetwork = async () => {
    try {
      const response = await fetch('/api/rankings')
      console.log('Network check successful:', response.status)
    } catch (error) {
      console.error('Network check failed:', error)
    }
  }

  if (process.env.NODE_ENV === 'production') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 backdrop-blur-xl border border-gray-600 rounded-lg p-4 text-white text-xs font-mono max-w-xs z-50">
      <div className="space-y-2">
        <h3 className="font-bold text-green-400">🔧 Debug Panel</h3>
        <p>Loading: {loading ? 'Yes' : 'No'}</p>
        <p>User: {user ? user.email : 'Not logged in'}</p>
        <p>UID: {user?.uid || 'N/A'}</p>
        {userProfile && (
          <>
            <p>Name: {userProfile.name || 'Not set'}</p>
            <p>Drill Points: {userProfile.drillPoints || 0}</p>
                    <p>Interviews Given: {userProfile.interviewsGiven || 0}</p>
        <p>Interviews Taken: {userProfile.interviewsTaken || 0}</p>
            <p>Experience: {userProfile.experience || 'Not set'}</p>
          </>
        )}
        <p className="text-yellow-400 text-xs">Firestore: Disabled (Auth Only)</p>
        <button
          onClick={checkNetwork}
          className="bg-blue-500 px-2 py-1 rounded text-xs"
        >
          Check Network
        </button>
        <p className="text-green-400 text-xs mt-2">✅ Auth Working</p>
        <p className="text-yellow-400 text-xs">⚠️ Firestore: Configure Rules</p>
        {user && (
          <Button
            onClick={logout}
            size="sm"
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Logout
          </Button>
        )}
      </div>
    </div>
  )
} 