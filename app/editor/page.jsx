"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Code,
  Play,
  Square,
  Download,
  Upload,
  RotateCcw,
  Copy,
  Check,
  Terminal,
  FileText,
  Settings,
  Monitor,
  Smartphone,
  Tablet,
} from "lucide-react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"

export default function EditorPage() {
  const { theme } = useTheme()
  const router = useRouter()
  const [code, setCode] = useState(`// Welcome to MockDrilling Online Editor
// Start coding your solution here

function solution() {
    // Your code goes here
    return "Hello, World!";
}

console.log(solution());`)
  const [language, setLanguage] = useState("javascript")
  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  // Supported by backend: javascript, python, java, html, react
  const languages = [
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "html", label: "HTML" },
    { value: "react", label: "React" },
  ]

  const templates = {
    javascript: `// Welcome to MockDrilling Online Editor
// Start coding your solution here

function solution() {
    // Your code goes here
    return "Hello, World!";
}

console.log(solution());`,
    python: `# Welcome to MockDrilling Online Editor
# Start coding your solution here

def solution():
    # Your code goes here
    return "Hello, World!"

print(solution())`,
    java: `// Welcome to MockDrilling Online Editor
// Start coding your solution here

public class Solution {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Page</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            text-align: center;
        }
        h1 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
        }
        p {
            font-size: 1.2rem;
            opacity: 0.9;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Hello, World!</h1>
        <p>Welcome to MockDrilling Online Editor</p>
    </div>
</body>
</html>`,
    react: `import React, { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);
  
  return (
    <div style={{ 
      padding: '20px', 
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      minHeight: '100vh'
    }}>
      <h1>React Counter App</h1>
      <p>Count: {count}</p>
      <button 
        onClick={() => setCount(count + 1)}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          margin: '5px'
        }}
      >
        Increment
      </button>
      <button 
        onClick={() => setCount(count - 1)}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#f44336',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          margin: '5px'
        }}
      >
        Decrement
      </button>
    </div>
  );
}

export default App;`
  }

  const runCode = async () => {
    try {
      setIsRunning(true)
      setOutput("Running your code...")
      const res = await fetch("/api/compiler/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language, sessionId: "editor-local" })
      })
      const data = await res.json()
      if (data.success) {
        setOutput(String(data.output ?? ""))
        // Show preview for HTML/React
        if (language === "html" || language === "react") {
          setShowPreview(true)
        }
      } else {
        setOutput("Execution failed")
      }
    } catch (e) {
      setOutput(`Error: ${e.message}`)
    } finally {
      setIsRunning(false)
    }
  }

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage)
    setCode(templates[newLanguage] || templates.javascript)
    setOutput("")
    setShowPreview(false)
  }

  const copyCode = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const resetCode = () => {
    setCode(`// Welcome to MockDrilling Online Editor
// Start coding your solution here

function solution() {
    // Your code goes here
    return "Hello, World!";
}

console.log(solution());`)
    setOutput("")
  }

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `solution.${language === 'javascript' ? 'js' : language}`
    a.click()
    URL.revokeObjectURL(url)
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
              <a href="/" className="text-sm font-medium hover:text-primary transition-colors">
                Home
              </a>
              <a href="/about" className="text-sm font-medium hover:text-primary transition-colors">
                About Us
              </a>
              <a href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
                Contact
              </a>
              <a href="/editor" className="text-sm font-medium text-primary">
                Online Editor
              </a>
              <a href="/blogs" className="text-sm font-medium hover:text-primary transition-colors">
                Blogs
              </a>
              <Button variant="outline" size="sm" onClick={() => router.push('/auth/login')}>
                Login
              </Button>
              <Button size="sm" onClick={() => router.push('/auth/signup')}>Sign Up</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-16 min-h-screen">
        <div className="h-screen flex flex-col">
          {/* Editor Header */}
          <div className="bg-muted/50 border-b px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-lg font-semibold">Online Code Editor</h1>
                <Badge variant="secondary">Live</Badge>
              </div>

              <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    onClick={runCode}
                    disabled={isRunning}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isRunning ? (
                      <>
                        <Square className="w-4 h-4 mr-2" />
                        Running...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Run Code
                      </>
                    )}
                  </Button>
                </div>
              <div className="flex items-center space-x-2">
                <Select value={language} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={copyCode}>
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
                <Button variant="outline" size="sm" onClick={downloadCode}>
                  <Download className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={resetCode}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          {/* Editor and Output */}
          <div className="flex-1 flex">
            {/* Code Editor */}
            <div className="flex-1 flex flex-col">
              <div className="flex-1 p-4">
                <Textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-full font-mono text-sm resize-none border-0 focus:ring-0 focus:ring-offset-0"
                  placeholder="Start coding your solution here..."
                />
              </div>

             
            </div>

            {/* Output Panel */}
            <div className="w-1/2 border-l">
              <div className="h-full flex flex-col">
                <div className="bg-muted/50 border-b px-4 py-2 flex items-center space-x-2">
                  <Terminal className="w-4 h-4" />
                  <span className="font-medium">Output</span>
                  {(language === "html" || language === "react") && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowPreview(!showPreview)}
                      className="ml-auto"
                    >
                      {showPreview ? "Hide Preview" : "Show Preview"}
                    </Button>
                  )}
                </div>
                <div className="flex-1 p-4">
                  {showPreview && (language === "html" || language === "react") ? (
                    <div className="h-full">
                      <div className="text-sm font-medium mb-2">Live Preview:</div>
                      <iframe 
                        srcDoc={language === "html" ? code : `
                          <div id="root"></div>
                          <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
                          <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
                          <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
                          <script type="text/babel">
                            ${code}
                            ReactDOM.render(<App />, document.getElementById('root'));
                          </script>
                        `}
                        className="w-full h-full border rounded"
                        title="Preview"
                      />
                    </div>
                  ) : (
                    <pre className="text-sm font-mono whitespace-pre-wrap text-muted-foreground">
                      {output || "Output will appear here when you run your code..."}
                    </pre>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Online Editor</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Practice coding with our feature-rich online editor designed for interview preparation
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <Code className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Multiple Languages</h3>
                <p className="text-muted-foreground">Support for JavaScript, Python, Java, C++, and more popular programming languages.</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Play className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Instant Execution</h3>
                <p className="text-muted-foreground">Run your code instantly and see results in real-time with our fast execution environment.</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                  <Download className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Save & Share</h3>
                <p className="text-muted-foreground">Download your code, copy to clipboard, or share your solutions with others easily.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Start Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Start Coding Immediately</h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                No setup required. Just open the editor and start coding. Perfect for practicing algorithms, 
                solving coding challenges, or preparing for technical interviews.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <Code className="w-4 h-4 text-blue-600" />
                  </div>
                  <span>Syntax highlighting for all major languages</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <Play className="w-4 h-4 text-green-600" />
                  </div>
                  <span>Instant code execution and debugging</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                    <FileText className="w-4 h-4 text-purple-600" />
                  </div>
                  <span>Save and organize your solutions</span>
                </div>
              </div>

              <div className="mt-8">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  <Code className="w-5 h-5 mr-2" />
                  Start Coding Now
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-8">
                <div className="bg-background rounded-xl p-6 shadow-lg">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                    <div className="h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  MockDrilling
                </span>
              </div>
              <p className="text-muted-foreground mb-4 max-w-md">
                Practice coding with our powerful online editor designed for interview preparation.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <a href="/" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </a>
                <a href="/about" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </a>
                <a href="/contact" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </a>
                <a href="/blogs" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Blogs
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Editor Features</h4>
              <div className="space-y-2">
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Multiple Languages
                </a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Code Execution
                </a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Save & Download
                </a>
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} MockDrilling. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
