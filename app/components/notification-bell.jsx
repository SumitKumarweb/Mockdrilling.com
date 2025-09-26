"use client"

import { useEffect, useState } from "react"
import { Bell, CheckCircle, XCircle, Calendar, Clock, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { useAuth } from "@/hooks/useAuth"

export default function NotificationsBell() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const load = async () => {
    if (!user?.uid) return
    setLoading(true)
    try {
      const res = await fetch(`/api/notifications?userId=${user.uid}`)
      const json = await res.json()
      if (json.success) {
        // Hard-filter on userId to avoid any leaked notifications
        const own = (json.notifications || []).filter(n => n.userId === user.uid)
        const sorted = [...own].sort((a, b) => {
          const ta = a.createdAt?.toDate
            ? a.createdAt.toDate().getTime()
            : new Date(a.createdAt).getTime()
          const tb = b.createdAt?.toDate
            ? b.createdAt.toDate().getTime()
            : new Date(b.createdAt).getTime()
          return tb - ta
        })
        setNotifications(sorted)
        setUnreadCount(sorted.filter((n) => !n.read).length)
      }
    } catch (e) {
      console.error('Failed to load notifications:', e)
    } finally {
      setLoading(false)
    }
  }

  // Fetch when dialog opens or user changes
  useEffect(() => {
    if (open) load()
  }, [open, user?.uid])

  // 🔹 Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const unread = notifications.filter((n) => !n.read)
      await Promise.all(
        unread.map((n) => fetch(`/api/notifications/${n.id}`, { method: 'PATCH' }))
      )
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error("Failed to mark all as read:", error)
    }
  }

  // 🔹 Handle click on a notification
  const handleNotificationClick = async (n) => {
    try {
      if (!n.read) {
        await fetch(`/api/notifications/${n.id}`, { method: 'PATCH' })
        setNotifications((prev) =>
          prev.map((x) => (x.id === n.id ? { ...x, read: true } : x))
        )
        setUnreadCount((prev) => Math.max(0, prev - 1))
      }

      // If interview scheduled, open meeting link if present
      if (n.type === "interview_scheduled" && n.data?.meetingLink) {
        setOpen(false)
        try {
          window.open(n.data.meetingLink, "_blank", "noopener,noreferrer")
        } catch (_) {}
      }
    } catch (error) {
      console.error("Error handling notification click:", error)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative text-gray-400 hover:text-white"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-black/90 border-gray-600 max-w-md max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-white font-mono flex items-center justify-between">
            <div className="flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Notifications
            </div>
            {unreadCount > 0 && (
              <Button
                size="sm"
                variant="outline"
                className="text-xs bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
                onClick={markAllAsRead}
              >
                Mark All Read
              </Button>
            )}
          </DialogTitle>
          <DialogDescription className="text-gray-400 font-mono">
            Interview updates and approvals
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto max-h-96">
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500 mx-auto"></div>
              <p className="text-gray-400 font-mono text-sm mt-2">Loading...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="w-12 h-12 text-gray-500 mx-auto mb-2" />
              <p className="text-gray-500 font-mono">No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    n.read
                      ? "bg-gray-800/50 border-gray-700"
                      : "bg-blue-500/10 border-blue-500/30"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {n.type === "request_approved" && (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      )}
                      {n.type === "request_rejected" && (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )}
                      {n.type === "interview_scheduled" && (
                        <Calendar className="w-5 h-5 text-blue-400" />
                      )}
                      {![
                        "request_approved",
                        "request_rejected",
                        "interview_scheduled"
                      ].includes(n.type) && (
                        <Bell className="w-5 h-5 text-gray-400" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-mono font-bold text-sm">
                        {n.title}
                      </h4>
                      <p className="text-gray-300 font-mono text-xs mt-1">
                        {n.message}
                      </p>

                      {n.data?.interviewDate && (
                        <div className="mt-3 p-3 bg-black/40 rounded-lg border border-gray-600">
                          <div className="flex items-center space-x-2 mb-2">
                            <Calendar className="w-4 h-4 text-blue-400" />
                            <span className="text-blue-400 font-mono text-sm font-bold">
                              Interview Scheduled
                            </span>
                          </div>

                          <div className="space-y-2 text-xs font-mono">
                            <div className="flex items-center space-x-2">
                              <Clock className="w-3 h-3 text-gray-400" />
                              <span className="text-gray-300">
                                {formatDate(n.data.interviewDate)} at{" "}
                                {formatTime(n.data.interviewTime)}
                              </span>
                            </div>

                            {n.data.meetingLink && (
                              <div className="flex items-center space-x-2">
                                <ExternalLink className="w-3 h-3 text-gray-400" />
                                <a
                                  href={n.data.meetingLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-400 underline hover:text-blue-300"
                                >
                                  Join Meeting
                                </a>
                              </div>
                            )}

                            {n.data.adminNotes && (
                              <div className="mt-2 p-2 bg-yellow-500/10 rounded border border-yellow-500/20">
                                <span className="text-yellow-400 font-mono text-xs">
                                  <strong>Admin Note:</strong>{" "}
                                  {n.data.adminNotes}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-gray-500 font-mono text-xs">
                          {n.createdAt?.toDate
                            ? n.createdAt.toDate().toLocaleString()
                            : new Date(n.createdAt).toLocaleString()}
                        </span>
                        {!n.read && (
                          <Badge
                            variant="secondary"
                            className="bg-blue-500/20 text-blue-400 text-xs"
                          >
                            New
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
