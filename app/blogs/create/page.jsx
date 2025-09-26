"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { useRouter } from "next/navigation"

export default function CreateBlogPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [authorName, setAuthorName] = useState("")
  const [authorEmail, setAuthorEmail] = useState("")
  const [category, setCategory] = useState("general")
  const [submitting, setSubmitting] = useState(false)

  const slugify = (str) =>
    str
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")

  const handleSubmit = async (e) => {
    e.preventDefault()
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
        slug,
        approved: false,
        createdAt: serverTimestamp(),
      })
      router.push("/blogs?submitted=true")
    } catch (e) {
      console.error("Failed to create blog", e)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="pt-20 pb-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-6">Write a Blog</h1>
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Author Name</label>
                    <Input value={authorName} onChange={(e) => setAuthorName(e.target.value)} placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Author Email</label>
                    <Input type="email" value={authorEmail} onChange={(e) => setAuthorEmail(e.target.value)} placeholder="you@example.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g., frontend, backend" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Content</label>
                  <Textarea rows={14} value={content} onChange={(e) => setContent(e.target.value)} required />
                </div>
                <Button type="submit" disabled={submitting}>{submitting ? "Submitting..." : "Submit for approval"}</Button>
              </form>
            </CardContent>
          </Card>
          <p className="text-sm text-muted-foreground mt-4">Once submitted, an admin will review and approve your blog before it appears in the public blog list.</p>
        </div>
      </section>
    </div>
  )
}


