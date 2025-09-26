import { NextResponse } from "next/server"
import { collection, addDoc, getDocs, query, orderBy, where, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

// Create new interview request
export async function POST(request) {
  try {
    const { userId, userName, userEmail, interviewType, domain, message, status = 'pending' } = await request.json()

    if (!userId || !interviewType || !domain) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const requestData = {
      userId,
      userName: userName || 'Unknown User',
      userEmail: userEmail || 'No Email',
      interviewType, // 'take' or 'give'
      domain,
      message: message || '',
      status, // 'pending', 'approved', 'rejected', 'assigned'
      assignedTo: null, // Will be set when admin assigns
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const docRef = await addDoc(collection(db, 'interviewRequests'), requestData)
    
    return NextResponse.json({
      success: true,
      requestId: docRef.id,
      message: "Interview request submitted successfully"
    })
  } catch (error) {
    console.error("Error creating interview request:", error)
    return NextResponse.json({ success: false, error: "Failed to create request" }, { status: 500 })
  }
}

// Get all interview requests (for admin)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'all'
    
    let q = query(collection(db, 'interviewRequests'), orderBy('createdAt', 'desc'))
    
    if (status !== 'all') {
      q = query(collection(db, 'interviewRequests'), where('status', '==', status), orderBy('createdAt', 'desc'))
    }
    
    const snapshot = await getDocs(q)
    const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    
    return NextResponse.json({
      success: true,
      requests
    })
  } catch (error) {
    console.error("Error fetching interview requests:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch requests" }, { status: 500 })
  }
}
