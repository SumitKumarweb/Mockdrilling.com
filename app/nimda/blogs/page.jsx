"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, orderBy, doc, updateDoc } from "firebase/firestore"
import { useAuth } from "@/hooks/useAuth"
import { isAdmin } from "@/lib/admin"
import { useRouter } from "next/navigation"

export default function AdminBlogsModerationPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [blogs, setBlogs] = useState([])
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState(null)
  const [reason, setReason] = useState("")
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      setLoading(true)
      const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"))
      const snap = await getDocs(q)
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      setBlogs(items)
    } catch (error) {
      console.error("Error loading blogs:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    if (user === undefined) return
    if (user && !isAdmin(user)) {
      router.replace("/")
    }
  }, [user, router])

  const filtered = blogs.filter(b => (b.title || "").toLowerCase().includes(search.toLowerCase()) || (b.content || "").toLowerCase().includes(search.toLowerCase()))

  const approve = async (b) => {
    await updateDoc(doc(db, "blogs", b.id), { approved: true, status: "approved", rejectionReason: "" })
    await load()
    setSelected(null)
  }

  const reject = async (b) => {
    await updateDoc(doc(db, "blogs", b.id), { approved: false, status: "rejected", rejectionReason: reason })
    await load()
    setSelected(null)
    setReason("")
  }

  if (user && !isAdmin(user)) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      {/* Header */}
      <header className="border-b border-green-500/20 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent font-mono">
                  MockDrilling
                </span>
              </div>
              <Badge variant="secondary" className="bg-red-500/20 text-red-400 border-red-500/30 font-mono">
                Admin Panel
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white" onClick={() => router.push('/dashboard')}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      <section className="pt-8 pb-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white">Blogs Moderation</h1>
            <div className="flex items-center gap-3">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={load}
                disabled={loading}
                className="bg-black/20 border-gray-600 text-gray-400 hover:text-white"
              >
                {loading ? "Loading..." : "Refresh"}
              </Button>
              <Input className="max-w-sm bg-black/20 border-gray-600 text-white" placeholder="Search blogs" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="bg-black/40 border-green-500/20 backdrop-blur-xl shadow-sm">
                  <CardContent className="p-6">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-600/20 rounded w-32 mb-2"></div>
                      <div className="h-6 bg-gray-600/20 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-600/20 rounded w-1/2 mb-4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-600/20 rounded"></div>
                        <div className="h-4 bg-gray-600/20 rounded"></div>
                        <div className="h-4 bg-gray-600/20 rounded w-2/3"></div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <div className="h-8 bg-gray-600/20 rounded w-20"></div>
                        <div className="h-8 bg-gray-600/20 rounded w-16"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No blogs to moderate</h3>
              <p className="text-gray-400">All blog submissions have been reviewed or there are no pending submissions.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {filtered.map(b => (
              <Card key={b.id} className="bg-black/40 border-green-500/20 backdrop-blur-xl shadow-sm">
                <CardContent className="p-6">
                  <div className="text-sm text-gray-400">{b.createdAt ? new Date(b.createdAt.seconds ? b.createdAt.seconds * 1000 : b.createdAt).toLocaleString() : ""}</div>
                  <div className="text-lg font-semibold mt-1 text-white">{b.title}</div>
                  <div className="text-sm text-gray-400 mt-1">By {b.authorName || "Anonymous"}{b.authorEmail ? ` (${b.authorEmail})` : ""}</div>
                  <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap mt-3 line-clamp-6 text-gray-300">{b.content}</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(b.tags || []).slice(0, 6).map(t => <Badge key={t} variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">{t}</Badge>)}
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <Button size="sm" onClick={() => approve(b)} disabled={b.status === 'approved'} className="bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30">
                      {b.status === 'approved' ? 'Approved' : 'Approve'}
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => setSelected(b)} className="bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30">
                      Reject
                    </Button>
                    {b.status ? <span className="text-xs text-gray-400 ml-2">Status: {b.status}{b.status === 'rejected' && b.rejectionReason ? ` (Reason: ${b.rejectionReason})` : ''}</span> : null}
                  </div>
                </CardContent>
              </Card>
            ))}
            </div>
          )}

          {selected && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
              <div className="bg-black/90 border border-red-500/30 rounded-lg w-full max-w-lg p-6">
                <div className="text-lg font-semibold mb-2 text-white">Reject Blog</div>
                <div className="text-sm text-gray-400 mb-4">Provide a reason so the author understands what to fix.</div>
                <Textarea rows={6} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason for rejection..." className="bg-black/20 border-gray-600 text-white" />
                <div className="mt-4 flex justify-end gap-2">
                  <Button variant="ghost" onClick={() => { setSelected(null); setReason("") }} className="text-gray-400 hover:text-white">Cancel</Button>
                  <Button variant="destructive" onClick={() => reject(selected)} disabled={!reason.trim()} className="bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30">Reject</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}


