/**
 * POST /api/send-report-email
 *
 * Sends a skin analysis report link to a user's email.
 *
 * Body: { email: string, score: number, reportId: string, reportUrl: string }
 *
 * Implementation:
 * - If SENDGRID_API_KEY is set → sends via SendGrid
 * - If SMTP_HOST is set → sends via Nodemailer
 * - Otherwise → returns 501 (not configured), client should fall back to mailto:
 */

import { NextRequest, NextResponse } from "next/server"

interface EmailRequestBody {
  email: string
  score: number
  reportId: string
  reportUrl: string
}

// ─── HTML email template ───────────────────────────────────────────────────────
function buildEmailHtml(score: number, reportUrl: string): string {
  const scoreLabel =
    score >= 85 ? "Excellent Skin Health" : score >= 70 ? "Good Skin Health" : "Room to Improve"

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Visoage Skin Analysis Report</title>
</head>
<body style="margin:0;padding:0;background:#fafaf8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fafaf8;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:480px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.06);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#b8975c 0%,#d4af7a 100%);padding:40px 32px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:300;letter-spacing:0.05em;">Visoage</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:13px;letter-spacing:0.1em;text-transform:uppercase;">Skin Analysis Report</p>
            </td>
          </tr>
          <!-- Score -->
          <tr>
            <td style="padding:40px 32px;text-align:center;">
              <div style="display:inline-block;width:120px;height:120px;border-radius:50%;background:#fdf6ed;border:3px solid #b8975c;line-height:120px;">
                <span style="font-size:48px;font-weight:300;color:#b8975c;">${score}</span>
              </div>
              <p style="margin:16px 0 4px;font-size:20px;font-weight:400;color:#1a1a1a;font-style:italic;">${scoreLabel}</p>
              <p style="margin:0;font-size:13px;color:#888;letter-spacing:0.05em;">Overall Skin Health Score</p>
            </td>
          </tr>
          <!-- CTA -->
          <tr>
            <td style="padding:0 32px 32px;text-align:center;">
              <p style="margin:0 0 24px;font-size:14px;color:#555;line-height:1.6;">
                Your personalized skin analysis is ready. View your full report with detailed insights, key metrics, and expert recommendations.
              </p>
              <a href="${reportUrl}"
                style="display:inline-block;background:#b8975c;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:100px;font-size:14px;font-weight:600;letter-spacing:0.03em;">
                View Full Report
              </a>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#fafaf8;padding:20px 32px;text-align:center;border-top:1px solid #f0ebe3;">
              <p style="margin:0;font-size:11px;color:#aaa;">
                Powered by Visoage · Advanced skin analysis<br/>
                <a href="https://visoage.com" style="color:#b8975c;text-decoration:none;">visoage.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function buildEmailText(score: number, reportUrl: string): string {
  return `Your Visoage Skin Analysis Report

Overall Score: ${score}/100

View your full report here: ${reportUrl}

Your personalized skin analysis includes detailed insights, key metrics, and expert recommendations tailored to your skin.

---
Powered by Visoage · visoage.com`
}

// ─── SendGrid sender ───────────────────────────────────────────────────────────
async function sendViaSendGrid(to: string, score: number, reportUrl: string): Promise<void> {
  const apiKey = process.env.SENDGRID_API_KEY
  if (!apiKey) throw new Error("SENDGRID_API_KEY not configured")

  const fromEmail = process.env.EMAIL_FROM ?? "noreply@visoage.com"
  const fromName = process.env.EMAIL_FROM_NAME ?? "Visoage"

  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: fromEmail, name: fromName },
      subject: "Your Visoage Skin Analysis Report",
      content: [
        { type: "text/plain", value: buildEmailText(score, reportUrl) },
        { type: "text/html", value: buildEmailHtml(score, reportUrl) },
      ],
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`SendGrid error ${response.status}: ${body}`)
  }
}

// ─── Nodemailer sender (SMTP) ─────────────────────────────────────────────────
async function sendViaNodemailer(to: string, score: number, reportUrl: string): Promise<void> {
  // Dynamic import so it doesn't break if nodemailer isn't installed
  const nodemailer = await import("nodemailer").catch(() => {
    throw new Error("nodemailer not installed — run: npm install nodemailer")
  })

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  await transporter.sendMail({
    from: `"${process.env.EMAIL_FROM_NAME ?? "Visoage"}" <${process.env.EMAIL_FROM ?? "noreply@visoage.com"}>`,
    to,
    subject: "Your Visoage Skin Analysis Report",
    text: buildEmailText(score, reportUrl),
    html: buildEmailHtml(score, reportUrl),
  })
}

// ─── Route handler ─────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<EmailRequestBody>

    const { email, score, reportId, reportUrl } = body

    // Validate
    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }
    if (typeof score !== "number") {
      return NextResponse.json({ error: "score is required" }, { status: 400 })
    }

    const url =
      reportUrl ?? `${process.env.NEXT_PUBLIC_APP_URL ?? "https://visoage.com"}/report/${reportId}`

    // Try SendGrid first, then SMTP, then 501
    if (process.env.SENDGRID_API_KEY) {
      await sendViaSendGrid(email, score, url)
    } else if (process.env.SMTP_HOST) {
      await sendViaNodemailer(email, score, url)
    } else {
      return NextResponse.json(
        {
          error: "Email service not configured",
          hint: "Set SENDGRID_API_KEY or SMTP_HOST/SMTP_USER/SMTP_PASS in .env.local",
        },
        { status: 501 }
      )
    }

    return NextResponse.json({ success: true, message: `Report sent to ${email}` })
  } catch (error) {
    console.error("[send-report-email]", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to send email" },
      { status: 500 }
    )
  }
}
