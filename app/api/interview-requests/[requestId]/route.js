import { NextResponse } from "next/server"
import { doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

// Update interview request status
export async function PATCH(request, { params }) {
  try {
    const { requestId } = params
    const { status, assignedTo, adminNotes } = await request.json()

    if (!requestId || !status) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const requestRef = doc(db, 'interviewRequests', requestId)
    const requestDoc = await getDoc(requestRef)
    
    if (!requestDoc.exists()) {
      return NextResponse.json({ success: false, error: "Request not found" }, { status: 404 })
    }

    const updateData = {
      status,
      updatedAt: new Date().toISOString(),
    }

    if (assignedTo) {
      updateData.assignedTo = assignedTo
    }

    if (adminNotes) {
      updateData.adminNotes = adminNotes
    }

    await updateDoc(requestRef, updateData)
    
    return NextResponse.json({
      success: true,
      message: "Request updated successfully"
    })
  } catch (error) {
    console.error("Error updating interview request:", error)
    return NextResponse.json({ success: false, error: "Failed to update request" }, { status: 500 })
  }
}

// Delete interview request
export async function DELETE(request, { params }) {
  try {
    const { requestId } = params

    if (!requestId) {
      return NextResponse.json({ success: false, error: "Missing request ID" }, { status: 400 })
    }

    await deleteDoc(doc(db, 'interviewRequests', requestId))
    
    return NextResponse.json({
      success: true,
      message: "Request deleted successfully"
    })
  } catch (error) {
    console.error("Error deleting interview request:", error)
    return NextResponse.json({ success: false, error: "Failed to delete request" }, { status: 500 })
  }
}
