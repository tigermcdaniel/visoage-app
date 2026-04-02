/**
 * POST /api/validate-promo
 *
 * Validates a promo code against the server-side PROMO_CODES environment variable.
 * Codes are NEVER exposed to the client — validation is 100% server-side.
 *
 * Body: { code: string }
 * Response: { valid: true } | { valid: false, message: string }
 */

import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const code: string = typeof body?.code === "string" ? body.code.trim().toUpperCase() : ""

    if (!code) {
      return NextResponse.json({ valid: false, message: "Please enter a promo code." }, { status: 400 })
    }

    const rawCodes = process.env.PROMO_CODES ?? ""
    const validCodes = rawCodes
      .split(",")
      .map((c) => c.trim().toUpperCase())
      .filter(Boolean)

    if (validCodes.includes(code)) {
      return NextResponse.json({ valid: true })
    }

    return NextResponse.json({ valid: false, message: "Invalid promo code. Please try again." })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error"
    console.error("[validate-promo API]", message)
    return NextResponse.json({ valid: false, message: "Something went wrong. Please try again." }, { status: 500 })
  }
}
