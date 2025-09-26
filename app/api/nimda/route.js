import { NextResponse } from "next/server"

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const query = Object.fromEntries(searchParams.entries())
  return NextResponse.json({ success: true, route: "/api/nimda", method: "GET", query })
}

export async function POST(request) {
  const { searchParams } = new URL(request.url)
  const query = Object.fromEntries(searchParams.entries())
  let body = null
  try {
    body = await request.json()
  } catch {
    body = null
  }
  return NextResponse.json({ success: true, route: "/api/nimda", method: "POST", query, body })
}

export async function PUT(request) {
  let body = null
  try {
    body = await request.json()
  } catch {
    body = null
  }
  return NextResponse.json({ success: true, route: "/api/nimda", method: "PUT", body })
}

export async function PATCH(request) {
  let body = null
  try {
    body = await request.json()
  } catch {
    body = null
  }
  return NextResponse.json({ success: true, route: "/api/nimda", method: "PATCH", body })
}

export async function DELETE() {
  return NextResponse.json({ success: true, route: "/api/nimda", method: "DELETE" })
}


