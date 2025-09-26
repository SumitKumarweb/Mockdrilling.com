import { NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { collection, addDoc, getDocs, query, where } from "firebase/firestore"

// Create notification
export async function POST(request) {
  try {
    const { userId, type, title, message, data } = await request.json()

    if (!userId || !type || !title || !message) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const notificationData = {
      userId,
      type,
      title,
      message,
      data: data || {},
      read: false,
      createdAt: new Date().toISOString(),
    }

    const ref = await addDoc(collection(db, "notifications"), notificationData)
    return NextResponse.json({ success: true, notificationId: ref.id })
  } catch (error) {
    console.error("Error creating notification:", error)
    return NextResponse.json({ success: false, error: "Failed to create notification" }, { status: 500 })
  }
}

// Get notifications for a user
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const unreadOnly = searchParams.get("unreadOnly") === "true"

    if (!userId) {
      return NextResponse.json({ success: false, error: "Missing userId" }, { status: 400 })
    }

    // Minimize index requirements: query by userId only, filter/sort in JS
    const q = query(collection(db, "notifications"), where("userId", "==", userId))
    const snap = await getDocs(q)
    let notifications = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    if (unreadOnly) {
      notifications = notifications.filter(n => !n.read)
    }
    notifications.sort((a, b) => {
      const ta = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : new Date(a.createdAt).getTime()
      const tb = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : new Date(b.createdAt).getTime()
      return tb - ta
    })
    return NextResponse.json({ success: true, notifications })
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch notifications" }, { status: 500 })
  }
}


