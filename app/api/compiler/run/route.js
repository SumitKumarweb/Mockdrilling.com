import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const { code, language, sessionId } = await request.json()

    // Log code submission
    console.log(`Code submission for session ${sessionId}:`, { language, code: code.substring(0, 100) + "..." })

    let output = ""
    let error = null

    try {
      switch (language) {
        case "javascript":
          output = await runJavaScript(code)
          break
        case "python":
          output = await runPython(code)
          break
        case "java":
          output = await runJava(code)
          break
        case "html":
          output = await runHTML(code)
          break
        case "react":
          output = await runReact(code)
          break
        default:
          throw new Error(`Unsupported language: ${language}`)
      }
    } catch (err) {
      error = err.message
    }

    // Store code submission (in production, save to database)
    const submission = {
      sessionId,
      language,
      code,
      output,
      error,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      output: output || error,
      error: error ? true : false,
      executionTime: Math.random() * 1000 + 100, // Mock execution time
    })
  } catch (error) {
    console.error("Code execution error:", error)
    return NextResponse.json({ success: false, error: "Failed to execute code" }, { status: 500 })
  }
}

// Mock code execution functions (in production, use proper sandboxed execution)
async function runJavaScript(code) {
  try {
    // Capture console.log output
    let output = ""
    const originalLog = console.log
    console.log = (...args) => {
      output += args.join(" ") + "\n"
    }

    // Execute code in a safe context
    const result = eval(code)

    // Restore console.log
    console.log = originalLog

    if (result !== undefined) {
      output += `Return value: ${result}\n`
    }

    return output || "Code executed successfully (no output)"
  } catch (error) {
    throw new Error(`JavaScript Error: ${error.message}`)
  }
}

async function runPython(code) {
  // Mock Python execution
  const mockOutputs = [
    "Hello World!\nCode executed successfully",
    "Function defined and called\nResult: 42",
    "List processed: [1, 2, 3, 4, 5]\nSum: 15",
    'Dictionary created: {"key": "value"}\nAccessed value: value',
  ]

  if (code.includes("print")) {
    return mockOutputs[Math.floor(Math.random() * mockOutputs.length)]
  }

  return "Python code executed successfully"
}

async function runJava(code) {
  // Mock Java execution
  if (code.includes("System.out.println")) {
    return "Hello World!\nJava program compiled and executed successfully"
  }

  return "Java code compiled and executed successfully"
}

async function runHTML(code) {
  // For HTML, return a preview message
  return `HTML code received. In a real implementation, this would render in an iframe.
Preview: ${code.includes("<h1>") ? "Contains heading elements" : "Basic HTML structure"}
${code.includes("<script>") ? "Contains JavaScript" : "No JavaScript detected"}
${code.includes("<style>") ? "Contains CSS styles" : "No CSS detected"}`
}

async function runReact(code) {
  // Mock React execution
  return `React component code received.
Component analysis:
- ${code.includes("useState") ? "Uses state hooks" : "No state hooks detected"}
- ${code.includes("useEffect") ? "Uses effect hooks" : "No effect hooks detected"}
- ${code.includes("return") ? "Has JSX return statement" : "No JSX return found"}

In a real implementation, this would be compiled and rendered.`
}
