import { NextResponse } from "next/server"
import { doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

// Update interview request status
export async function PATCH(request, { params }) {
  try {
    const { requestId } = params
    const { status, assignedTo, adminNotes, interviewDate, interviewTime, meetingLink } = await request.json()

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

    if (interviewDate) {
      updateData.interviewDate = interviewDate
    }
    if (interviewTime) {
      updateData.interviewTime = interviewTime
    }
    if (meetingLink) {
      updateData.meetingLink = meetingLink
    }

    await updateDoc(requestRef, updateData)

    // Send notifications to requester (and assignee if provided)
    try {
      const baseUrl = new URL('/api/notifications', request.url)
      const reqData = requestDoc.data()

      // Determine type/title/message for requester
      const type =
        status === 'approved' ? 'request_approved' :
        status === 'rejected' ? 'request_rejected' :
        'interview_scheduled'

      const title =
        status === 'approved' ? 'Interview Request Approved!' :
        status === 'rejected' ? 'Interview Request Rejected' :
        'Interview Scheduled!'

      const message =
        status === 'approved'
          ? 'Your interview request has been approved. Admin will schedule your interview soon.'
          : status === 'rejected'
          ? `Your interview request has been rejected. Reason: ${adminNotes || 'No reason provided'}`
          : `Your interview has been scheduled for ${interviewDate} at ${interviewTime}`

      await fetch(baseUrl.toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: reqData.userId,
          type,
          title,
          message,
          data: {
            requestId,
            interviewDate: interviewDate || reqData.interviewDate || null,
            interviewTime: interviewTime || reqData.interviewTime || null,
            meetingLink: meetingLink || reqData.meetingLink || null,
            adminNotes: adminNotes || reqData.adminNotes || null,
            assignedTo: assignedTo || reqData.assignedTo || null,
            domain: reqData.domain,
            interviewType: reqData.interviewType,
          },
        }),
      })

      // Notify assignee when assigned
      if ((assignedTo || reqData.assignedTo) && status === 'assigned') {
        await fetch(baseUrl.toString(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: assignedTo || reqData.assignedTo,
            type: 'interview_assigned',
            title: 'Interview Assignment',
            message: `You have been assigned to interview ${reqData.userName} on ${interviewDate || reqData.interviewDate} at ${interviewTime || reqData.interviewTime}`,
            data: {
              requestId,
              requesterId: reqData.userId,
              requesterName: reqData.userName,
              requesterEmail: reqData.userEmail,
              interviewDate: interviewDate || reqData.interviewDate || null,
              interviewTime: interviewTime || reqData.interviewTime || null,
              meetingLink: meetingLink || reqData.meetingLink || null,
              domain: reqData.domain,
              adminNotes: adminNotes || reqData.adminNotes || null,
            },
          }),
        })
      }
    } catch (notifyErr) {
      console.error('Failed to send notifications:', notifyErr)
    }

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
