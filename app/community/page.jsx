"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { db, storage } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp, query, getDocs, orderBy, doc, getDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { Menu, X, Sun, Moon, Code, MessageCircle, Image as ImageIcon, Send, Shield, Info } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

const ABUSIVE_WORDS = [
  "sex", "sexual", "porn", "rape", "fuck", "shit", "asshole", "bastard", "bitch", "dick", "pussy",
]

function containsAbuse(text) {
  const lower = text.toLowerCase()
  return ABUSIVE_WORDS.some(w => lower.includes(w))
}

function buildCommentTree(comments) {
  const byId = new Map()
  const roots = []
  comments.forEach(c => { byId.set(c.id, { ...c, replies: [] }) })
  comments.forEach(c => {
    if (c.parentId) {
      const parent = byId.get(c.parentId)
      if (parent) parent.replies.push(byId.get(c.id))
      else roots.push(byId.get(c.id))
    } else {
      roots.push(byId.get(c.id))
    }
  })
  const sortTree = (nodes) => {
    nodes.sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0))
    nodes.forEach(n => sortTree(n.replies))
  }
  sortTree(roots)
  return roots
}

export default function CommunityPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [content, setContent] = useState("")
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedPostId, setExpandedPostId] = useState("")
  const [commentsByPost, setCommentsByPost] = useState({})
  const [replyOpenFor, setReplyOpenFor] = useState("")
  const [replyText, setReplyText] = useState("")
  const [replyImage, setReplyImage] = useState(null)
  const [replyPreview, setReplyPreview] = useState("")

  const loadPosts = async () => {
    try {
      setLoading(true)
      const qPosts = query(collection(db, "community"), orderBy("createdAt", "desc"))
      const snap = await getDocs(qPosts)
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      setPosts(items)
    } finally {
      setLoading(false)
    }
  }

  const loadComments = async (postId) => {
    const q = query(collection(db, `community/${postId}/comments`))
    const snap = await getDocs(q)
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    const tree = buildCommentTree(items)
    setCommentsByPost(prev => ({ ...prev, [postId]: tree }))
  }

  useEffect(() => { loadPosts() }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const onPickImage = (file, setFile, setPreview) => {
    setError("")
    if (!file) { setFile(null); setPreview(""); return }
    if (!file.type.startsWith("image/")) { setError("Only images are allowed"); return }
    if (file.size > 500 * 1024) { setError("Image must be < 500KB"); return }
    setFile(file)
    const url = URL.createObjectURL(file)
    setPreview(url)
  }

  const uploadImage = async (path, file) => {
    const storageRef = ref(storage, path)
    await uploadBytes(storageRef, file)
    return await getDownloadURL(storageRef)
  }

  const submitPost = async (e) => {
    e.preventDefault()
    setError("")
    const text = content.trim()
    if (!text) return
    if (containsAbuse(text)) { setError("Please remove abusive content."); return }
    if (imageFile && imageFile.size > 500 * 1024) { setError("Image must be < 500KB"); return }
    setSubmitting(true)
    try {
      const postRef = await addDoc(collection(db, "community"), {
        content: text,
        imageUrl: "",
        createdAt: serverTimestamp(),
      })
      let imageUrl = ""
      if (imageFile) {
        imageUrl = await uploadImage(`community/${postRef.id}/${imageFile.name}`, imageFile)
        await addDoc(collection(db, "__updates__")) // noop to delay UI slightly
        await (await import("firebase/firestore")).updateDoc(doc(db, "community", postRef.id), { imageUrl })
      }
      setContent("")
      setImageFile(null)
      setImagePreview("")
      await loadPosts()
    } catch (e) {
      setError("Failed to post. Try again.")
      console.error(e)
    } finally {
      setSubmitting(false)
    }
  }

  const submitReply = async (postId, parentId) => {
    setError("")
    const text = replyText.trim()
    if (!text) return
    if (containsAbuse(text)) { setError("Please remove abusive content."); return }
    if (replyImage && replyImage.size > 500 * 1024) { setError("Image must be < 500KB"); return }
    setSubmitting(true)
    try {
      let imageUrl = ""
      if (replyImage) {
        imageUrl = await uploadImage(`community/${postId}/comments/${Date.now()}-${replyImage.name}`, replyImage)
      }
      await addDoc(collection(db, `community/${postId}/comments`), {
        content: text,
        parentId: parentId || "",
        imageUrl,
        createdAt: serverTimestamp(),
      })
      setReplyText("")
      setReplyImage(null)
      setReplyPreview("")
      setReplyOpenFor("")
      await loadComments(postId)
    } catch (e) {
      setError("Failed to reply. Try again.")
      console.error(e)
    } finally {
      setSubmitting(false)
    }
  }

  const CommentNode = ({ postId, node, depth = 0 }) => {
    return (
      <div className="mt-4" style={{ marginLeft: depth * 16 }}>
        <div className="rounded-md border p-3">
          <div className="whitespace-pre-wrap text-sm">{node.content}</div>
          {node.imageUrl ? (
            <img src={node.imageUrl} alt="attachment" className="mt-2 max-h-48 rounded" />
          ) : null}
          <div className="text-xs text-muted-foreground mt-2">
            {node.createdAt ? new Date(node.createdAt.seconds ? node.createdAt.seconds * 1000 : node.createdAt).toLocaleString() : ""}
          </div>
          <div className="mt-2">
            <Button variant="outline" size="xs" onClick={() => { setReplyOpenFor(node.id); setReplyPreview(""); setReplyImage(null); }}>
              Reply
            </Button>
          </div>
          {replyOpenFor === node.id && (
            <div className="mt-3 space-y-2">
              <Textarea rows={3} value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Write a reply..." />
              <Input type="file" accept="image/*" onChange={(e) => onPickImage(e.target.files?.[0] || null, setReplyImage, setReplyPreview)} />
              {replyPreview ? <img src={replyPreview} alt="preview" className="max-h-32 rounded" /> : null}
              <div className="flex gap-2">
                <Button size="sm" onClick={() => submitReply(postId, node.id)} disabled={submitting}>Post Reply</Button>
                <Button size="sm" variant="ghost" onClick={() => { setReplyOpenFor(""); setReplyText(""); setReplyImage(null); setReplyPreview("") }}>Cancel</Button>
              </div>
            </div>
          )}
        </div>
        {node.replies?.map(child => (
          <CommentNode key={child.id} postId={postId} node={child} depth={depth + 1} />
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => router.push('/')}>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MockDrilling
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="/about" className="text-sm font-medium hover:text-primary transition-colors">
                About Us
              </a>
              <a href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
                Contact
              </a>
              <a href="/editor" className="text-sm font-medium hover:text-primary transition-colors">
                Online Editor
              </a>
              <a href="/blogs" className="text-sm font-medium hover:text-primary transition-colors">
                Blogs
              </a>
              <a href="/community" className="text-sm font-medium hover:text-primary transition-colors">
                Community
              </a>
              <Button variant="outline" size="sm" onClick={() => router.push('/auth/login')}>
                Login
              </Button>
              <Button size="sm" onClick={() => router.push('/auth/signup')}>Sign Up</Button>
              <Button variant="ghost" size="sm" onClick={toggleTheme} className="w-9 h-9 p-0">
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={toggleTheme} className="w-9 h-9 p-0">
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)} className="w-9 h-9 p-0">
                {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="flex flex-col space-y-4">
                <a href="/about" className="text-sm font-medium hover:text-primary transition-colors">
                  About Us
                </a>
                <a href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
                  Contact
                </a>
                <a href="/editor" className="text-sm font-medium hover:text-primary transition-colors">
                  Online Editor
                </a>
                <a href="/blogs" className="text-sm font-medium hover:text-primary transition-colors">
                  Blogs
                </a>
                <a href="/community" className="text-sm font-medium hover:text-primary transition-colors">
                  Community
                </a>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => router.push('/auth/login')}>
                    Login
                  </Button>
                  <Button size="sm" className="flex-1" onClick={() => router.push('/auth/signup')}>
                    Sign Up
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <section className="pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Community</h1>
              <p className="text-sm text-muted-foreground mt-1">Ask doubts, share learnings, help others — anonymously.</p>
            </div>
            <Badge variant="secondary">Ask anonymously</Badge>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main column */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-sm">
                <CardContent className="p-6">
                  <form onSubmit={submitPost} className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-center text-sm font-semibold">A</div>
                      <div className="flex-1">
                        <Textarea rows={4} value={content} onChange={(e) => setContent(e.target.value)} placeholder="Share your question or thought..." />
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <label className="inline-flex items-center gap-2 cursor-pointer">
                              <ImageIcon className="w-4 h-4" />
                              <span>Attach image</span>
                              <Input type="file" className="hidden" accept="image/*" onChange={(e) => onPickImage(e.target.files?.[0] || null, setImageFile, setImagePreview)} />
                            </label>
                            <span>Max 500KB</span>
                          </div>
                          <Button type="submit" size="sm" disabled={submitting}>
                            {submitting ? "Posting..." : (
                              <span className="inline-flex items-center gap-2"><Send className="w-4 h-4" /> Post</span>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                    {imagePreview ? <img src={imagePreview} alt="preview" className="max-h-40 rounded" /> : null}
                    {error ? <div className="text-sm text-red-500">{error}</div> : null}
                  </form>
                </CardContent>
              </Card>

              {loading ? (
                <div className="space-y-4">
                  <Card><CardContent className="p-6 space-y-3"><Skeleton className="h-4 w-1/2" /><Skeleton className="h-4 w-2/3" /><Skeleton className="h-40 w-full" /></CardContent></Card>
                  <Card><CardContent className="p-6 space-y-3"><Skeleton className="h-4 w-1/3" /><Skeleton className="h-4 w-1/2" /><Skeleton className="h-32 w-full" /></CardContent></Card>
                </div>
              ) : posts.length === 0 ? (
                <Card className="shadow-sm">
                  <CardContent className="p-8 text-center text-muted-foreground">
                    <MessageCircle className="w-6 h-6 mx-auto mb-2" />
                    Be the first to start a discussion.
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {posts.map(p => (
                    <Card key={p.id} className="shadow-sm">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-3">
                          <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-xs">Anon</div>
                          <div className="flex-1">
                            <div className="text-sm text-muted-foreground">{p.createdAt ? new Date(p.createdAt.seconds ? p.createdAt.seconds * 1000 : p.createdAt).toLocaleString() : ""}</div>
                            <div className="mt-2 whitespace-pre-wrap">{p.content}</div>
                            {p.imageUrl ? <img src={p.imageUrl} alt="attachment" className="mt-3 max-h-64 rounded" /> : null}

                            <div className="mt-4">
                              <Button variant="outline" size="sm" onClick={async () => { setExpandedPostId(p.id === expandedPostId ? "" : p.id); if (p.id !== expandedPostId) await loadComments(p.id) }}>
                                {expandedPostId === p.id ? "Hide Thread" : "View Thread"}
                              </Button>
                            </div>

                            {expandedPostId === p.id && (
                              <div className="mt-4">
                                <Separator className="my-2" />
                                <div className="text-sm font-medium mb-2">Discussion</div>
                                <div className="space-y-2">
                                  {(commentsByPost[p.id] || []).map(node => (
                                    <div key={node.id} className="border-l pl-4">
                                      <CommentNode postId={p.id} node={node} />
                                    </div>
                                  ))}
                                </div>

                                {/* Top-level reply */}
                                <div className="mt-4 p-3 rounded-md border">
                                  <div className="text-sm font-medium mb-2">Add a comment</div>
                                  <div className="space-y-2">
                                    <Textarea rows={3} value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Write a comment..." />
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                      <label className="inline-flex items-center gap-2 cursor-pointer">
                                        <ImageIcon className="w-4 h-4" />
                                        <span>Attach image</span>
                                        <Input type="file" className="hidden" accept="image/*" onChange={(e) => onPickImage(e.target.files?.[0] || null, setReplyImage, setReplyPreview)} />
                                      </label>
                                      <span>Max 500KB</span>
                                    </div>
                                    {replyPreview ? <img src={replyPreview} alt="preview" className="max-h-32 rounded" /> : null}
                                    <div className="flex gap-2">
                                      <Button size="sm" onClick={() => submitReply(p.id, "")} disabled={submitting}>Comment</Button>
                                      <Button size="sm" variant="ghost" onClick={() => { setReplyText(""); setReplyImage(null); setReplyPreview("") }}>Clear</Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar column */}
            <div className="space-y-6">
              <Card className="shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-4 h-4" />
                    <div className="font-medium">Community Guidelines</div>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
                    <li>Be respectful and constructive.</li>
                    <li>No abusive or sexual content.</li>
                    <li>Keep images under 500KB.</li>
                    <li>Do not share personal details.</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="w-4 h-4" />
                    <div className="font-medium">Tips</div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Use clear titles and describe your problem with context and expected behavior for faster help.
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}


