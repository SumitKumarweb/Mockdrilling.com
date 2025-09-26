"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { doc, getDoc, query, collection, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function BlogDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { slug } = params || {}
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        // Find by slug
        const q = query(collection(db, "blogs"), where("slug", "==", slug))
        const snap = await getDocs(q)
        if (!snap.empty) {
          const docSnap = snap.docs[0]
          setBlog({ id: docSnap.id, ...docSnap.data() })
        }
      } catch (e) {
        console.error("Failed to fetch blog:", e)
      } finally {
        setLoading(false)
      }
    }
    if (slug) fetchBlog()
  }, [slug])

  if (loading) return null
  if (!blog) return null

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="pt-20 pb-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Badge variant="secondary">{blog.category || "General"}</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{blog.title}</h1>
          <div className="text-sm text-muted-foreground mb-8">
            By {blog.authorName || "Anonymous"} {blog.authorEmail ? `(${blog.authorEmail})` : ""} · {blog.createdAt ? new Date(blog.createdAt.seconds ? blog.createdAt.seconds * 1000 : blog.createdAt).toLocaleDateString() : ""}
          </div>
          <Card>
            <CardContent className="prose dark:prose-invert max-w-none p-6 whitespace-pre-wrap">
              {blog.content}
            </CardContent>
          </Card>

          <div className="mt-8 text-sm text-muted-foreground">
            <Separator className="my-4" />
            <div>
              Author: <span className="font-medium text-foreground">{blog.authorName || "Anonymous"}</span>{" "}
              {blog.authorEmail ? <span className="text-muted-foreground">({blog.authorEmail})</span> : null}
            </div>
            <div>
              Published on: {blog.createdAt ? new Date(blog.createdAt.seconds ? blog.createdAt.seconds * 1000 : blog.createdAt).toLocaleString() : ""}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}


