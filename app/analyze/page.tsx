"use client"

import { useState, useRef, useCallback } from "react"
import { Camera, RotateCcw, Loader2, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

type AnalysisState = "camera" | "capturing" | "analyzing" | "complete"

export default function AnalyzePage() {
  const [state, setState] = useState<AnalysisState>("camera")
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } }
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch {
      console.log("[v0] Camera access denied or not available")
    }
  }, [])

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d")
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth
        canvasRef.current.height = videoRef.current.videoHeight
        context.drawImage(videoRef.current, 0, 0)
        const imageData = canvasRef.current.toDataURL("image/jpeg")
        setCapturedImage(imageData)
        setState("capturing")

        // Stop the camera
        const stream = videoRef.current.srcObject as MediaStream
        stream?.getTracks().forEach(track => track.stop())
      }
    }
  }

  const retake = async () => {
    setCapturedImage(null)
    setState("camera")
    await startCamera()
  }

  const analyze = () => {
    setState("analyzing")
    // Simulate analysis
    setTimeout(() => {
      setState("complete")
    }, 3000)
  }

  const viewResults = () => {
    router.push("/report/new")
  }

  return (
    <div className="fixed inset-0 bg-black">
      {/* Camera View */}
      {state === "camera" && (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            onLoadedMetadata={() => startCamera()}
            className="w-full h-full object-cover"
          />
          
          {/* Face Guide Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative w-72 h-96">
              <svg viewBox="0 0 200 260" className="w-full h-full">
                <ellipse
                  cx="100"
                  cy="130"
                  rx="80"
                  ry="110"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="8 4"
                  opacity="0.6"
                />
              </svg>
            </div>
          </div>

          {/* Instructions */}
          <div className="absolute top-safe top-16 left-0 right-0 text-center">
            <p className="text-white/90 text-sm font-medium">Position your face in the oval</p>
            <p className="text-white/60 text-xs mt-1">Good lighting, neutral expression</p>
          </div>

          {/* Capture Button */}
          <div className="absolute bottom-16 left-0 right-0 flex justify-center">
            <button
              onClick={capturePhoto}
              className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white active:scale-95 transition-transform"
            >
              <div className="w-16 h-16 rounded-full bg-white" />
            </button>
          </div>

          {/* Close Button */}
          <button
            onClick={() => router.back()}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Captured Image Preview */}
      {(state === "capturing" || state === "analyzing" || state === "complete") && capturedImage && (
        <>
          <img
            src={capturedImage}
            alt="Captured"
            className={cn(
              "w-full h-full object-cover transition-all duration-500",
              state === "analyzing" && "blur-sm scale-105"
            )}
          />

          {/* Analysis Overlay */}
          {state === "analyzing" && (
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-white/30 border-t-white animate-spin" />
                <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-white animate-pulse" />
              </div>
              <p className="text-white text-lg font-medium mt-6">Analyzing your skin...</p>
              <p className="text-white/60 text-sm mt-2">This may take a moment</p>
            </div>
          )}

          {/* Complete Overlay */}
          {state === "complete" && (
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center animate-in zoom-in duration-300">
                <Check className="h-10 w-10 text-white" />
              </div>
              <p className="text-white text-xl font-medium mt-6">Analysis Complete!</p>
              <p className="text-white/60 text-sm mt-2">Your skin health score is ready</p>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="absolute bottom-16 left-0 right-0 px-6">
            {state === "capturing" && (
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={retake}
                  className="flex-1 bg-white/10 border-white/30 text-white hover:bg-white/20 rounded-xl"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Retake
                </Button>
                <Button
                  size="lg"
                  onClick={analyze}
                  className="flex-1 bg-white text-black hover:bg-white/90 rounded-xl"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Analyze
                </Button>
              </div>
            )}
            
            {state === "complete" && (
              <Button
                size="lg"
                onClick={viewResults}
                className="w-full bg-primary text-white hover:bg-primary/90 rounded-xl"
              >
                View Results
              </Button>
            )}
          </div>
        </>
      )}

      {/* Hidden Canvas */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
