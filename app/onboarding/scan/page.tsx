"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Camera, ArrowLeft, ScanFace, Zap, RotateCcw, Check } from "lucide-react"

export default function ScanStep() {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [skinAge, setSkinAge] = useState<number | null>(null)
  const [vitalityScore, setVitalityScore] = useState<number | null>(null)

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 1280, height: 720 }
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      setIsCameraActive(true)
    } catch {
      console.log("Camera not available")
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setIsCameraActive(false)
  }

  const captureAndAnalyze = () => {
    stopCamera()
    setIsAnalyzing(true)
    
    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false)
      setAnalysisComplete(true)
      setSkinAge(Math.floor(Math.random() * 5) + 24)
      setVitalityScore(Math.floor(Math.random() * 15) + 80)
    }, 3000)
  }

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [stream])

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-8">
        <div className="w-16" />
        <span className="text-xs uppercase tracking-widest text-muted-foreground">Step 1 of 4</span>
        <button
          onClick={() => router.push("/onboarding/goals")}
          className="text-xs uppercase tracking-widest text-primary font-semibold hover:underline"
        >
          Skip
        </button>
      </div>

      {/* Hero */}
      <section className="text-center mb-8">
        <h1 className="font-serif text-4xl text-foreground mb-3 leading-tight">
          Your First <span className="italic text-primary">Skin Scan</span>
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Position your face in the frame. Our AI will analyze your skin&apos;s unique characteristics.
        </p>
      </section>

      {/* Camera View */}
      <div className="relative mb-8">
        <div className="aspect-[4/5] rounded-[2rem] overflow-hidden bg-muted relative">
          {!isCameraActive && !isAnalyzing && !analysisComplete && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                <ScanFace className="w-12 h-12 text-primary" />
              </div>
              <button
                onClick={startCamera}
                className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary-container text-primary-foreground px-8 py-4 rounded-xl font-semibold shadow-lg"
              >
                <Camera className="w-5 h-5" />
                Open Camera
              </button>
            </div>
          )}
          
          {isCameraActive && (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {/* Face Guide Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-80 border-2 border-dashed border-primary/60 rounded-[50%]" />
              </div>
              <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-4">
                <button
                  onClick={stopCamera}
                  className="w-12 h-12 rounded-full bg-card/80 backdrop-blur flex items-center justify-center text-foreground"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
                <button
                  onClick={captureAndAnalyze}
                  className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-primary-container flex items-center justify-center shadow-xl"
                >
                  <div className="w-16 h-16 rounded-full border-4 border-white" />
                </button>
                <div className="w-12 h-12" /> {/* Spacer for symmetry */}
              </div>
            </>
          )}

          {isAnalyzing && (
            <div className="absolute inset-0 bg-background/90 flex flex-col items-center justify-center gap-6">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                <Zap className="w-12 h-12 text-primary" />
              </div>
              <div className="text-center">
                <p className="font-serif text-2xl text-foreground mb-2">Analyzing...</p>
                <p className="text-sm text-muted-foreground">Our AI is examining 50+ bio-markers</p>
              </div>
              <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full animate-[loading_3s_ease-in-out]" 
                  style={{ animation: "loading 3s ease-in-out forwards" }} />
              </div>
            </div>
          )}

          {analysisComplete && (
            <div className="absolute inset-0 bg-background flex flex-col items-center justify-center gap-8 p-8">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                <Check className="w-8 h-8 text-primary-foreground" />
              </div>
              <p className="text-xs uppercase tracking-widest text-primary font-semibold">Analysis Complete</p>
              
              <div className="flex items-center gap-10">
                <div className="text-center">
                  <p className="font-serif text-6xl font-bold text-primary">{vitalityScore}</p>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">Vitality Score</p>
                </div>
                <div className="w-px h-16 bg-border" />
                <div className="text-center">
                  <p className="font-serif text-6xl font-bold text-primary">{skinAge}</p>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">Skin Age</p>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground text-center max-w-xs">
                Your skin is showing high vitality with localized areas of environmental stress.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Tips */}
      {!analysisComplete && (
        <div className="bg-card rounded-2xl p-6 mb-8">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-4">Tips for best results</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Use natural, even lighting
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Remove makeup for accurate analysis
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Keep a neutral expression
            </li>
          </ul>
        </div>
      )}

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 w-full p-6 bg-white/80 backdrop-blur-xl z-50 rounded-t-[2rem] shadow-lg">
        <div className="max-w-2xl mx-auto">
          {analysisComplete ? (
            <button
              onClick={() => router.push("/onboarding/goals")}
              className="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-primary-foreground rounded-full font-semibold text-sm uppercase tracking-widest shadow-lg"
            >
              Continue to Goals
            </button>
          ) : (
            <button
              onClick={() => router.push("/")}
              className="w-full flex items-center justify-center gap-2 py-4 text-muted-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to Home</span>
            </button>
          )}
          <p className="text-center mt-3 text-muted-foreground text-[10px] uppercase tracking-widest">
            Step 1 of 4 • Skin Analysis
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes loading {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  )
}
