"use client"

import Link from "next/link"
import Image from "next/image"
import { Sparkles, FlaskConical, TrendingUp, ChevronRight, Shield } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Nav */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl">
        <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-2xl font-serif italic tracking-tight text-primary">GlowTrack</span>
          </div>
          <Link 
            href="/onboarding/scan"
            className="bg-gradient-to-r from-primary to-primary-container text-primary-foreground px-6 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-all active:scale-95"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative px-6 pt-12 pb-20 overflow-hidden">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="z-10">
              <span className="inline-block py-1 px-3 mb-5 rounded-full bg-primary-fixed text-primary text-xs font-sans tracking-widest uppercase">
                Clinical AI Diagnostics
              </span>
              <h1 className="font-serif text-5xl md:text-6xl text-foreground leading-tight mb-6">
                Find out your <span className="italic text-primary">skin age</span> for free.
              </h1>
              <p className="text-muted-foreground text-lg max-w-md mb-8 leading-relaxed">
                Harnessing precision dermatology and editorial aesthetics to reveal your skin&apos;s true biological narrative.
              </p>
              <Link 
                href="/onboarding/scan"
                className="inline-block bg-gradient-to-r from-primary to-primary-container text-primary-foreground px-10 py-4 rounded-xl text-lg font-semibold shadow-xl shadow-primary/10 hover:shadow-primary/20 transition-all active:scale-95"
              >
                Start Analysis
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-muted">
                <Image
                  src="/images/hero-skin.jpg"
                  alt="Radiant skin"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {/* Decorative Elements */}
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute -top-6 -right-6 w-48 h-48 bg-secondary/20 rounded-full blur-[60px]" />
            </div>
          </div>
        </section>

        {/* Trust Indicator */}
        <section className="bg-muted/50 py-10 px-6">
          <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
            <div className="flex items-center gap-3 text-muted-foreground mb-3">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-xs uppercase tracking-widest font-sans">Clinical-Grade AI Diagnostics</span>
            </div>
            <div className="h-px w-24 bg-border" />
          </div>
        </section>

        {/* Features Section */}
        <section className="px-6 py-20 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16 text-center lg:text-left">
              <h2 className="font-serif text-4xl text-foreground mb-4">Scientific Precision</h2>
              <p className="text-muted-foreground max-w-xl">
                Our laboratory-born algorithms analyze over 50 unique bio-markers to curate your path to luminosity.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="group p-8 rounded-[2rem] bg-card transition-all hover:translate-y-[-4px]">
                <div className="w-14 h-14 mb-6 rounded-2xl bg-muted flex items-center justify-center text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <FlaskConical className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-2xl mb-3">AI Skin Analysis</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                  Instantly receive your biological skin age, comprehensive health score, and deep molecular insights.
                </p>
                <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
                  Explore Metrics <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* Feature 2 */}
              <div className="group p-8 rounded-[2rem] bg-card transition-all hover:translate-y-[-4px]">
                <div className="w-14 h-14 mb-6 rounded-2xl bg-muted flex items-center justify-center text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-2xl mb-3">Custom Routines</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                  Personalized regimens tailored to your existing cabinet and specific dermatological goals.
                </p>
                <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
                  View Regimens <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* Feature 3 */}
              <div className="group p-8 rounded-[2rem] bg-card transition-all hover:translate-y-[-4px]">
                <div className="w-14 h-14 mb-6 rounded-2xl bg-muted flex items-center justify-center text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <TrendingUp className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-2xl mb-3">Progress Tracking</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                  Visualize your skin&apos;s evolution over time with side-by-side comparative analysis and trend data.
                </p>
                <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
                  Track Growth <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-24 bg-muted/50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-6 leading-tight">
              Begin your journey into the <br /><span className="italic">Luminous Laboratory.</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
              Join thousands of individuals optimizing their dermal health through clinical precision.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/onboarding/scan"
                className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary-container text-primary-foreground px-10 py-4 rounded-full text-lg font-semibold shadow-lg shadow-primary/5 active:scale-95 transition-all"
              >
                Join the Luminous Laboratory
              </Link>
              <button className="w-full sm:w-auto text-foreground border border-border px-10 py-4 rounded-full text-lg font-semibold hover:bg-card active:scale-95 transition-all">
                Learn Methodology
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-10 px-6 bg-muted border-t border-border">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 max-w-7xl mx-auto">
          <div className="flex flex-col gap-3 text-center md:text-left">
            <span className="text-lg font-serif italic text-primary">GlowTrack</span>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
              2024 GlowTrack Luminous Laboratory. All rights reserved.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <a className="text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-opacity" href="#">Privacy Policy</a>
            <a className="text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-opacity" href="#">Terms of Service</a>
            <a className="text-xs uppercase tracking-widest text-muted-foreground hover:text-primary underline decoration-primary-container" href="#">Clinical Methodology</a>
            <a className="text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-opacity" href="#">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
