import { NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { doc, updateDoc } from "firebase/firestore"

export async function PATCH(request, { params }) {
  try {
    const { notificationId } = params
    if (!notificationId) {
      return NextResponse.json({ success: false, error: "Missing notificationId" }, { status: 400 })
    }
    await updateDoc(doc(db, "notifications", notificationId), {
      read: true,
      readAt: new Date().toISOString(),
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating notification:", error)
    return NextResponse.json({ success: false, error: "Failed to update notification" }, { status: 500 })
  }
}


