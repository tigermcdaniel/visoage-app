"use client"

interface OnboardingProgressProps {
  currentStep: number
  totalSteps?: number
}

export function OnboardingProgress({ currentStep, totalSteps = 4 }: OnboardingProgressProps) {
  const progress = (currentStep / totalSteps) * 100

  return (
    <div className="w-full">
      <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between mt-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-semibold transition-all ${
              index + 1 <= currentStep
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {index + 1}
          </div>
        ))}
      </div>
    </div>
  )
}
