import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // This is where you can add authentication logic in the future
  return NextResponse.next()
}
