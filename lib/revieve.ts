/**
 * Revieve SDK client-side wrapper
 *
 * The Revieve SDK is a browser-only library (accesses `window` at module load).
 * This module wraps it so it's ONLY imported in browser contexts (not during SSR).
 *
 * Usage: call `analyzeWithRevieve(base64Image)` from a client component.
 */

export interface SkinAnalysisResult {
  skinAge: number | null
  overallScore: number
  metrics: {
    hydration: number
    texture: number
    clarity: number
    radiance: number
    wrinkles: number
    redness: number
    pores: number
    acne: number
    darkSpots: number
    oiliness: number
  }
  insights: Array<{ title: string; description: string; type: "positive" | "neutral" | "negative" }>
  recommendations: string[]
}

function clamp(v: number): number {
  return Math.round(Math.min(100, Math.max(0, v ?? 0)))
}

function buildInsights(m: {
  wrinkles: number
  redness: number
  oiliness: number
  acne: number
  darkSpots: number
  radiance: number
}): SkinAnalysisResult["insights"] {
  const insights: SkinAnalysisResult["insights"] = []
  if (m.radiance >= 70) {
    insights.push({ title: "Strong Radiance", description: "Your skin is showing healthy glow and luminosity.", type: "positive" })
  }
  if (m.wrinkles < 25) {
    insights.push({ title: "Minimal Fine Lines", description: "Low wrinkle activity detected. Your collagen density looks good.", type: "positive" })
  } else if (m.wrinkles >= 50) {
    insights.push({ title: "Fine Lines Detected", description: "Elevated wrinkle markers found. A peptide or retinol treatment may help.", type: "neutral" })
  }
  if (m.redness >= 40) {
    insights.push({ title: "Redness Present", description: "Inflammatory markers detected. Consider a calming serum with niacinamide.", type: "neutral" })
  }
  if (m.acne >= 30) {
    insights.push({ title: "Breakout Risk", description: "Signs of active breakouts or congestion detected. Gentle BHA exfoliation may help.", type: "negative" })
  }
  if (m.oiliness >= 60) {
    insights.push({ title: "High Sebum Activity", description: "T-zone oiliness is elevated. A mattifying moisturizer can balance sebum production.", type: "neutral" })
  }
  if (m.darkSpots >= 30) {
    insights.push({ title: "Pigmentation Spots", description: "Hyperpigmentation markers present. Vitamin C or tranexamic acid serums are effective.", type: "neutral" })
  }
  return insights
}

function buildRecommendations(m: {
  wrinkles: number
  redness: number
  oiliness: number
  acne: number
  darkSpots: number
  hydration: number
}): string[] {
  const recs: string[] = []
  if (m.hydration < 50) recs.push("Add a hyaluronic acid serum for deep hydration")
  if (m.wrinkles >= 30) recs.push("Introduce a retinol treatment 2–3× per week at night")
  if (m.redness >= 40) recs.push("Use a niacinamide serum to reduce redness and reinforce the barrier")
  if (m.oiliness >= 50) recs.push("Switch to a lightweight, oil-free moisturizer")
  if (m.acne >= 30) recs.push("Apply a salicylic acid (BHA) toner to prevent breakouts")
  if (m.darkSpots >= 30) recs.push("Apply vitamin C serum every morning for brightening")
  recs.push("Wear SPF 30+ sunscreen daily to prevent further photo-aging")
  return recs.slice(0, 5)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildResult(sdk: any): SkinAnalysisResult {
  const wrinkles  = clamp(sdk.CV.getWrinkles?.())
  const redness   = clamp(sdk.CV.getRedness?.())
  const oiliness  = clamp(sdk.CV.getSkinShine?.())
  const texture   = clamp(sdk.CV.getTexture?.())
  const hyperpig  = clamp(sdk.CV.getHyperpigmentation?.())
  const darkSpots = clamp(sdk.CV.getDarkSpots?.() ?? hyperpig)
  const radiance  = clamp(sdk.CV.getRadiance?.() ?? 50)
  const acne      = clamp(sdk.CV.getAcne?.() ?? 0)
  const rawAge    = sdk.CV.getSkinAge?.() as number | undefined

  const clarity   = clamp(100 - (redness + acne + hyperpig) / 3)
  const hydration = clamp(100 - (wrinkles * 0.4 + oiliness * 0.2 + redness * 0.4))
  const overallScore = Math.round(
    radiance * 0.2 + clarity * 0.2 + hydration * 0.2 + (100 - wrinkles) * 0.2 + texture * 0.2
  )

  const metrics = { hydration, texture, clarity, radiance, wrinkles, redness, pores: Math.round(oiliness * 0.8), acne, darkSpots, oiliness }
  const insights = buildInsights({ wrinkles, redness, oiliness, acne, darkSpots, radiance })
  const recommendations = buildRecommendations({ wrinkles, redness, oiliness, acne, darkSpots, hydration })

  return { skinAge: rawAge ?? null, overallScore, metrics, insights, recommendations }
}

export function mockAnalysis(): SkinAnalysisResult {
  return {
    skinAge: 27,
    overallScore: 82,
    metrics: { hydration: 78, texture: 85, clarity: 80, radiance: 74, wrinkles: 18, redness: 22, pores: 30, acne: 12, darkSpots: 25, oiliness: 38 },
    insights: [
      { title: "Strong Radiance", description: "Your skin is showing healthy glow and luminosity.", type: "positive" },
      { title: "Minimal Fine Lines", description: "Low wrinkle activity detected. Your collagen density looks good.", type: "positive" },
      { title: "Pigmentation Spots", description: "Hyperpigmentation markers present. Vitamin C serums are effective.", type: "neutral" },
    ],
    recommendations: [
      "Apply vitamin C serum every morning for brightening",
      "Switch to a lightweight, oil-free moisturizer",
      "Wear SPF 30+ sunscreen daily to prevent further photo-aging",
      "Add a hyaluronic acid serum for deep hydration",
    ],
  }
}

/**
 * Run Revieve CV analysis entirely in the browser.
 * @param base64Image  data URL string (e.g. "data:image/jpeg;base64,...")
 * @param partnerId    from env or provided dynamically
 * @param isTest       connect to Revieve test environment
 */
export async function analyzeWithRevieve(
  base64Image: string,
  partnerId: string,
  isTest = true
): Promise<SkinAnalysisResult> {
  if (!partnerId || partnerId === "YOUR_PARTNER_ID_HERE") {
    // No real partner ID — return mock for development
    console.warn("[Revieve] No partnerId — returning mock analysis")
    return mockAnalysis()
  }

  // Dynamic import keeps the SDK out of SSR bundles entirely
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const RevieveSDK: any = (await import("@revieve/sdk")).default ?? (await import("@revieve/sdk"))

  const sdk = new RevieveSDK(partnerId, isTest)
  sdk.setUserId("user-" + Date.now())
  sdk.setGender(RevieveSDK.gender?.FEMALE ?? 0)
  sdk.setConfiguration({
    components: [
      "wrinkles", "redness", "shine", "acne", "texture",
      "smoothness", "hyperpigmentation", "dark_spots",
      "dull_skin", "radiance", "uneven_skin_tone", "eyes",
    ],
  })

  await sdk.CV.setImage(base64Image)
  await sdk.CV.analyzeImage()

  return buildResult(sdk)
}
