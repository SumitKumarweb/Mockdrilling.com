"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { useAuth } from "@/hooks/useAuth"
import slugify from "slugify"

export default function DashboardCreateBlogPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [authorName, setAuthorName] = useState("")
  const [authorEmail, setAuthorEmail] = useState("")
  const [category, setCategory] = useState("general")
  const [tags, setTags] = useState("")
  const [submitting, setSubmitting] = useState(false)


  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) { router.replace('/auth/login?redirect=dashboard/blogs/create'); return }
    if (!title || !content) return
    setSubmitting(true)
    try {
      const slug = slugify(title)
      await addDoc(collection(db, "blogs"), {
        title,
        content,
        authorName: authorName || "Anonymous",
        authorEmail: authorEmail || "",
        category,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        slug,
        approved: false,
        status: "pending",
        rejectionReason: "",
        createdAt: serverTimestamp(),
      })
      router.push("/dashboard/blogs?submitted=true")
    } catch (e) {
      console.error("Failed to create blog", e)
    } finally {
      setSubmitting(false)
    }
  }

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
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30 font-mono">
                Create Blog
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white">Create Blog</h1>
            <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Awaiting Admin Approval</Badge>
          </div>

          <Card className="bg-black/40 border-green-500/20 backdrop-blur-xl shadow-sm">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">Title</label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} required className="bg-black/20 border-gray-600 text-white" />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">Author Name</label>
                    <Input value={authorName} onChange={(e) => setAuthorName(e.target.value)} placeholder="Your name" className="bg-black/20 border-gray-600 text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">Author Email</label>
                    <Input type="email" value={authorEmail} onChange={(e) => setAuthorEmail(e.target.value)} placeholder="you@example.com" className="bg-black/20 border-gray-600 text-white" />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">Category</label>
                    <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g., frontend, backend" className="bg-black/20 border-gray-600 text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">Tags (comma-separated)</label>
                    <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="react, hooks, javascript" className="bg-black/20 border-gray-600 text-white" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white">Content</label>
                  <Textarea rows={16} value={content} onChange={(e) => setContent(e.target.value)} required className="bg-black/20 border-gray-600 text-white" />
                </div>

                <div className="flex items-center gap-3">
                  <Button type="submit" disabled={submitting} className="bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30">
                    {submitting ? "Submitting..." : "Submit for approval"}
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => router.push("/dashboard/blogs")} className="text-gray-400 hover:text-white">
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}


