import { NextResponse } from "next/server"

function parseQuery(url) {
  const { searchParams } = new URL(url)
  return Object.fromEntries(searchParams.entries())
}

function getPathSegments(params) {
  const slug = params?.slug || []
  return Array.isArray(slug) ? slug : [slug]
}

export async function GET(request, { params }) {
  const query = parseQuery(request.url)
  const segments = getPathSegments(params)
  return NextResponse.json({ success: true, route: "/api/nimda/" + segments.join("/"), method: "GET", segments, query })
}

export async function POST(request, { params }) {
  const query = parseQuery(request.url)
  const segments = getPathSegments(params)
  let body = null
  try {
    body = await request.json()
  } catch {
    body = null
  }
  return NextResponse.json({ success: true, route: "/api/nimda/" + segments.join("/"), method: "POST", segments, query, body })
}

export async function PUT(request, { params }) {
  const segments = getPathSegments(params)
  let body = null
  try {
    body = await request.json()
  } catch {
    body = null
  }
  return NextResponse.json({ success: true, route: "/api/nimda/" + segments.join("/"), method: "PUT", segments, body })
}

export async function PATCH(request, { params }) {
  const segments = getPathSegments(params)
  let body = null
  try {
    body = await request.json()
  } catch {
    body = null
  }
  return NextResponse.json({ success: true, route: "/api/nimda/" + segments.join("/"), method: "PATCH", segments, body })
}

export async function DELETE(request, { params }) {
  const segments = getPathSegments(params)
  return NextResponse.json({ success: true, route: "/api/nimda/" + segments.join("/"), method: "DELETE", segments })
}


