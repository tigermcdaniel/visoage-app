"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CheckoutPage() {
  const router = useRouter()

  // Promo code state
  const [promoCode, setPromoCode] = useState("")
  const [promoError, setPromoError] = useState<string | null>(null)
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoLoading, setPromoLoading] = useState(false)

  // Payment form state (shown when no valid promo)
  const [paid, setPaid] = useState(false)

  async function handleApplyPromo() {
    setPromoError(null)
    setPromoLoading(true)

    try {
      const res = await fetch("/api/validate-promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode }),
      })

      const data = await res.json()

      if (data.valid) {
        setPromoApplied(true)
        setPaid(true)
        // Skip payment — redirect straight to upload
        router.push("/upload")
      } else {
        setPromoError(data.message ?? "Invalid promo code.")
      }
    } catch {
      setPromoError("Could not validate promo code. Please try again.")
    } finally {
      setPromoLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleApplyPromo()
  }

  function handlePayment(e: React.FormEvent) {
    e.preventDefault()
    // TODO: integrate Stripe / payment processor here
    setPaid(true)
    router.push("/upload")
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="font-serif italic text-3xl text-primary">Checkout</h1>
          <p className="text-muted-foreground text-sm">
            Get your personalized skin analysis report.
          </p>
        </div>

        {/* Promo Code Section */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
          <p className="text-sm font-medium text-foreground">Have a promo code?</p>

          <div className="flex gap-2">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => {
                setPromoCode(e.target.value)
                setPromoError(null)
              }}
              onKeyDown={handleKeyDown}
              placeholder="Enter code"
              className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              disabled={promoApplied || promoLoading}
              aria-label="Promo code"
            />
            <button
              onClick={handleApplyPromo}
              disabled={!promoCode.trim() || promoApplied || promoLoading}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              {promoLoading ? "Checking…" : "Apply Code"}
            </button>
          </div>

          {/* Error message */}
          {promoError && (
            <p className="text-xs text-destructive" role="alert">
              {promoError}
            </p>
          )}

          {/* Success message (brief — redirect fires immediately) */}
          {promoApplied && (
            <p className="text-xs text-green-600" role="status">
              ✓ Promo code applied! Redirecting…
            </p>
          )}
        </div>

        {/* Payment Form (shown when no promo applied) */}
        {!paid && (
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <p className="text-sm font-medium text-foreground">Or pay with card</p>

            <form onSubmit={handlePayment} className="space-y-4">
              {/* Card Number */}
              <div className="space-y-1">
                <label htmlFor="card-number" className="text-xs text-muted-foreground">
                  Card number
                </label>
                <input
                  id="card-number"
                  type="text"
                  placeholder="4242 4242 4242 4242"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              {/* Expiry + CVC */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="expiry" className="text-xs text-muted-foreground">
                    Expiry
                  </label>
                  <input
                    id="expiry"
                    type="text"
                    placeholder="MM / YY"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="cvc" className="text-xs text-muted-foreground">
                    CVC
                  </label>
                  <input
                    id="cvc"
                    type="text"
                    placeholder="123"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              {/* Price summary */}
              <div className="flex items-center justify-between rounded-lg bg-muted/40 px-4 py-3 text-sm">
                <span className="text-muted-foreground">Skin Analysis Report</span>
                <span className="font-semibold text-foreground">$9.99</span>
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Pay $9.99
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
