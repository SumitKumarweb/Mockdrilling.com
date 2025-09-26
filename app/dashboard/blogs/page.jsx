"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, where, orderBy } from "firebase/firestore"
import { useAuth } from "@/hooks/useAuth"

export default function DashboardBlogsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [blogs, setBlogs] = useState([])
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all")

  useEffect(() => {
    const load = async () => {
      const q = query(collection(db, "blogs"))
      const snap = await getDocs(q)
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      items.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
      setBlogs(items)
    }
    load()
  }, [])

  useEffect(() => {
    if (user === undefined) return
    if (!user) router.replace("/auth/login?redirect=dashboard/blogs")
  }, [user, router])

  const filtered = blogs.filter((b) => {
    const matchesSearch = (b.title || "").toLowerCase().includes(search.toLowerCase()) || (b.content || "").toLowerCase().includes(search.toLowerCase())
    const matchesStatus = status === "all" || (b.status || (b.approved ? "approved" : "pending")) === status
    return matchesSearch && matchesStatus
  })

  const statusBadge = (b) => {
    const s = b.status || (b.approved ? "approved" : "pending")
    const map = { approved: "bg-green-100 text-green-700", pending: "bg-yellow-100 text-yellow-700", rejected: "bg-red-100 text-red-700" }
    return <span className={`px-2 py-1 rounded text-xs ${map[s] || "bg-muted"}`}>{s}</span>
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="pt-20 pb-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl md:text-3xl font-bold">My Blogs</h1>
            <Button onClick={() => router.push("/dashboard/blogs/create")}>Create Blog</Button>
          </div>

          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <Input placeholder="Search by title or content" value={search} onChange={(e) => setSearch(e.target.value)} />
            <div className="flex items-center gap-2">
              <Button variant={status === "all" ? "default" : "outline"} size="sm" onClick={() => setStatus("all")}>All</Button>
              <Button variant={status === "pending" ? "default" : "outline"} size="sm" onClick={() => setStatus("pending")}>Pending</Button>
              <Button variant={status === "approved" ? "default" : "outline"} size="sm" onClick={() => setStatus("approved")}>Approved</Button>
              <Button variant={status === "rejected" ? "default" : "outline"} size="sm" onClick={() => setStatus("rejected")}>Rejected</Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {filtered.map((b) => (
              <Card key={b.id} className="shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">{b.createdAt ? new Date(b.createdAt.seconds ? b.createdAt.seconds * 1000 : b.createdAt).toLocaleDateString() : ""}</div>
                      <div className="text-lg font-semibold mt-1">{b.title}</div>
                      <div className="text-sm text-muted-foreground line-clamp-2 mt-1">{b.content}</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {(b.tags || []).slice(0, 4).map((t) => (
                          <Badge key={t} variant="secondary">{t}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      {statusBadge(b)}
                      {b.status === "rejected" && b.rejectionReason ? (
                        <div className="text-xs text-red-600 mt-2 max-w-[200px]">Reason: {b.rejectionReason}</div>
                      ) : null}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}


