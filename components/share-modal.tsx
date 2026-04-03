"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// ─── Social icons as simple SVGs ─────────────────────────────────────────────
function TwitterXIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  )
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface ShareModalProps {
  open: boolean
  onClose: () => void
  score: number
  reportId: string
  reportUrl?: string
}

// ─── Component ────────────────────────────────────────────────────────────────
export function ShareModal({ open, onClose, score, reportId, reportUrl }: ShareModalProps) {
  // Build the share URL — use provided URL or the current page
  const shareUrl =
    reportUrl ??
    (typeof window !== "undefined" ? window.location.href : `https://visoage.com/report/${reportId}`)

  const shareMessage = `✨ Just got my skin analysis from Visoage! I scored ${score}/100. Get your free skin health report:`

  // ── Share handlers ──────────────────────────────────────────────────────────
  function handleTwitter() {
    const text = encodeURIComponent(shareMessage)
    const url = encodeURIComponent(shareUrl)
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      "_blank",
      "noopener,noreferrer"
    )
  }

  function handleFacebook() {
    const url = encodeURIComponent(shareUrl)
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      "_blank",
      "noopener,noreferrer"
    )
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent className="max-w-sm mx-auto rounded-3xl p-6">
        <DialogHeader className="space-y-1 pb-2">
          <DialogTitle className="font-serif text-xl text-center">Share Your Results</DialogTitle>
          <p className="text-xs text-center text-muted-foreground">
            Score: <span className="font-semibold text-primary">{score}/100</span>
          </p>
        </DialogHeader>

        <div className="space-y-3 pt-2">
          {/* Twitter / X */}
          <button
            onClick={handleTwitter}
            className="w-full flex items-center gap-4 p-3.5 rounded-2xl bg-foreground/5 hover:bg-foreground/10 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center shrink-0">
              <TwitterXIcon className="w-4 h-4 text-background" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-foreground">Twitter / X</p>
              <p className="text-xs text-muted-foreground">Post your skin score</p>
            </div>
          </button>

          {/* Facebook */}
          <button
            onClick={handleFacebook}
            className="w-full flex items-center gap-4 p-3.5 rounded-2xl bg-[#1877F2]/10 hover:bg-[#1877F2]/20 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-[#1877F2] flex items-center justify-center shrink-0">
              <FacebookIcon className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-foreground">Facebook</p>
              <p className="text-xs text-muted-foreground">Share to your timeline</p>
            </div>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
